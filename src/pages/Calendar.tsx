
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

  const { assignments, loading, error } = useAppSelector(
    (state) => state.calendar
  );

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
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")}`;

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

  const getAssignmentsForDay = (day: number) =>
    assignments.filter((assignment) => {
      const date = new Date(assignment.dueDate);

      return (
        date.getFullYear() === year &&
        date.getMonth() === month &&
        date.getDate() === day
      );
    });

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

  const retryFetch = () => {
    dispatch(clearCalendarError());

    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);

    const formatDate = (date: Date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")}`;

    dispatch(
      fetchCalendarAssignments({
        startDate: formatDate(start),
        endDate: formatDate(end),
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F7F0] p-5 text-[#374638] md:p-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold tracking-wide text-[#718B68]">
            STUDYBUDDY
          </p>

          <h1 className="text-3xl font-bold md:text-4xl">
            Study Calendar
          </h1>

          <p className="mt-2 text-[#879183]">
            Keep track of your assignment deadlines.
          </p>
        </div>

        {/* Calendar */}
        <div className="rounded-2xl border border-[#E5EBDD] bg-white p-5 shadow-sm md:p-7">

          {/* Month Navigation */}
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#F0F4EB] p-2">
                <CalendarDays className="h-6 w-6 text-[#718B68]" />
              </div>

              <h2 className="text-xl font-semibold">
                {monthName}
              </h2>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => changeMonth(-1)}
                className="rounded-lg border border-[#E5EBDD] p-2 transition hover:bg-[#F0F4EB]"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                onClick={() => setCurrentDate(new Date())}
                className="rounded-lg border border-[#E5EBDD] px-3 text-sm font-medium transition hover:bg-[#F0F4EB]"
              >
                Today
              </button>

              <button
                onClick={() => changeMonth(1)}
                className="rounded-lg border border-[#E5EBDD] p-2 transition hover:bg-[#F0F4EB]"
                aria-label="Next month"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-[#EBCFC7] bg-[#F9EEEA] p-3 text-sm text-[#B56D62]">
              <span>{error}</span>

              <button
                onClick={retryFetch}
                className="shrink-0 font-medium underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Weekdays and Dates */}
          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
              (day) => (
                <div
                  key={day}
                  className="py-3 text-center text-xs font-semibold text-[#879183] md:text-sm"
                >
                  {day}
                </div>
              )
            )}

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
                        ? "border-[#718B68] bg-[#F0F4EB]"
                        : "border-[#E5EBDD] bg-[#FAFBF8]"
                      : "border-transparent"
                  }`}
                >
                  {day && (
                    <>
                      <span
                        className={`text-sm ${
                          isToday(day)
                            ? "font-bold text-[#718B68]"
                            : "text-[#374638]"
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
                                ? "bg-[#E5EFE1] text-[#5D8055]"
                                : "bg-[#F3E9D8] text-[#A98753]"
                            }`}
                          >
                            {assignment.title}
                          </div>
                        ))}

                        {dayAssignments.length > 2 && (
                          <p className="text-[10px] text-[#879183]">
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
            <p className="mt-5 text-center text-sm text-[#879183]">
              Loading calendar...
            </p>
          )}

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-5 border-t border-[#E5EBDD] pt-5">
            <div className="flex items-center gap-2 text-xs text-[#879183]">
              <span className="h-3 w-3 rounded bg-[#D9B985]" />
              Pending
            </div>

            <div className="flex items-center gap-2 text-xs text-[#879183]">
              <span className="h-3 w-3 rounded bg-[#8BA982]" />
              Completed
            </div>

            <div className="flex items-center gap-2 text-xs text-[#879183]">
              <span className="h-3 w-3 rounded bg-[#718B68]" />
              Today
            </div>
          </div>
        </div>

        {/* Monthly Assignment List */}
        <div className="mt-8 rounded-2xl border border-[#E5EBDD] bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold">
            Assignments This Month
          </h2>

          {selectedMonthAssignments.length > 0 ? (
            <div className="space-y-3">
              {selectedMonthAssignments.map((assignment) => (
                <div
                  key={assignment._id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E5EBDD] bg-[#FAFBF8] p-4"
                >
                  <div>
                    <h3 className="font-medium text-[#374638]">
                      {assignment.title}
                    </h3>

                    <p className="mt-1 text-sm text-[#879183]">
                      {typeof assignment.subjectId === "object" &&
                      assignment.subjectId !== null
                        ? assignment.subjectId.name
                        : "No subject"}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1 text-xs text-[#718B68]">
                      <Clock className="h-3 w-3" />

                      {new Date(
                        assignment.dueDate
                      ).toLocaleDateString()}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        assignment.status === "Completed"
                          ? "bg-[#E5EFE1] text-[#5D8055]"
                          : "bg-[#F3E9D8] text-[#A98753]"
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
              <p className="py-8 text-center text-sm text-[#879183]">
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
