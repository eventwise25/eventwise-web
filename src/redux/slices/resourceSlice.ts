import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllResources } from "../../services/resourceService";
import { Resource } from "../../interface/Resources";

// Define state
interface ResourceState {
  resources: Resource[];
  loading: boolean;
  error: string | null;
}

const initialState: ResourceState = {
  resources: [],
  loading: false,
  error: null,
};

// Async thunk to fetch resources
export const fetchAllResources = createAsyncThunk("resources/fetchAll", async (college_id: string) => {
  const resources = await getAllResources(college_id);
  return resources;
});

const resourceSlice = createSlice({
  name: "resources",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllResources.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllResources.fulfilled, (state, action) => {
        state.loading = false;
        state.resources = action.payload as Resource[];
      })
      .addCase(fetchAllResources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch resources";
      });
  },
});

export default resourceSlice.reducer;
