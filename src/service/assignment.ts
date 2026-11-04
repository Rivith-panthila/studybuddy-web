
import api from "./api";

export interface Assignment {
  _id: string;
  title: string;
  subjectId: {
    _id: string;
    name: string;
  };
  dueDate: string;
  status: "Pending" | "Completed";
  createdAt?: string;
  updatedAt?: string;
}

export interface AssignmentData {
  subjectId: string;
  title: string;
  dueDate: string;
}

export interface UpdateAssignmentData {
  title?: string;
  dueDate?: string;
  status?: "Pending" | "Completed";
}

export const getAssignments = async (): Promise<Assignment[]> => {
  const response = await api.get("/assignments");
  return response.data.assignments;
};

export const createAssignment = async (data: AssignmentData) => {
  const response = await api.post("/assignments", data);
  return response.data;
};

export const updateAssignment = async (
  id: string,
  data: UpdateAssignmentData
) => {
  const response = await api.put(`/assignments/${id}`, data);
  return response.data;
};

export const deleteAssignment = async (id: string) => {
  const response = await api.delete(`/assignments/${id}`);
  return response.data;
};
