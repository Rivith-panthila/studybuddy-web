
import api from "./api";

export interface DashboardStats {
  totalSubjects: number;
  totalAssignments: number;
  pendingAssignments: number;
  completedAssignments: number;
}

export interface UpcomingAssignment {
  _id: string;
  title: string;
  dueDate: string;
  status: string;
  subjectId: {
    _id: string;
    name: string;
  };
}

export interface DashboardData {
  message: string;
  stats: DashboardStats;
  upcomingAssignments: UpcomingAssignment[];
}

export const getDashboardData = async (): Promise<DashboardData> => {
  const response = await api.get("/dashboard");
  return response.data;
};
