
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import subjectsReducer from "../features/subjects/subjectsSlice";
import assignmentsReducer from "../features/assignments/assignmentsSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import calendarReducer from "../features/calendar/calendarSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    subjects: subjectsReducer,
    assignments: assignmentsReducer,
      dashboard: dashboardReducer,
    calendar: calendarReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
