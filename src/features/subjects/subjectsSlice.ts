
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  type Subject,
} from "../../service/subject";

interface SubjectsState {
  subjects: Subject[];
  loading: boolean;
  error: string | null;
}

const initialState: SubjectsState = {
  subjects: [],
  loading: false,
  error: null,
};

// GET ALL SUBJECTS
export const fetchSubjects = createAsyncThunk<
  Subject[],
  void,
  { rejectValue: string }
>("subjects/fetchSubjects", async (_, { rejectWithValue }) => {
  try {
    return await getSubjects();
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to load subjects."
    );
  }
});

// CREATE SUBJECT
export const addSubject = createAsyncThunk<
  Subject,
  string,
  { rejectValue: string }
>("subjects/addSubject", async (name, { rejectWithValue }) => {
  try {
    const response = await createSubject(name);
    return response.subject as Subject;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to create subject."
    );
  }
});

// UPDATE SUBJECT
export const editSubject = createAsyncThunk<
  Subject,
  { id: string; name: string },
  { rejectValue: string }
>("subjects/editSubject", async ({ id, name }, { rejectWithValue }) => {
  try {
    const response = await updateSubject(id, name);
    return response.subject as Subject;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to update subject."
    );
  }
});

// DELETE SUBJECT
export const removeSubject = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("subjects/removeSubject", async (id, { rejectWithValue }) => {
  try {
    await deleteSubject(id);
    return id;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to delete subject."
    );
  }
});

const subjectsSlice = createSlice({
  name: "subjects",
  initialState,
  reducers: {
    clearSubjectsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load subjects.";
      })

      // CREATE
      .addCase(addSubject.fulfilled, (state, action) => {
        state.subjects.push(action.payload);
      })
      .addCase(addSubject.rejected, (state, action) => {
        state.error = action.payload || "Failed to create subject.";
      })

      // UPDATE
      .addCase(editSubject.fulfilled, (state, action) => {
        const index = state.subjects.findIndex(
          (subject) => subject._id === action.payload._id
        );

        if (index !== -1) {
          state.subjects[index] = action.payload;
        }
      })
      .addCase(editSubject.rejected, (state, action) => {
        state.error = action.payload || "Failed to update subject.";
      })

      // DELETE
      .addCase(removeSubject.fulfilled, (state, action) => {
        state.subjects = state.subjects.filter(
          (subject) => subject._id !== action.payload
        );
      })
      .addCase(removeSubject.rejected, (state, action) => {
        state.error = action.payload || "Failed to delete subject.";
      });
  },
});

export const { clearSubjectsError } = subjectsSlice.actions;

export default subjectsSlice.reducer;
