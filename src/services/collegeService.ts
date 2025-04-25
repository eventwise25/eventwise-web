import { getDocs, collection, getDoc, doc } from "firebase/firestore";
import { db } from "../utils/firebase/firebase";
import { CollegeData } from "../interface/College";

export const getColleges = async (): Promise<CollegeData[]> => {
  const snapshot = await getDocs(collection(db, "Colleges"));

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      name: data.name,
      email: data.email,
      website: data.website,
      location: {
        address: data.location?.address || "",
        city: data.location?.city || "",
        country: data.location?.country || "",
        pincode: data.location?.pincode || "",
      },
      departments: data.departments || [],
      role: data.role || "college", // defaulting if not present
    };
  });
};

export const getCollege = async (collegeId: string): Promise<CollegeData | null> => {
  try {
    const docRef = doc(db, "Colleges", collegeId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      const college: CollegeData = {
        id: docSnap.id,
        name: data.name,
        email: data.email,
        website: data.website,
        location: {
          address: data.location?.address || "",
          city: data.location?.city || "",
          country: data.location?.country || "",
          pincode: data.location?.pincode || "",
        },
        departments: data.departments || [],
        role: data.role || "college",
      };

      return college;
    } else {
      return null; // College not found
    }
  } catch (error) {
    console.error("Error fetching college:", error);
    return null;
  }
};

export const getDepartments = async (collegeId: string): Promise<string[]> => {
  try {
    const docRef = doc(db, "Colleges", collegeId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.departments || [];
    } else {
      console.warn("College not found");
      return [];
    }
  } catch (error) {
    console.error("Error fetching departments:", error);
    return [];
  }
};