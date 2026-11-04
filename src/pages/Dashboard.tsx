
import { useEffect, useState } from "react";
import {
  BookOpen,
  ClipboardList,
  Clock,
  CheckCircle2,
  CalendarDays,
  Sparkles,
} from "lucide-react";

import {
  getDashboardData,
  type DashboardData,
} from "../service/dashboard";

import {
  getTodayTasks,
  type TodayStudyTask,
} from "../service/studyPlan";

function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [todayTasks, setTodayTasks] = useState<TodayStudyTask[]>([]);
  const [taskError, setTaskError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getDashboardData();
        setDashboard(data);
      } catch {
        setError("Failed to load dashboard data. Please login again.");
      } finally {
        setLoading(false);
      }
    };

    const fetchTodayTasks = async () => {
      try {
        const data = await getTodayTasks();
        setTodayTasks(data.tasks);
      } catch {
        setTaskError("Failed to load today's study tasks.");
      }
    };

    fetchDashboard();
    fetchTodayTasks();
  }, []);

  const stats = [
    {
      title: "Total Subjects",
      value: dashboard?.stats.totalSubjects ?? 0,
      icon: BookOpen,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      title: "Total Assignments",
      value: dashboard?.stats.totalAssignments ?? 0,
      icon: ClipboardList,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      title: "Pending Tasks",
      value: dashboard?.stats.pendingAssignments ?? 0,
      icon: Clock,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    },
    {
      title: "Completed Tasks",
      value: dashboard?.stats.completedAssignments ?? 0,
      icon: CheckCircle2,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080d1b] text-gray-300">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080d1b] p-6 text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080d1b] p-6 text-white md:p-10">
      <div className="mx-auto max-w-7xl">

        {/* Dashboard Header */}
        <div className="mb-10">
          <p className="mb-2 text-sm text-blue-400">STUDYBUDDY</p>

          <h1 className="text-3xl font-bold md:text-4xl">
            Dashboard
          </h1>

          <p className="mt-2 text-gray-400">
            Welcome back! Here's your study overview.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-white/10 bg-[#111a2e] p-6"
              >
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-sm text-gray-400">
                    {stat.title}
                  </p>

                  <div className={`rounded-xl p-3 ${stat.bg}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>

                <h2 className="text-3xl font-bold">
                  {stat.value}
                </h2>
              </div>
            );
          })}
        </div>

        {/* Dashboard Content */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Upcoming Deadlines */}
          <div className="rounded-2xl border border-white/10 bg-[#111a2e] p-6">
            <div className="mb-5 flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-blue-400" />

              <h2 className="text-lg font-semibold">
                Upcoming Deadlines
              </h2>
            </div>

            {dashboard?.upcomingAssignments.length ? (
              <div className="space-y-4">
                {dashboard.upcomingAssignments.map((assignment) => (
                  <div
                    key={assignment._id}
                    className="rounded-xl border border-white/10 p-4"
                  >
                    <h3 className="font-medium">
                      {assignment.title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-400">
                      {assignment.subjectId?.name ?? "No subject"}
                    </p>

                    <p className="mt-2 text-sm text-blue-400">
                      Due:{" "}
                      {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-gray-500">
                No upcoming deadlines yet.
              </p>
            )}
          </div>

          {/* Today's Study Tasks */}
          <div className="rounded-2xl border border-white/10 bg-[#111a2e] p-6">
            <div className="mb-5 flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-purple-400" />

              <h2 className="text-lg font-semibold">
                Today's Study Tasks
              </h2>
            </div>

            {taskError ? (
              <p className="py-8 text-center text-sm text-red-400">
                {taskError}
              </p>
            ) : todayTasks.length > 0 ? (
              <div className="space-y-4">
                {todayTasks.map((task) => (
                  <div
                    key={task.taskId}
                    className="rounded-xl border border-white/10 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-medium">
                        {task.title}
                      </h3>

                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          task.status === "Completed"
                            ? "bg-green-500/10 text-green-400"
                            : "bg-orange-500/10 text-orange-400"
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-gray-400">
                      {task.description}
                    </p>

                    <p className="mt-3 text-sm text-blue-400">
                      Duration: {task.duration} minutes
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-gray-500">
                No study tasks scheduled for today.
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;
