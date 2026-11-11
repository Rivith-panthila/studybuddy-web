
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../service/api";
import {
  getDashboardData,
  type DashboardStats,
  type UpcomingAssignment,
} from "../../service/dashboard";

interface TodayTask {
  planId: string;
  taskId: string;
  title: string;
  description: string;
  duration: number;
  status: string;
}

interface DashboardState {
  stats: DashboardStats;
  upcomingAssignments: UpcomingAssignment[];
  todayTasks: TodayTask[];
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: {
    totalSubjects: 0,
    totalAssignments: 0,
    pendingAssignments: 0,
    completedAssignments: 0,
  },
  upcomingAssignments: [],
  todayTasks: [],
  loading: false,
  error: null,
};

export const fetchDashboard = createAsyncThunk<
  {
    stats: DashboardStats;
    upcomingAssignments: UpcomingAssignment[];
    todayTasks: TodayTask[];
  },
  void,
  { rejectValue: string }
>(
  "dashboard/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const [dashboardData, tasksResponse] = await Promise.all([
        getDashboardData(),
        api.get("/study-plans/today"),
      ]);

      return {
        stats: dashboardData.stats,
        upcomingAssignments: dashboardData.upcomingAssignments,
        todayTasks: tasksResponse.data?.tasks ?? [],
      };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message ||
          "Unable to load dashboard data. Please try again."
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.upcomingAssignments = action.payload.upcomingAssignments;
        state.todayTasks = action.payload.todayTasks;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          "Unable to load dashboard data. Please try again.";
      });
  },
});

export const { clearDashboardError } = dashboardSlice.actions;

export default dashboardSlice.reducer;
