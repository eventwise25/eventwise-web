import { AdminData } from "../interface/Admin";
import { db } from "../utils/firebase/firebase";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";

export const addAdmin = async (college_id: string, adminData: AdminData) => {
  try {
    const adminCollectionRef = collection(db, "Colleges", college_id, "Admins");

    const adminRef = doc(adminCollectionRef);

    await setDoc(adminRef, {
      ...adminData,
      id: adminRef.id
    })
    
    alert("admin added successfully!");
  } catch (error) {
    console.error("Error adding admin:", error);
    throw error;
  }
};

// Fetch Admins
export const fetchAdmins = async (collegeId: string): Promise<AdminData[]> => {
  const snapshot = await getDocs(collection(db, "Colleges", collegeId, "Admins"));
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      department: data.department,
      role: "admin", // assuming role is always "admin"
      college_id: collegeId,
    };
  });
};