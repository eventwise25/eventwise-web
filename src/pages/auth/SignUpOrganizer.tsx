import { useEffect, useState } from "react";
import { signUpOrganizerWithEmail } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { CollegeData } from "../../interface/College";
import { getColleges } from "../../services/collegeService";
import { OrganizerData } from "../../interface/Organizer";

const SignUpOrganizer = () => {
  const navigate = useNavigate();

  // CollegeData States
  const [colleges, setColleges] = useState<CollegeData[]>([]);
  const [filteredColleges, setFilteredColleges] = useState<CollegeData[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState<CollegeData | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    // roll_no: "",
    college_id: "",
    department: "",
    // date_of_birth: "",
    // year: "",
    description: "",
    password: "",
    confirmPassword: "",
  });


  // Error state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear errors when typing
  };

  // Validate form
  const validateForm = () => {
    let newErrors: { [key: string]: string } = {};

    // if (!formData.roll_no.trim()) newErrors.roll_no = "Roll number is required";
    if (!formData.college_id.trim()) newErrors.college_id = "CollegeData ID is required";
    // if (!formData.date_of_birth.trim()) newErrors.date_of_birth = "Date of birth is required";
    // if (!formData.year.trim()) newErrors.year = "Year is required";
    if (!formData.department.trim()) newErrors.department = "Department is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Load colleges on mount
  useEffect(() => {
    const fetchColleges = async () => {
      const data = await getColleges();
      setColleges(data);
    };
    fetchColleges();
  }, []);

  const handleCollegeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // setFormData({ ...formData, college_id: value });
    setShowSuggestions(true);

    setFormData((prev) => ({
      ...prev,
      college_id: value,
      department: "",
    }));
    const filtered = colleges.filter((college) =>
      college.name.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredColleges(filtered);
    setSelectedCollege(null);
  };

  const handleCollegeSelect = (college: CollegeData) => {
    // setFormData({ ...formData, college_id: college.id });
    setSelectedCollege(college);
    setShowSuggestions(false);
    setFormData((prev) => ({
      ...prev,
      college_id: college.id,
      department: "",
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const { confirmPassword, password, ...rest } = formData;

      const organizerData: Omit<OrganizerData, "id"> = {
        ...rest,
        role: "organizer",
      };

      await signUpOrganizerWithEmail(organizerData, password);
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
          Sign up your account
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
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="text-gray-600 text-sm mb-2 block">Email Id</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded"
              placeholder="Enter email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}
          </div>



        </div>
          <div className="my-3">
            <label className="text-gray-600 text-sm mb-2 block">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded"
              placeholder="Enter event description"
              rows={4}
            />
          </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="relative">
            <label className="text-gray-600 text-sm mb-2 block">College Name</label>
            <input
              name="college_id"
              value={selectedCollege?.name}
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
            {errors.department && (
              <p className="text-red-500 text-xs">{errors.department}</p>
            )}
          </div>



          {/* <div>
            <label className="text-gray-600 text-sm mb-2 block">Date of Birth</label>
            <input
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              type="date"
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded"
            />
          </div> */}

          {/* <div>
            <label className="text-gray-600 text-sm mb-2 block">Year</label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded"
            >
              <option value="">Select Year</option>
              <option value="1st">1st Year</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
              <option value="4th">4th Year</option>
            </select>
          </div> */}


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
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="text-gray-600 text-sm mb-2 block">
              Confirm Password
            </label>
            <input
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              type="password"
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded"
              placeholder="Enter confirm password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
            )}
          </div>
          <div>
            <label className="text-gray-600 text-sm mb-2 block">
              Mobile No.
            </label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              type="text"
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded"
              placeholder="Enter mobile number"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs">{errors.phone}</p>
            )}
          </div>

          {/* <div>
            <label className="text-gray-600 text-sm mb-2 block">
              Department
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded"
            >
              <option value="">Select Department</option>
              <option value="Computer">Computer Science and Engineering</option>
              <option value="IT">Information Technology</option>
              <option value="AIML">
                Computer Science and Engineering (Artificial Intelligence and
                Machine Learning){" "}
              </option>
              <option value="Civil">Civil Engineering</option>
              <option value="mechanical">Mechanical Engineering</option>
              <option value="entc">
                Electronics and Telecommunication Engineering
              </option>
              <option value="library">Library</option>
              <option value="hostel">Hostel</option>
            </select>
            {errors.department && (
              <p className="text-red-500 text-xs">{errors.department}</p>
            )}
          </div> */}
        </div>

        <div className="mt-8">
          <button
            type="submit"
            className="mx-auto block py-3 px-6 text-sm tracking-wider rounded text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUpOrganizer;
