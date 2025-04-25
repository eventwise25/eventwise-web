import { Registration } from "../interface/Registrations";
import { db } from "../utils/firebase/firebase";
import { collection, getDocs, where, query, doc, updateDoc } from "firebase/firestore";
import { UserData } from "../interface/User";

export const getUserById = async (id: string): Promise<UserData | null> => {
  try {
    const usersRef = collection(db, "Users");
    const q = query(usersRef, where("user_id", "==", id));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // If multiple users match, take the first one
      const userDoc = querySnapshot.docs[0];
      return userDoc.data() as UserData;
    }

    return null;
  } catch (err) {
    console.error("Error fetching user", err);
    return null;
  }
};

export const getEventRegistrations = async (organizer_id: string, event_id: string) => {
  try {
    const snapshot = await getDocs(collection(db, "Organizers", organizer_id, "Events", event_id, "Registrations"));

    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return data as Registration;
      });
  } catch (error) {
    console.error("Error adding admin:", error);
    throw error;
  }
};


export const updateRegistration = async (
  organizer_id: string,
  event_id: string,
  registration_id: string,
  updatedData: Partial<Registration>
): Promise<void> => {
  try {
    const regRef = doc(db, "Organizers", organizer_id, "Events", event_id, "Registrations", registration_id);
    await updateDoc(regRef, updatedData);
  } catch (error) {
    console.error("Error updating registration:", error);
    throw error;
  }
};
