
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
    },
    {
      title: "Total Assignments",
      value: stats.totalAssignments,
      icon: ClipboardList,
    },
    {
      title: "Pending",
      value: stats.pendingAssignments,
      icon: Clock,
    },
    {
      title: "Completed",
      value: stats.completedAssignments,
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7F0] p-6 text-[#374638] md:p-10">
      <div className="mx-auto max-w-7xl">

        {/* Welcome */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold tracking-widest text-[#718B68]">
            STUDYBUDDY DASHBOARD
          </p>

          <h1 className="text-3xl font-bold md:text-4xl">
            Welcome back{user?.name ? `, ${user.name}` : ""}! 👋
          </h1>

          <p className="mt-2 text-[#879183]">
            Here's an overview of your learning progress.
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-[#E7C7BE] bg-[#F9EEEA] p-4 text-sm text-[#B56D62]">
            <span>{error}</span>

            <button
              onClick={() => {
                dispatch(clearDashboardError());
                dispatch(fetchDashboard());
              }}
              className="shrink-0 underline hover:text-[#8E5149]"
            >
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <p className="py-20 text-center text-[#879183]">
            Loading your dashboard...
          </p>
        ) : (
          <>
            {/* Statistics */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {statCards.map((card, index) => {
                const Icon = card.icon;

                const iconColors = [
                  "bg-[#DCE8D5] text-[#718B68]",
                  "bg-[#E5EBDD] text-[#718B68]",
                  "bg-[#F3E9D8] text-[#A98753]",
                  "bg-[#DCE8D5] text-[#4F7049]",
                ];

                return (
                  <div
                    key={card.title}
                    className="rounded-2xl border border-[#E5EBDD] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-[#879183]">
                        {card.title}
                      </p>

                      <div className={`rounded-xl p-3 ${iconColors[index]}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>

                    <h2 className="mt-5 text-3xl font-bold text-[#374638]">
                      {card.value}
                    </h2>
                  </div>
                );
              })}
            </div>

            {/* Main Sections */}
            <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">

              {/* Upcoming Assignments */}
              <section className="rounded-2xl border border-[#E5EBDD] bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-[#F3E9D8] p-3">
                    <CalendarDays className="h-5 w-5 text-[#A98753]" />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-[#374638]">
                      Upcoming Assignments
                    </h2>
                    <p className="text-sm text-[#879183]">
                      Your next deadlines
                    </p>
                  </div>
                </div>

                {upcomingAssignments.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingAssignments.map((assignment) => (
                      <div
                        key={assignment._id}
                        className="rounded-xl border border-[#E5EBDD] bg-[#F8FAF5] p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <h3 className="font-medium text-[#374638]">
                              {assignment.title}
                            </h3>

                            <p className="mt-1 text-sm text-[#879183]">
                              {assignment.subjectId?.name || "Subject"}
                            </p>
                          </div>

                          <span className="text-xs font-medium text-[#A98753]">
                            {new Date(
                              assignment.dueDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-8 text-center text-sm text-[#879183]">
                    No upcoming assignments.
                  </p>
                )}
              </section>

              {/* Today's Study Tasks */}
              <section className="rounded-2xl border border-[#E5EBDD] bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-[#DCE8D5] p-3">
                    <GraduationCap className="h-5 w-5 text-[#718B68]" />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-[#374638]">
                      Today's Study Plan
                    </h2>
                    <p className="text-sm text-[#879183]">
                      Your AI-generated study tasks
                    </p>
                  </div>
                </div>

                {todayTasks.length > 0 ? (
                  <div className="space-y-3">
                    {todayTasks.map((task) => (
                      <div
                        key={`${task.planId}-${task.taskId}`}
                        className="rounded-xl border border-[#E5EBDD] bg-[#F8FAF5] p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-medium text-[#374638]">
                              {task.title}
                            </h3>

                            <p className="mt-1 text-sm text-[#879183]">
                              {task.description}
                            </p>

                            <p className="mt-3 flex items-center gap-1 text-xs text-[#718B68]">
                              <Clock className="h-3 w-3" />
                              {task.duration} minutes
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-3 py-1 text-xs ${
                              task.status === "Completed"
                                ? "bg-[#DCE8D5] text-[#4F7049]"
                                : "bg-[#F3E9D8] text-[#A98753]"
                            }`}
                          >
                            {task.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-8 text-center text-sm text-[#879183]">
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
