import { useState, useEffect } from "react";
import { addResource, getAllResources } from "../../../services/resourceService";
import { toast } from "react-toastify";
import { fetchAdmins } from "../../../services/adminService";
import { Resource } from "../../../interface/Resources";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { AdminData } from "../../../interface/Admin";

const AddResource = () => {
  const [formData, setFormData] = useState<Omit<Resource, "id" | "booked_slots">>({
    name: "",
    adminId: "",
    type: "",
    department: "",
    alternative_resources: [],
  });

  const [admins, setAdmins] = useState<AdminData[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (user) {
          const adminList = await fetchAdmins(user?.id);
          const resourceList = await getAllResources(user?.id);
          setAdmins(adminList);
          setResources(resourceList);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    loadData();
  }, [user]);

  console.log(admins);
  console.log(resources);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (resourceId: string, checked: boolean) => {
    setFormData((prev) => {
      const selected = [...prev.alternative_resources];
      if (checked) {
        if (!selected.includes(resourceId)) {
          selected.push(resourceId);
        }
      } else {
        const index = selected.indexOf(resourceId);
        if (index > -1) selected.splice(index, 1);
      }
      return { ...prev, alternative_resources: selected };
    });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if(user){
        const newResource: Omit<Resource, "id"> = {
          ...formData,
          booked_slots: [], // Default empty array
        };
        
        const id = await addResource(user.id, newResource);
        toast.success("Resource added successfully!");
        setFormData({
          name: "",
          adminId: "",
          type: "",
          department: "",
          alternative_resources: [],
        });
  
        // setResources((prev) => [...prev, {
        //   ...newResource, id
        // }]);
        setResources((prev) => [
          ...prev,
          {
            ...newResource,
            id: id, // add the id before pushing to state
          },
        ]);
      }
    } catch (error) {
      toast.error("Failed to add resource.");
      console.error(error);
    }
  };

  return (
    <>
      {
        !user || user.role !== "college" ? (
          <div>Access Restricted! Only college accounts can add resources.</div>
        ) : 
        (
          <form onSubmit={handleSubmit} className="grid gap-6 bg-white p-6 rounded-lg shadow-md">
            {/* Name */}
            <div>
              <label className="text-gray-600 text-md mb-2 block">Resource Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                className="bg-gray-100 w-full text-gray-800 text-md px-4 py-3 rounded"
                placeholder="Enter resource name"
                required
              />
            </div>
      
            {/* Admin ID */}
            <div>
              <label className="text-gray-600 text-md mb-2 block">Admin</label>
              <select
                name="adminId"
                value={formData.adminId}
                onChange={handleChange}
                className="bg-gray-100 w-full text-gray-800 text-md px-4 py-3 rounded"
                required
              >
                <option value="">Select an Admin</option>
                {admins.map((admin) => (
                  <option key={admin.id} value={admin.id}>
                    {admin.name}
                  </option>
                ))}
              </select>
            </div>
      
            {/* Type */}
            <div>
              <label className="text-gray-600 text-md mb-2 block">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="bg-gray-100 w-full text-gray-800 text-md px-4 py-3 rounded"
                required
              >
                <option value="">Select Type</option>
                <option value="Hall">Hall</option>
                <option value="Ground">Ground</option>
                <option value="Canteen">Canteen</option>
                <option value="Lab">Lab</option>
                <option value="Auditorium">Auditorium</option>
              </select>
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
      
            {/* Alternative Resources */}
            <div>
              <label className="text-gray-600 text-md mb-2 block">Alternative Resources</label>
              <div className="grid gap-2 max-h-48 overflow-y-auto bg-gray-100 p-4 rounded">
                {resources.map((resource) => (
                  <label key={resource.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={resource.id}
                      checked={formData.alternative_resources.includes(resource.id)}
                      onChange={(e) => handleCheckboxChange(resource.id, e.target.checked)}
                    />
                    <span>{resource.name}</span>
                  </label>
                ))}
      
              </div>
            </div>
      
      
            {/* Submit Button */}
            <button
              type="submit"
              className="bg-blue-600 text-white text-md px-4 py-3 rounded hover:bg-blue-700 transition"
            >
              Add Resource
            </button>
          </form>
        )
      }
    </>

  );
};

export default AddResource;
