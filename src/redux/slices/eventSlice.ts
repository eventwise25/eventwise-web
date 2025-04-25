import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllEvents, getEventsByOrganizerID } from "../../services/eventService";
import { EventFormData } from "../../interface/Events";

interface EventsState {
  events: EventFormData[];
  drafts: EventFormData[]; // 👈 new
  loading: boolean;
  error: string | null;
}

const initialState: EventsState = {
  events: [],
  drafts: [], // 👈 new
  loading: false,
  error: null,
};

// Fetch all events
export const fetchEventsData = createAsyncThunk("events/fetch", async (organizer_id: string) => {
  return await getAllEvents(organizer_id);
});

// Fetch events by organizer ID
export const fetchEventsByOrganizer = createAsyncThunk(
  "events/fetchByOrganizer",
  async (organizer_id: string) => {
    return await getEventsByOrganizerID(organizer_id);
  }
);

const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    addEventDraft: (state, action) => {
      state.drafts.push(action.payload);
    },
    removeDraftEvent: (state, action) => {
      state.drafts = state.drafts.filter(event => event.id !== action.payload);
    },
    addLiveEvent: (state, action) => {
      state.events.push(action.payload);
    },
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch events";
      })
      .addCase(fetchEventsByOrganizer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventsByOrganizer.fulfilled, (state, action) => {
        state.loading = false;
      
        const allEvents = action.payload as EventFormData[];
      
        state.events = allEvents.filter(event => event.status !== "draft");
        state.drafts = allEvents.filter(event => event.status === "draft");
      })      
      // .addCase(fetchEventsByOrganizer.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.events = action.payload as EventFormData[];
      // })
      .addCase(fetchEventsByOrganizer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch events by organizer";
      });
  },
});

export const { addEventDraft, removeDraftEvent, addLiveEvent } = eventSlice.actions;
export default eventSlice.reducer;
