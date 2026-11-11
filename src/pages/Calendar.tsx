
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "../store/hooks";

import {
  fetchCalendarAssignments,
  clearCalendarError,
} from "../features/calendar/calendarSlice";

function Calendar() {
  const dispatch = useAppDispatch();

  const {
    assignments,
    loading,
    error,
  } = useAppSelector((state) => state.calendar);

  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const formatDate = (date: Date) =>
      `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    dispatch(
      fetchCalendarAssignments({
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
      })
    );
  }, [dispatch, year, month]);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const getAssignmentsForDay = (day: number) => {
    return assignments.filter((assignment) => {
      const date = new Date(assignment.dueDate);

      return (
        date.getFullYear() === year &&
        date.getMonth() === month &&
        date.getDate() === day
      );
    });
  };

  const isToday = (day: number) => {
    const today = new Date();

    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };

  const changeMonth = (amount: number) => {
    setCurrentDate(new Date(year, month + amount, 1));
  };

  const selectedMonthAssignments = [...assignments].sort(
    (a, b) =>
      new Date(a.dueDate).getTime() -
      new Date(b.dueDate).getTime()
  );

  return (
    <div className="min-h-screen bg-[#080d1b] p-6 text-white md:p-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm text-blue-400">STUDYBUDDY</p>

          <h1 className="text-3xl font-bold md:text-4xl">
            Study Calendar
          </h1>

          <p className="mt-2 text-gray-400">
            Keep track of your assignment deadlines.
          </p>
        </div>

        {/* Calendar */}
        <div className="rounded-2xl border border-white/10 bg-[#111a2e] p-5 md:p-7">

          {/* Month Navigation */}
          <div className="mb-7 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-6 w-6 text-blue-400" />

              <h2 className="text-xl font-semibold">
                {monthName}
              </h2>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => changeMonth(-1)}
                className="rounded-lg border border-white/10 p-2 transition hover:bg-white/10"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                onClick={() => setCurrentDate(new Date())}
                className="rounded-lg border border-white/10 px-3 text-sm transition hover:bg-white/10"
              >
                Today
              </button>

              <button
                onClick={() => changeMonth(1)}
                className="rounded-lg border border-white/10 p-2 transition hover:bg-white/10"
                aria-label="Next month"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              <span>{error}</span>

              <button
                onClick={() => {
                  dispatch(clearCalendarError());

                  const start = new Date(year, month, 1);
                  const end = new Date(year, month + 1, 0);

                  const formatDate = (date: Date) =>
                    `${date.getFullYear()}-${String(
                      date.getMonth() + 1
                    ).padStart(2, "0")}-${String(
                      date.getDate()
                    ).padStart(2, "0")}`;

                  dispatch(
                    fetchCalendarAssignments({
                      startDate: formatDate(start),
                      endDate: formatDate(end),
                    })
                  );
                }}
                className="shrink-0 underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Weekdays */}
          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
              (day) => (
                <div
                  key={day}
                  className="py-3 text-center text-xs font-semibold text-gray-400 md:text-sm"
                >
                  {day}
                </div>
              )
            )}

            {/* Calendar Dates */}
            {calendarDays.map((day, index) => {
              const dayAssignments = day
                ? getAssignmentsForDay(day)
                : [];

              return (
                <div
                  key={index}
                  className={`min-h-20 rounded-lg border p-2 md:min-h-28 md:p-3 ${
                    day
                      ? isToday(day)
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-white/10 bg-[#080d1b]"
                      : "border-transparent"
                  }`}
                >
                  {day && (
                    <>
                      <span
                        className={`text-sm ${
                          isToday(day)
                            ? "font-bold text-blue-400"
                            : "text-gray-300"
                        }`}
                      >
                        {day}
                      </span>

                      <div className="mt-2 space-y-1">
                        {dayAssignments.slice(0, 2).map((assignment) => (
                          <div
                            key={assignment._id}
                            title={assignment.title}
                            className={`truncate rounded px-1 py-1 text-[10px] md:text-xs ${
                              assignment.status === "Completed"
                                ? "bg-green-500/10 text-green-400"
                                : "bg-orange-500/10 text-orange-400"
                            }`}
                          >
                            {assignment.title}
                          </div>
                        ))}

                        {dayAssignments.length > 2 && (
                          <p className="text-[10px] text-gray-400">
                            +{dayAssignments.length - 2} more
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {loading && (
            <p className="mt-5 text-center text-sm text-gray-400">
              Loading calendar...
            </p>
          )}

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-5 border-t border-white/10 pt-5">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="h-3 w-3 rounded bg-orange-400" />
              Pending
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="h-3 w-3 rounded bg-green-400" />
              Completed
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="h-3 w-3 rounded bg-blue-400" />
              Today
            </div>
          </div>
        </div>

        {/* Monthly Assignment List */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#111a2e] p-6">
          <h2 className="mb-5 text-lg font-semibold">
            Assignments This Month
          </h2>

          {selectedMonthAssignments.length > 0 ? (
            <div className="space-y-3">
              {selectedMonthAssignments.map((assignment) => (
                <div
                  key={assignment._id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#080d1b] p-4"
                >
                  <div>
                    <h3 className="font-medium">
                      {assignment.title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-400">
                      {typeof assignment.subjectId === "object" &&
                      assignment.subjectId !== null
                        ? assignment.subjectId.name
                        : "No subject"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-xs text-blue-400">
                      <Clock className="h-3 w-3" />

                      {new Date(
                        assignment.dueDate
                      ).toLocaleDateString()}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        assignment.status === "Completed"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-orange-500/10 text-orange-400"
                      }`}
                    >
                      {assignment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !loading && (
              <p className="py-8 text-center text-sm text-gray-500">
                No assignments for this month.
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default Calendar;
