import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Permission } from "../../interface/Permissions";
import { fetchApprovedPermissions, fetchPendingPermissions, fetchPermissionsByAdmin, updatePermissionStatus } from "../../services/permissionsService";

interface PermissionsState {
  approvedPermissions: Permission[];
  pendingPermissions: Permission[];
  permissions: Permission[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: PermissionsState = {
  approvedPermissions: [],
  pendingPermissions: [],
  permissions: [],
  loading: false,
  error: null,
};

// Thunk to fetch approved permissions
export const getApprovedPermissions = createAsyncThunk(
  "permissions/getApprovedPermissions",
  async ({college_id, organizer_id}: {college_id: string, organizer_id: string}, { rejectWithValue }) => {
    try {
      return await fetchApprovedPermissions(college_id, organizer_id);
    } catch (error) {
      return rejectWithValue("Failed to fetch approved permissions");
    }
  }
);

// Thunk to fetch pending admin approval permissions
export const getPendingPermissions = createAsyncThunk(
  "permissions/getPendingPermissions",
  async ({college_id, organizer_id}: {college_id: string, organizer_id: string}, { rejectWithValue }) => {
    try {
      return await fetchPendingPermissions(college_id, organizer_id);
    } catch (error) {
      return rejectWithValue("Failed to fetch pending permissions");
    }
  }
);

// Async action to fetch permissions
export const fetchResourcePermissions = createAsyncThunk(
  "resourcePermissions/fetch",
  async ({college_id, admin_id} : {college_id: string, admin_id: string}) => {
    return await fetchPermissionsByAdmin(college_id, admin_id);
  }
);

// Async action to update permission status
export const updateResourcePermission = createAsyncThunk(
  "resourcePermissions/update",
  async ({ college_id, id, status }: { college_id :string, id: string; status: string }) => {
    return await updatePermissionStatus(college_id, id, status);
  }
);

// Permissions Slice
const permissionsSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getApprovedPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getApprovedPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.approvedPermissions = action.payload;
      })
      .addCase(getApprovedPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getPendingPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPendingPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingPermissions = action.payload;
      })
      .addCase(getPendingPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchResourcePermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResourcePermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions = action.payload as Permission[];
      })
      .addCase(fetchResourcePermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch permissions";
      })
      .addCase(updateResourcePermission.fulfilled, (state, action) => {
        const updatedPermission = action.payload;
        state.permissions = state.permissions.map((p) =>
          p.id === updatedPermission.id ? updatedPermission : p
        );
      });
  },
});

export default permissionsSlice.reducer;
