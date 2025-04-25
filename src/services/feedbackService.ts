import { db } from "../utils/firebase/firebase";// adjust the path based on your project structure
import { collection, getDocs } from "firebase/firestore";
import { FeedbackData } from "../interface/Feedback";

export interface FeedbackSuggestion {
    event_name: string;
    noteworthy_quotes: string[];
    summary: {
      areas_for_improvement: string[];
      common_themes: string[];
      overall_sentiment: string;
      what_went_well: string[];
    };
  }

export const getEventFeedbacks = async (organizer_id: string, event_id: string): Promise<FeedbackData[]> => {
  const feedbackRef = collection(db, "Organizers", organizer_id, "Events", event_id, "Feedback");
  const snapshot = await getDocs(feedbackRef);
  
  const feedbacks: FeedbackData[] = snapshot.docs.map(doc => doc.data() as FeedbackData);
  return feedbacks;
};

export const fetchFeedbackSuggestions = async (
    eventId: string,
    organizerId: string
  ): Promise<FeedbackSuggestion | null> => {
    try {
      const url = `https://sentimentevent.onrender.com/api/sentiment/?event_id=${eventId}&oid=${organizerId}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch suggestions");
      return await response.json();
    } catch (error) {
      console.error("Suggestion fetch error:", error);
      return null;
    }
  };
