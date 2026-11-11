import api from "./api";

export interface Coursework {
  _id: string;
  userId: string;
  title: string;
  analysis: string;
  originalFileName: string;
  createdAt?: string;
  updatedAt?: string;
}

export const uploadCoursework = async (file: File) => {
  const formData = new FormData();

  formData.append("coursework", file);

  const response = await api.post("/coursework/upload", formData);

  return response.data;
};

export const getCourseworks = async (): Promise<Coursework[]> => {
  const response = await api.get("/coursework");

  return response.data.courseworks;
};

export const getCourseworkById = async (
  id: string
): Promise<Coursework> => {
  const response = await api.get(`/coursework/${id}`);

  return response.data.coursework;
};

export const deleteCoursework = async (id: string) => {
  const response = await api.delete(`/coursework/${id}`);

  return response.data;
};