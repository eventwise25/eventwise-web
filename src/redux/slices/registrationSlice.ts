import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Registration } from "../../interface/Registrations";
import { UserData } from "../../interface/User";

export interface RegistrationWithUsers extends Registration {
  member_details: UserData[];
}

interface RegistrationState {
  registrations: RegistrationWithUsers[];
}

const initialState: RegistrationState = {
  registrations: [],
};

const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    setRegistrations: (state, action: PayloadAction<RegistrationWithUsers[]>) => {
      state.registrations = action.payload;
    },
    clearRegistrations: (state) => {
      state.registrations = [];
    }
  },
});

export const { setRegistrations, clearRegistrations } = registrationSlice.actions;
export default registrationSlice.reducer;
