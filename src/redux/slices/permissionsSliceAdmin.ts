// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { fetchPermissionsByAdmin, updatePermissionStatus } from "../../services/permissionsService";
// import { Permission } from "../../interface/Permissions";

// interface ResourcePermissionsState {
//   permissions: Permission[];
//   loading: boolean;
//   error: string | null;
// }

// const initialState: ResourcePermissionsState = {
//   permissions: [],
//   loading: false,
//   error: null,
// };

// // Async action to fetch permissions
// export const fetchResourcePermissions = createAsyncThunk(
//   "resourcePermissions/fetch",
//   async (admin_id : string) => {
//     return await fetchPermissionsByAdmin(admin_id);
//   }
// );

// // Async action to update permission status
// export const updateResourcePermission = createAsyncThunk(
//   "resourcePermissions/update",
//   async ({ id, status }: { id: string; status: string }) => {
//     return await updatePermissionStatus(id, status);
//   }
// );

// const permissionsSliceAdmin = createSlice({
//   name: "resourcePermissions",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchResourcePermissions.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchResourcePermissions.fulfilled, (state, action) => {
//         state.loading = false;
//         state.permissions = action.payload as Permission[];
//       })
//       .addCase(fetchResourcePermissions.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message || "Failed to fetch permissions";
//       })
//       .addCase(updateResourcePermission.fulfilled, (state, action) => {
//         const updatedPermission = action.payload;
//         state.permissions = state.permissions.map((p) =>
//             p.id === updatedPermission.id ? updatedPermission : p
//           );
//       });
//   },
// });

// export default permissionsSliceAdmin.reducer;
