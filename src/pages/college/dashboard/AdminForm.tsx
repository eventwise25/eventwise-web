import { useState } from "react";
import { useSelector } from "react-redux"; // or your global state hook
import { addAdmin } from "../../../services/adminService";
import { toast } from "react-toastify";
import { AdminData } from "../../../interface/Admin";
import { RootState } from "../../../redux/store"; // adjust based on your store location

const AdminForm = () => {
  const { user } = useSelector((state: RootState) => state.auth); // Assumes user is stored in auth slice

  const [formData, setFormData] = useState<Omit<AdminData, "id" | "college_id">>({
    name: "",
    email: "",
    phone: "",
    department: "",
    role: "admin",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error("User not found. Please log in again.");
      return;
    }

    try {
      await addAdmin(user.id, {
        ...formData,
        college_id: user.id,
      } as AdminData);

      toast.success("Admin added successfully!");

      setFormData({
        name: "",
        email: "",
        phone: "",
        department: "",
        role: "admin",
      });
    } catch (error) {
      toast.error("Failed to add admin.");
      console.error(error);
    }
  };

  return (
    <>

      {
        !user || user.role !== "college" ? (
          <div>Access Restricted! Only college accounts can add resources.</div>
        ) 
        :
        (
          <form onSubmit={handleSubmit} className="grid gap-6 bg-white p-6 rounded-lg shadow-md">
              {/* Name */}
              <div>
                <label className="text-gray-600 text-md mb-2 block">Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  type="text"
                  className="bg-gray-100 w-full text-gray-800 text-md px-4 py-3 rounded"
                  placeholder="Enter admin name"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-gray-600 text-md mb-2 block">Email</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  className="bg-gray-100 w-full text-gray-800 text-md px-4 py-3 rounded"
                  placeholder="Enter admin email"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-gray-600 text-md mb-2 block">Phone</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  type="tel"
                  className="bg-gray-100 w-full text-gray-800 text-md px-4 py-3 rounded"
                  placeholder="Enter phone number"
                  required
                />
              </div>

              {/* Department */}
              <div>
                <label className="text-gray-600 text-md mb-2 block">Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="bg-gray-100 w-full text-gray-800 text-md px-4 py-3 rounded"
                  required
                >
                  <option value="" disabled>Select a department</option>
                  {user.departments?.map((dept: string, index: number) => (
                    <option key={index} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-blue-600 text-white text-md px-4 py-3 rounded hover:bg-blue-700 transition"
              >
                Add Admin
              </button>
          </form>
        )
      }
    </>

  );
};

export default AdminForm;
