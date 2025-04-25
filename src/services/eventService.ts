import { db } from "../utils/firebase/firebase";
import { collection, getDoc, updateDoc, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { EventFormData } from "../interface/Events";

export const createEvent = async (eventData: EventFormData, organizer_id: string) => {
  try {
    // Reference to the subcollection 'Events' under the specific organizer
    const eventsCollectionRef = collection(db, "Organizers", organizer_id, "Events");

    // Add event to subcollection
    const eventRef = doc(eventsCollectionRef);

    await setDoc(eventRef, {
      ...eventData, 
      created_at: new Date().toISOString(),
      id: eventRef.id
    })

    return { success: true, id: eventRef.id };
  } catch (error) {
    console.error("Error creating event:", error);
    return { success: false, error };
  }
};

export const getEventsByOrganizerID = async (organizer_id: string): Promise<EventFormData[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "Organizers", organizer_id, "Events"));
    
    const events: EventFormData[] = querySnapshot.docs
      .map(doc => {
        const data = doc.data();

        return {
          id: doc.id,
          name: data.name || "",
          description: data.description || "",
          type: data.type || "",
          mode: data.mode || "Online",
          department: data.department || "",
          venue: data.venue || "",
          start_date: data.start_date || "",
          end_date: data.end_date || "",
          start_time: data.start_time || "",
          end_time: data.end_time || "",
          registration_deadline: data.registration_deadline || "",
          max_participants: data.max_participants ?? 0,
          is_team_event: data.is_team_event ?? false,
          min_team_size: data.min_team_size ?? 1,
          max_team_size: data.max_team_size ?? 1,
          event_categories: data.event_categories || [],
          images: data.images || [],
          videos: data.videos || [],
          event_status: data.event_status || "upcoming",
          prizes: data.prizes || {},
          goodies: data.goodies || [],
          status: data.status || "pending", // Assuming status exists
          created_at: data.created_at || new Date().toISOString(), // Ensure a valid timestamp
        } as EventFormData;
      })

    return events;
  } catch (error) {
    console.error("Error fetching organizer's events:", error);
    return [];
  }
};

// GET ALL EVENTS
export const getAllEvents = async (organizer_id: string) => {
  try {
    const querySnapshot = await getDocs(collection(db, "Organizers", organizer_id, "Events"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

// GET SINGLE EVENT BY ID (Populating Organizer Details)
export const getEventById = async (organizer_id: string, event_id: string) : Promise<EventFormData | null> => {
  try {
    const eventRef = doc(db, "Organizers", organizer_id, "Events", event_id);
    const eventSnap = await getDoc(eventRef);

    if (!eventSnap.exists()) return null;

    const eventData = eventSnap.data();
    
    // Fetch organizer details
    const organizerRef = doc(db, "Organizers", organizer_id);
    const organizerSnap = await getDoc(organizerRef);
    
    if (organizerSnap.exists()) {
      eventData.organizer = { id: organizerSnap.id, ...organizerSnap.data() };
    }

    return { id: eventSnap.id, ...eventData } as EventFormData;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
};

// UPDATE EVENT
export const updateEvent = async (organizer_id: string, event_id: string, updatedData: Partial<EventFormData>) => {
  try {
    console.log("organizer_id", organizer_id, "event_id", event_id);
    const docRef = doc(db, "Organizers", organizer_id, "Events", event_id);
    await updateDoc(docRef, updatedData);
    return { success: true };
  } catch (error) {
    console.error("Error updating event:", error);
    return { success: false, error };
  }
};

// DELETE EVENT
export const deleteEvent = async (organizer_id: string, event_id: string) => {
  try {
    const docRef = doc(db, "Organizers", organizer_id, "Events", event_id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting event:", error);
    return { success: false, error };
  }
};