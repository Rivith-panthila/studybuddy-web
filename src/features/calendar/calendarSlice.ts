
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getCalendarAssignments,
  type Assignment,
} from "../../service/assignment";

interface CalendarState {
  assignments: Assignment[];
  loading: boolean;
  error: string | null;
}

interface CalendarDateRange {
  startDate: string;
  endDate: string;
}

const initialState: CalendarState = {
  assignments: [],
  loading: false,
  error: null,
};

export const fetchCalendarAssignments = createAsyncThunk<
  Assignment[],
  CalendarDateRange,
  { rejectValue: string }
>(
  "calendar/fetchCalendarAssignments",
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      return await getCalendarAssignments(startDate, endDate);
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message ||
          "Failed to load calendar assignments."
      );
    }
  }
);

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    clearCalendarError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCalendarAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCalendarAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload;
      })
      .addCase(fetchCalendarAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to load calendar assignments.";
      });
  },
});

export const { clearCalendarError } = calendarSlice.actions;

export default calendarSlice.reducer;
