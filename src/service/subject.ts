
import api from "./api";

export interface Subject {
  _id: string;
  userId: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getSubjects = async (): Promise<Subject[]> => {
  const response = await api.get("/subjects");
  return response.data.subjects;
};

export const createSubject = async (name: string) => {
  const response = await api.post("/subjects", { name });
  return response.data;
};

export const updateSubject = async (id: string, name: string) => {
  const response = await api.put(`/subjects/${id}`, { name });
  return response.data;
};

export const deleteSubject = async (id: string) => {
  const response = await api.delete(`/subjects/${id}`);
  return response.data;
};
