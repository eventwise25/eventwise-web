import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth/authSlice'
// import permissionsSliceAdminReducer from './slices/permissionsSliceAdmin'
import eventsReducer from './slices/eventSlice'
import resourceReducer from './slices/resourceSlice'
import permissionsReducer from './slices/permissionsSlice'
import registrationsReducer from './slices/registrationSlice'
import feedbackReducer from "./slices/feedbackSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // permissionSliceAdmin: permissionsSliceAdminReducer,
    events : eventsReducer,
    resources : resourceReducer,
    permissions: permissionsReducer,
    registrations: registrationsReducer,
    feedback: feedbackReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
