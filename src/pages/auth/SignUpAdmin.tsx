import { useEffect, useState } from "react";
import { signUpAdminWithEmail } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { CollegeData } from "../../interface/College";
import { getColleges } from "../../services/collegeService";
import { AdminData } from "../../interface/Admin";

const SignUpAdmin = () => {
  const navigate = useNavigate();

  const [colleges, setColleges] = useState<CollegeData[]>([]);
  const [filteredColleges, setFilteredColleges] = useState<CollegeData[]>([]);
  const [selectedCollege, setSelectedCollege] = useState<CollegeData | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [collegeInput, setCollegeInput] = useState("");


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    college_id: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.department.trim()) newErrors.department = "Department is required";
    if (!formData.college_id.trim()) newErrors.college_id = "College is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const fetchColleges = async () => {
      const data = await getColleges();
      setColleges(data);
    };
    fetchColleges();
  }, []);

  const handleCollegeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCollegeInput(value);
    setShowSuggestions(true);
    setFormData((prev) => ({
      ...prev,
      college_id: "", // Clear previously selected ID
      department: "",
    }));
  
    const filtered = colleges.filter((college) =>
      college.name.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredColleges(filtered);
    setSelectedCollege(null);
  };
  

  const handleCollegeSelect = (college: CollegeData) => {
    setSelectedCollege(college);
    setCollegeInput(college.name); // Show name in input box
    setShowSuggestions(false);
    setFormData((prev) => ({
      ...prev,
      college_id: college.id,
      department: "",
    }));
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const { confirmPassword, password, ...rest } = formData;

      const adminData: Omit<AdminData, "id"> & { collegeId: string } = {
        ...rest,
        role: "admin",
        collegeId: selectedCollege!.id,
      };

      await signUpAdminWithEmail(adminData, password);
      navigate("/login");
    } catch (err) {
      console.error("Error signing up", err);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl max-sm:max-w-lg mx-auto font-[sans-serif] p-6">
      <div className="text-center mb-12 sm:mb-16">
        <h4 className="text-gray-600 text-xl mt-6 font-semibold">
          Admin Registration
        </h4>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="text-gray-600 text-sm mb-2 block">Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              type="text"
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded"
              placeholder="Enter name"
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
          </div>

          <div>
            <label className="text-gray-600 text-sm mb-2 block">Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded"
              placeholder="Enter email"
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
          </div>

          <div className="relative">
            <label className="text-gray-600 text-sm mb-2 block">College Name</label>
            <input
              name="college_id"
              value={collegeInput}
              onChange={handleCollegeInputChange}
              type="text"
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded"
              placeholder="Start typing college name"
              autoComplete="off"
            />
            {showSuggestions && filteredColleges.length > 0 && (
              <ul className="absolute z-10 bg-white border rounded shadow-md w-full max-h-48 overflow-y-auto mt-1">
                {filteredColleges.map((college) => (
                  <li
                    key={college.id}
                    onClick={() => handleCollegeSelect(college)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    {college.name}
                  </li>
                ))}
              </ul>
            )}
            {errors.college_id && <p className="text-red-500 text-xs">{errors.college_id}</p>}
          </div>

          <div>
            <label className="text-gray-600 text-sm mb-2 block">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded"
              disabled={!selectedCollege}
            >
              <option value="">Select Department</option>
              {selectedCollege?.departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {errors.department && <p className="text-red-500 text-xs">{errors.department}</p>}
          </div>

          <div>
            <label className="text-gray-600 text-sm mb-2 block">Phone</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              type="text"
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded"
              placeholder="Enter phone number"
            />
            {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
          </div>

          <div>
            <label className="text-gray-600 text-sm mb-2 block">Password</label>
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded"
              placeholder="Enter password"
            />
            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
          </div>

          <div>
            <label className="text-gray-600 text-sm mb-2 block">Confirm Password</label>
            <input
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              type="password"
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded"
              placeholder="Re-enter password"
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
          </div>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            className="mx-auto block py-3 px-6 text-sm tracking-wider rounded text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
          >
            Sign up as Admin
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUpAdmin;
