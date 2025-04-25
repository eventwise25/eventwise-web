import { db } from "../utils/firebase/firebase";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { Resource } from "../interface/Resources";

// Add Resource to Firestore
export const addResource = async (college_id : string, resource: Omit<Resource, "id">) => {
  try {
    const resCollectionRef = collection(db, "Colleges", college_id, "Resources");

    const resRef = doc(resCollectionRef)

    await setDoc(resRef, {
      ...resource, 
      id: resRef.id
    });

    return resRef.id; // Firestore generates the ID
  } catch (error) {
    console.error("Error adding resource:", error);
    throw error;
  }
};

// Fetch a single resource by ID
export const getResourceById = async (college_id: string, resource_id: string): Promise<Resource | null> => {
  try {

    if (!college_id || !resource_id) {
      console.error("Missing college_id or resource_id", { college_id, resource_id });
      return null;
    }

    const resourceRef = doc(db, "Colleges", college_id, "Resources", resource_id);
    const resourceSnap = await getDoc(resourceRef);

    if (!resourceSnap.exists()) {
      return null;
    }

    const data = resourceSnap.data();

    console.log(data);

    return {
      id: resourceSnap.id,
      name: data.name || "Unknown Resource",
      adminId: data.adminId || "N/A",
      type: data.type || "Unknown Type",
      department: data.department || "Unknown Department",
      booked_slots: data.booked_slots || [],
      alternative_resources: data.alternative_resources || [],
    };
  } catch (error) {
    console.error("Error fetching resource:", error);
    return null;
  }
};

// Fetch multiple resources by their IDs
export const getResourcesByIds = async (college_id:string, resourceIds: string[]): Promise<Resource[]> => {
  try {
    const resources = await Promise.all(
      resourceIds.map(async (id) => {
        const resource = await getResourceById(college_id, id);
        if (!resource) {
          throw new Error(`Resource with ID ${id} not found`);
        }
        return resource;
      })
    );
    return resources;
  } catch (error) {
    console.error("Error fetching resources by IDs:", error);
    return [];
  }
};

// Fetch all resources from Firestore
export const getAllResources = async (college_id : string): Promise<Resource[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "Colleges", college_id, "Resources"));
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || "Unknown Resource",
        adminId: data.adminId || "N/A",
        type: data.type || "Unknown Type",
        department: data.department || "Unknown Department",
        booked_slots: data.booked_slots || [],
        alternative_resources: data.alternative_resources || [],
      };
    });
  } catch (error) {
    console.error("Error fetching resources:", error);
    return [];
  }
};