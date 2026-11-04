
import api from "./api";

export interface TodayStudyTask {
  planId: string;
  taskId: string;
  date: string;
  title: string;
  description: string;
  duration: number;
  status: "Pending" | "Completed";
}

export interface TodayTasksResponse {
  date: string;
  totalTasks: number;
  tasks: TodayStudyTask[];
}

export const getTodayTasks = async (): Promise<TodayTasksResponse> => {
  const response = await api.get("/study-plans/today");
  return response.data;
};
