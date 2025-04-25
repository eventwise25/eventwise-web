import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CollegeData } from "../../interface/College";
import { OrganizerData } from "../../interface/Organizer";
import { AdminData } from "../../interface/Admin";

type AppUser = CollegeData | OrganizerData | AdminData | undefined;

interface AuthState {
  user: AppUser | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AppUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setUser, logoutUser, setLoading } = authSlice.actions;
export default authSlice.reducer;
