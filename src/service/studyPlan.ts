
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


export interface AvailableDay {
  day: string;
  hours: number;
}

export interface StudyPreferenceData {
  hoursPerDay: number;
  availableDays: AvailableDay[];
  preferredTime: "Morning" | "Afternoon" | "Evening";
  breakDuration: number;
}

export interface StudyTask {
  _id: string;
  title: string;
  description: string;
  duration: number;
  status: "Pending" | "Completed";
}

export interface DailySchedule {
  date: string;
  tasks: StudyTask[];
}

export interface StudyPlan {
  _id: string;
  courseworkId: string | {
    _id: string;
    title: string;
    deadline?: string;
  };
  dailySchedule: DailySchedule[];
  createdAt?: string;
}

export interface StudyProgress {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionPercentage: number;
  totalStudyMinutes: number;
  completedStudyMinutes: number;
}

export const saveStudyPreferences = async (
  data: StudyPreferenceData
) => {
  const response = await api.post("/study-preferences", data);
  return response.data;
};

export const generateStudyPlan = async (courseworkId: string) => {
  const response = await api.post("/study-plans/generate", {
    courseworkId,
  });
  return response.data;
};

export const getStudyPlans = async (): Promise<StudyPlan[]> => {
  const response = await api.get("/study-plans");
  return response.data.studyPlans;
};

export const updateStudyTaskStatus = async (
  planId: string,
  taskId: string,
  status: "Pending" | "Completed"
) => {
  const response = await api.patch(
    `/study-plans/${planId}/tasks/${taskId}`,
    { status }
  );
  return response.data;
};

export const rescheduleStudyTask = async (
  planId: string,
  taskId: string,
  newDate: string
) => {
  const response = await api.patch(
    `/study-plans/${planId}/tasks/${taskId}/reschedule`,
    { newDate }
  );
  return response.data;
};

export const updateStudyTask = async (
  planId: string,
  taskId: string,
  data: {
    title?: string;
    description?: string;
    duration?: number;
  }
) => {
  const response = await api.put(
    `/study-plans/${planId}/tasks/${taskId}`,
    data
  );
  return response.data;
};

export const getStudyProgress = async (): Promise<StudyProgress> => {
  const response = await api.get("/study-plans/progress");
  return response.data;
};

export const deleteStudyPlan = async (planId: string) => {
  const response = await api.delete(`/study-plans/${planId}`);
  return response.data;
};


export const deleteStudyTask = async (
  planId: string,
  taskId: string
) => {
  const response = await api.delete(
    `/study-plans/${planId}/tasks/${taskId}`
  );

  return response.data;
};