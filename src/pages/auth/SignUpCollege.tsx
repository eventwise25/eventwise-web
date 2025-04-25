import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { signUpCollegeWithEmail } from "../../services/authService";

const SignUpCollege = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "Pimpri Chinchwad College of Engineering",
    email: "pccoepune@gmail.com",
    website: "https://www.pccoepune.com/",
    location: {
      address: "PCCOE College Campus, Lions club chowk, near akurdi railway station, Akurdi",
      city: "Pune",
      country: "India",
      pincode: "411035",
    },
    departments: [""],
    password: "",
    confirmPassword: "",
    role: "college" as const,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (["address", "city", "country", "pincode"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDepartmentChange = (index: number, value: string) => {
    const updatedDepartments = [...formData.departments];
    updatedDepartments[index] = value;
    setFormData((prev) => ({ ...prev, departments: updatedDepartments }));
  };

  const addDepartmentField = () => {
    setFormData((prev) => ({
      ...prev,
      departments: [...prev.departments, ""],
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = "College name is required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Invalid email format";
    if (!formData.website.trim()) newErrors.website = "Website is required";
    if (!formData.location.address.trim()) newErrors.address = "Address is required";
    if (!formData.location.city.trim()) newErrors.city = "City is required";
    if (!formData.location.country.trim()) newErrors.country = "Country is required";
    if (!formData.location.pincode.trim()) newErrors.pincode = "Pincode is required";

    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (formData.departments.some((d) => d.trim() === ""))
      newErrors.departments = "Department names cannot be empty";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const { password, confirmPassword, ...collegeData } = formData;

    try {
      const college = await signUpCollegeWithEmail(collegeData, password);
      dispatch(setUser(college));
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Signup failed. Try again.");
    }
  };

  const removeDepartmentField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      departments: prev.departments.filter((_, i) => i !== index),
    }));
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">Register New College</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="College Name"
            className="w-full px-4 py-2 border rounded"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <input
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="Website"
            className="w-full px-4 py-2 border rounded"
          />
          {errors.website && <p className="text-red-500 text-sm">{errors.website}</p>}

          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

          <input
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            type="password"
            placeholder="Confirm Password"
            className="w-full px-4 py-2 border rounded"
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}

          {/* Location Fields */}
          <input
            name="address"
            value={formData.location.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full px-4 py-2 border rounded"
          />
          {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}

          <div className="grid grid-cols-3 gap-4">
            <input
              name="city"
              value={formData.location.city}
              onChange={handleChange}
              placeholder="City"
              className="px-4 py-2 border rounded"
            />
            <input
              name="country"
              value={formData.location.country}
              onChange={handleChange}
              placeholder="Country"
              className="px-4 py-2 border rounded"
            />
            <input
              name="pincode"
              value={formData.location.pincode}
              onChange={handleChange}
              placeholder="Pincode"
              className="px-4 py-2 border rounded"
            />
          </div>
          {(errors.city || errors.country || errors.pincode) && (
            <p className="text-red-500 text-sm">
              {errors.city || errors.country || errors.pincode}
            </p>
          )}

          {/* Departments */}
          <div className="space-y-2">
            <label className="block font-medium">Departments</label>
            {formData.departments.map((dep, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  value={dep}
                  onChange={(e) => handleDepartmentChange(index, e.target.value)}
                  className="w-full px-4 py-2 border rounded"
                  placeholder={`Department ${index + 1}`}
                />
                {formData.departments.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDepartmentField(index)}
                    className="text-red-500 text-lg font-bold px-2"
                    title="Remove"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            {errors.departments && <p className="text-red-500 text-sm">{errors.departments}</p>}
            <button type="button" onClick={addDepartmentField} className="text-blue-600 mt-2 text-sm font-medium">
              + Add Department
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Submit College
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpCollege;
