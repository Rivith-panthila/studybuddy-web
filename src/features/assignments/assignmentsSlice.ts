
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  type Assignment,
  type AssignmentData,
  type AssignmentUpdateData,
} from "../../service/assignment";

interface AssignmentsState {
  assignments: Assignment[];
  loading: boolean;
  error: string | null;
}

const initialState: AssignmentsState = {
  assignments: [],
  loading: false,
  error: null,
};

// Fetch assignments
export const fetchAssignments = createAsyncThunk<
  Assignment[],
  void,
  { rejectValue: string }
>(
  "assignments/fetchAssignments",
  async (_, { rejectWithValue }) => {
    try {
      return await getAssignments();
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load assignments."
      );
    }
  }
);

// Add assignment
export const addAssignment = createAsyncThunk<
  Assignment,
  AssignmentData,
  { rejectValue: string }
>(
  "assignments/addAssignment",
  async (data, { rejectWithValue }) => {
    try {
      const response = await createAssignment(data);
      return response.assignment as Assignment;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create assignment."
      );
    }
  }
);

// Edit assignment or update its status
export const editAssignment = createAsyncThunk<
  Assignment,
  { id: string; data: AssignmentUpdateData },
  { rejectValue: string }
>(
  "assignments/editAssignment",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateAssignment(id, data);
      return response.assignment as Assignment;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update assignment."
      );
    }
  }
);

// Delete assignment
export const removeAssignment = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  "assignments/removeAssignment",
  async (id, { rejectWithValue }) => {
    try {
      await deleteAssignment(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete assignment."
      );
    }
  }
);

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    clearAssignmentsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to load assignments.";
      })

      // Add
      .addCase(addAssignment.fulfilled, (state, action) => {
        state.assignments.push(action.payload);
      })
      .addCase(addAssignment.rejected, (state, action) => {
        state.error =
          action.payload || "Failed to create assignment.";
      })

      // Edit / Status update
      .addCase(editAssignment.fulfilled, (state, action) => {
        const index = state.assignments.findIndex(
          (item) => item._id === action.payload._id
        );

        if (index !== -1) {
          state.assignments[index] = action.payload;
        }
      })
      .addCase(editAssignment.rejected, (state, action) => {
        state.error =
          action.payload || "Failed to update assignment.";
      })

      // Delete
      .addCase(removeAssignment.fulfilled, (state, action) => {
        state.assignments = state.assignments.filter(
          (item) => item._id !== action.payload
        );
      })
      .addCase(removeAssignment.rejected, (state, action) => {
        state.error =
          action.payload || "Failed to delete assignment.";
      });
  },
});

export const { clearAssignmentsError } = assignmentsSlice.actions;

export default assignmentsSlice.reducer;
