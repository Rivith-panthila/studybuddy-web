
import { useEffect } from "react";
import {
  BookOpen,
  ClipboardList,
  Clock,
  CheckCircle2,
  CalendarDays,
  GraduationCap,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "../store/hooks";

import {
  fetchDashboard,
  clearDashboardError,
} from "../features/dashboard/dashboardSlice";

function Dashboard() {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);

  const {
    stats,
    upcomingAssignments,
    todayTasks,
    loading,
    error,
  } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  const statCards = [
    {
      title: "Total Subjects",
      value: stats.totalSubjects,
      icon: BookOpen,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      title: "Total Assignments",
      value: stats.totalAssignments,
      icon: ClipboardList,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      title: "Pending",
      value: stats.pendingAssignments,
      icon: Clock,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    },
    {
      title: "Completed",
      value: stats.completedAssignments,
      icon: CheckCircle2,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-[#080d1b] p-6 text-white md:p-10">
      <div className="mx-auto max-w-7xl">

        {/* Welcome */}
        <div className="mb-8">
          <p className="mb-2 text-sm text-blue-400">
            STUDYBUDDY DASHBOARD
          </p>

          <h1 className="text-3xl font-bold md:text-4xl">
            Welcome back{user?.name ? `, ${user.name}` : ""}! 👋
          </h1>

          <p className="mt-2 text-gray-400">
            Here's an overview of your learning progress.
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            <span>{error}</span>

            <button
              onClick={() => {
                dispatch(clearDashboardError());
                dispatch(fetchDashboard());
              }}
              className="shrink-0 underline hover:text-red-300"
            >
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <p className="py-20 text-center text-gray-400">
            Loading your dashboard...
          </p>
        ) : (
          <>
            {/* Statistics */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {statCards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.title}
                    className="rounded-2xl border border-white/10 bg-[#111a2e] p-6"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-400">
                        {card.title}
                      </p>

                      <div className={`rounded-xl p-3 ${card.bg}`}>
                        <Icon className={`h-5 w-5 ${card.color}`} />
                      </div>
                    </div>

                    <h2 className="mt-5 text-3xl font-bold">
                      {card.value}
                    </h2>
                  </div>
                );
              })}
            </div>

            {/* Main Sections */}
            <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">

              {/* Upcoming Assignments */}
              <section className="rounded-2xl border border-white/10 bg-[#111a2e] p-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-orange-500/10 p-3">
                    <CalendarDays className="h-5 w-5 text-orange-400" />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold">
                      Upcoming Assignments
                    </h2>
                    <p className="text-sm text-gray-400">
                      Your next deadlines
                    </p>
                  </div>
                </div>

                {upcomingAssignments.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingAssignments.map((assignment) => (
                      <div
                        key={assignment._id}
                        className="rounded-xl border border-white/10 bg-[#080d1b] p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <h3 className="font-medium">
                              {assignment.title}
                            </h3>

                            <p className="mt-1 text-sm text-gray-400">
                              {assignment.subjectId?.name || "Subject"}
                            </p>
                          </div>

                          <span className="text-xs text-orange-400">
                            {new Date(
                              assignment.dueDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-8 text-center text-sm text-gray-500">
                    No upcoming assignments.
                  </p>
                )}
              </section>

              {/* Today's Study Tasks */}
              <section className="rounded-2xl border border-white/10 bg-[#111a2e] p-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-blue-500/10 p-3">
                    <GraduationCap className="h-5 w-5 text-blue-400" />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold">
                      Today's Study Plan
                    </h2>
                    <p className="text-sm text-gray-400">
                      Your AI-generated study tasks
                    </p>
                  </div>
                </div>

                {todayTasks.length > 0 ? (
                  <div className="space-y-3">
                    {todayTasks.map((task) => (
                      <div
                        key={`${task.planId}-${task.taskId}`}
                        className="rounded-xl border border-white/10 bg-[#080d1b] p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-medium">
                              {task.title}
                            </h3>

                            <p className="mt-1 text-sm text-gray-400">
                              {task.description}
                            </p>

                            <p className="mt-3 flex items-center gap-1 text-xs text-blue-400">
                              <Clock className="h-3 w-3" />
                              {task.duration} minutes
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-3 py-1 text-xs ${
                              task.status === "Completed"
                                ? "bg-green-500/10 text-green-400"
                                : "bg-orange-500/10 text-orange-400"
                            }`}
                          >
                            {task.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-8 text-center text-sm text-gray-500">
                    No study tasks scheduled for today.
                  </p>
                )}
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
