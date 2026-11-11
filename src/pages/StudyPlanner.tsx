
import { useEffect, useState } from "react";
import {
  Upload,
  BookOpen,
  Brain,
  Clock,
  CalendarDays,
  CheckCircle2,
  Circle,
  Loader2,
  Trash2,
  FileText,
} from "lucide-react";

import {
  uploadCoursework,
  getCourseworks,
  deleteCoursework,
  type Coursework,
} from "../service/coursework";

import {
  saveStudyPreferences,
  generateStudyPlan,
  getStudyPlans,
  updateStudyTaskStatus,
  rescheduleStudyTask,
  updateStudyTask,
  deleteStudyTask,
  type StudyPlan,
  type StudyPreferenceData,
} from "../service/studyPlan";

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function StudyPlanner() {
  const [courseworks, setCourseworks] = useState<Coursework[]>([]);
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCoursework, setSelectedCoursework] = useState("");

  const [hoursPerDay, setHoursPerDay] = useState(3);
  const [breakDuration, setBreakDuration] = useState(15);

  const [preferredTime, setPreferredTime] =
    useState<StudyPreferenceData["preferredTime"]>("Morning");

  const [availableDays, setAvailableDays] = useState<
    StudyPreferenceData["availableDays"]
  >([
    { day: "Monday", hours: 3 },
    { day: "Tuesday", hours: 3 },
    { day: "Wednesday", hours: 3 },
    { day: "Thursday", hours: 3 },
    { day: "Friday", hours: 3 },
  ]);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [updatingTask, setUpdatingTask] = useState("");

  const [rescheduleDates, setRescheduleDates] = useState<
    Record<string, string>
  >({});

  const [editingTask, setEditingTask] = useState("");

  const [editValues, setEditValues] = useState<
    Record<
      string,
      {
        title: string;
        description: string;
        duration: string;
      }
    >
  >({});

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // LOAD COURSEWORKS AND STUDY PLANS

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [courseworkData, planData] = await Promise.all([
        getCourseworks(),
        getStudyPlans(),
      ]);

      setCourseworks(courseworkData);
      setPlans(planData);

      if (courseworkData.length > 0) {
        setSelectedCoursework((previous) =>
          previous && courseworkData.some(
            (item) => item._id === previous
          )
            ? previous
            : courseworkData[0]._id
        );
      } else {
        setSelectedCoursework("");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to load study planner data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // TOGGLE AVAILABLE STUDY DAYS

  const toggleDay = (day: string) => {
    setAvailableDays((previous) => {
      const exists = previous.find(
        (item) => item.day === day
      );

      if (exists) {
        return previous.filter(
          (item) => item.day !== day
        );
      }

      return [
        ...previous,
        { day, hours: hoursPerDay },
      ];
    });
  };

  // UPLOAD COURSEWORK PDF

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setError("Please select a PDF file.");
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setMessage("");

      const response = await uploadCoursework(selectedFile);

      const newCoursework =
        response.coursework as Coursework;

      setCourseworks((previous) => [
        newCoursework,
        ...previous,
      ]);

      setSelectedCoursework(newCoursework._id);
      setSelectedFile(null);

      setMessage(
        "PDF uploaded and analyzed successfully!"
      );
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "PDF upload failed."
      );
    } finally {
      setUploading(false);
    }
  };

  // SAVE STUDY PREFERENCES

  const handleSavePreferences = async () => {
    if (availableDays.length === 0) {
      setError(
        "Please select at least one available day."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await saveStudyPreferences({
        hoursPerDay,
        availableDays: availableDays.map((item) => ({
          ...item,
          hours: hoursPerDay,
        })),
        preferredTime,
        breakDuration,
      });

      setMessage(
        "Study preferences saved successfully!"
      );
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to save preferences."
      );
    } finally {
      setSaving(false);
    }
  };

  // GENERATE STUDY PLAN

  const handleGeneratePlan = async () => {
    if (!selectedCoursework) {
      setError("Please select a coursework first.");
      return;
    }

    try {
      setGenerating(true);
      setError("");
      setMessage("");

      await generateStudyPlan(selectedCoursework);

      const updatedPlans = await getStudyPlans();
      setPlans(updatedPlans);

      setMessage(
        "Your AI study plan was generated successfully!"
      );
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to generate study plan."
      );
    } finally {
      setGenerating(false);
    }
  };

  // UPDATE TASK STATUS

  const handleTaskStatus = async (
    planId: string,
    taskId: string,
    status: "Pending" | "Completed"
  ) => {
    const key = `${planId}-${taskId}`;

    try {
      setUpdatingTask(key);
      setError("");
      setMessage("");

      await updateStudyTaskStatus(
        planId,
        taskId,
        status
      );

      const updatedPlans = await getStudyPlans();
      setPlans(updatedPlans);

      setMessage("Task status updated successfully!");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to update task."
      );
    } finally {
      setUpdatingTask("");
    }
  };

  // RESCHEDULE STUDY TASK

  const handleRescheduleTask = async (
    planId: string,
    taskId: string
  ) => {
    const key = `${planId}-${taskId}`;
    const newDate = rescheduleDates[key];

    if (!newDate) {
      setError("Please select a new date.");
      return;
    }

    try {
      setUpdatingTask(key);
      setError("");
      setMessage("");

      await rescheduleStudyTask(
        planId,
        taskId,
        newDate
      );

      const updatedPlans = await getStudyPlans();
      setPlans(updatedPlans);

      setMessage("Task rescheduled successfully!");

      setRescheduleDates((previous) => ({
        ...previous,
        [key]: "",
      }));
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to reschedule task."
      );
    } finally {
      setUpdatingTask("");
    }
  };

  // EDIT STUDY TASK

  const handleEditTask = async (
    planId: string,
    taskId: string
  ) => {
    const key = `${planId}-${taskId}`;
    const values = editValues[key];

    if (
      !values ||
      !values.title.trim() ||
      !values.description.trim()
    ) {
      setError(
        "Please enter a task title and description."
      );
      return;
    }

    const duration = Number(values.duration);

    if (
      !Number.isFinite(duration) ||
      duration <= 0
    ) {
      setError(
        "Please enter a valid duration greater than 0."
      );
      return;
    }

    try {
      setUpdatingTask(key);
      setError("");
      setMessage("");

      await updateStudyTask(planId, taskId, {
        title: values.title.trim(),
        description: values.description.trim(),
        duration,
      });

      const updatedPlans = await getStudyPlans();
      setPlans(updatedPlans);

      setEditingTask("");

      setMessage(
        "Study task updated successfully!"
      );
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to update study task."
      );
    } finally {
      setUpdatingTask("");
    }
  };

  // DELETE STUDY TASK

  const handleDeleteTask = async (
    planId: string,
    taskId: string
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this study task?"
    );

    if (!confirmed) return;

    const key = `${planId}-${taskId}`;

    try {
      setUpdatingTask(key);
      setError("");
      setMessage("");

      await deleteStudyTask(planId, taskId);

      const updatedPlans = await getStudyPlans();
      setPlans(updatedPlans);

      setEditingTask("");

      setMessage(
        "Study task deleted successfully!"
      );
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to delete study task."
      );
    } finally {
      setUpdatingTask("");
    }
  };

  // DELETE COURSEWORK

  const handleDeleteCoursework = async (
    id: string
  ) => {
    if (
      !window.confirm(
        "Delete this coursework?"
      )
    ) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await deleteCoursework(id);

      setCourseworks((previous) =>
        previous.filter(
          (item) => item._id !== id
        )
      );

      if (selectedCoursework === id) {
        setSelectedCoursework("");
      }

      setMessage(
        "Coursework deleted successfully."
      );
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to delete coursework."
      );
    }
  };

  // LOADING SCREEN

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080d1b] flex items-center justify-center text-white">
        <Loader2 className="animate-spin mr-2" />
        Loading Study Planner...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080d1b] text-white p-5 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* PAGE HEADER */}

        <div>
          <p className="text-sm text-indigo-400 font-semibold mb-2">
            AI POWERED LEARNING
          </p>

          <h1 className="text-3xl font-bold">
            AI Study Planner
          </h1>

          <p className="text-gray-400 mt-2">
            Upload coursework and create your personalized study schedule.
          </p>
        </div>

        {/* SUCCESS MESSAGE */}

        {message && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl p-4">
            {message}
          </div>
        )}

        {/* ERROR MESSAGE */}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4">
            {error}
          </div>
        )}

        {/* PDF UPLOAD */}

        <section className="bg-[#111a2e] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-indigo-500/20 p-3 rounded-xl">
              <Upload className="text-indigo-400" />
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                Upload Coursework
              </h2>

              <p className="text-gray-400 text-sm">
                Upload your assignment PDF for AI analysis.
              </p>
            </div>
          </div>

          <form onSubmit={handleUpload}>
            <label className="block border-2 border-dashed border-gray-700 hover:border-indigo-500 rounded-xl p-8 text-center cursor-pointer transition">
              <FileText
                className="mx-auto mb-3 text-indigo-400"
                size={35}
              />

              <p className="font-medium">
                {selectedFile
                  ? selectedFile.name
                  : "Choose your coursework PDF"}
              </p>

              <p className="text-gray-500 text-sm mt-2">
                PDF files only
              </p>

              <input
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={(e) =>
                  setSelectedFile(
                    e.target.files?.[0] || null
                  )
                }
              />
            </label>

            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="mt-4 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-5 py-3 rounded-xl font-medium"
            >
              {uploading ? (
                <Loader2
                  className="animate-spin"
                  size={18}
                />
              ) : (
                <Brain size={18} />
              )}

              {uploading
                ? "Analyzing PDF..."
                : "Upload & Analyze"}
            </button>
          </form>
        </section>

        {/* UPLOADED COURSEWORK */}

        <section className="bg-[#111a2e] border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
            <BookOpen className="text-indigo-400" />
            My Courseworks
          </h2>

          {courseworks.length === 0 ? (
            <p className="text-gray-500">
              No coursework uploaded yet.
            </p>
          ) : (
            <div className="space-y-3">
              {courseworks.map((coursework) => (
                <div
                  key={coursework._id}
                  className="flex flex-wrap items-center justify-between gap-3 bg-[#080d1b] border border-gray-800 rounded-xl p-4"
                >
                  <label className="flex items-center gap-3 flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="coursework"
                      checked={
                        selectedCoursework ===
                        coursework._id
                      }
                      onChange={() =>
                        setSelectedCoursework(
                          coursework._id
                        )
                      }
                      className="accent-indigo-500"
                    />

                    <div>
                      <p className="font-medium">
                        {coursework.title}
                      </p>

                      <p className="text-xs text-gray-500">
                        {coursework.originalFileName}
                      </p>
                    </div>
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteCoursework(
                        coursework._id
                      )
                    }
                    className="text-red-400 hover:text-red-300 p-2"
                    title="Delete coursework"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* STUDY PREFERENCES */}

        <section className="bg-[#111a2e] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Clock
              className="text-indigo-400"
              size={25}
            />

            <div>
              <h2 className="text-xl font-semibold">
                Study Preferences
              </h2>

              <p className="text-sm text-gray-400">
                Customize your daily study routine.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Study hours per day
              </label>

              <input
                type="number"
                min="1"
                max="12"
                value={hoursPerDay}
                onChange={(e) =>
                  setHoursPerDay(
                    Number(e.target.value)
                  )
                }
                className="w-full bg-[#080d1b] border border-gray-700 rounded-xl p-3 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Break duration (minutes)
              </label>

              <input
                type="number"
                min="5"
                max="60"
                value={breakDuration}
                onChange={(e) =>
                  setBreakDuration(
                    Number(e.target.value)
                  )
                }
                className="w-full bg-[#080d1b] border border-gray-700 rounded-xl p-3 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Preferred study time
              </label>

              <select
                value={preferredTime}
                onChange={(e) =>
                  setPreferredTime(
                    e.target.value as StudyPreferenceData["preferredTime"]
                  )
                }
                className="w-full bg-[#080d1b] border border-gray-700 rounded-xl p-3 outline-none focus:border-indigo-500"
              >
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm text-gray-300 mb-3">
              Available study days
            </label>

            <div className="flex flex-wrap gap-2">
              {weekdays.map((day) => {
                const active = availableDays.some(
                  (item) => item.day === day
                );

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-4 py-2 rounded-lg border text-sm transition ${
                      active
                        ? "bg-indigo-600 border-indigo-500 text-white"
                        : "bg-[#080d1b] border-gray-700 text-gray-400"
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={handleSavePreferences}
            disabled={saving}
            className="mt-6 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-5 py-3 rounded-xl font-medium flex items-center gap-2"
          >
            {saving ? (
              <Loader2
                className="animate-spin"
                size={18}
              />
            ) : (
              <CheckCircle2 size={18} />
            )}

            {saving
              ? "Saving..."
              : "Save Preferences"}
          </button>
        </section>

        {/* GENERATE STUDY PLAN */}

        <section className="bg-gradient-to-br from-indigo-950 to-[#111a2e] border border-indigo-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Brain
              className="text-indigo-400"
              size={30}
            />

            <div>
              <h2 className="text-xl font-semibold">
                Generate AI Study Plan
              </h2>

              <p className="text-sm text-gray-400">
                Let AI organize your coursework into daily tasks.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGeneratePlan}
            disabled={
              generating || !selectedCoursework
            }
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-6 py-3 rounded-xl font-medium flex items-center gap-2"
          >
            {generating ? (
              <Loader2
                className="animate-spin"
                size={18}
              />
            ) : (
              <CalendarDays size={18} />
            )}

            {generating
              ? "Generating Plan..."
              : "Generate Study Plan"}
          </button>
        </section>

        {/* GENERATED STUDY PLANS */}

        <section>
          <h2 className="text-2xl font-bold mb-5">
            Your Study Schedule
          </h2>

          {plans.length === 0 ? (
            <div className="bg-[#111a2e] border border-gray-800 rounded-2xl p-8 text-center">
              <CalendarDays
                className="mx-auto text-gray-600 mb-3"
                size={35}
              />

              <p className="text-gray-400">
                No study plans generated yet.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {plans.map((plan) => (
                <div
                  key={plan._id}
                  className="bg-[#111a2e] border border-gray-800 rounded-2xl p-6"
                >
                  <h3 className="text-lg font-semibold mb-5">
  {plan.courseworkId &&
  typeof plan.courseworkId === "object"
    ? plan.courseworkId.title || "Study Plan"
    : "Study Plan"}
</h3>
                  <div className="space-y-5">
                    {plan.dailySchedule.map(
                      (day, index) => (
                        <div
                          key={`${plan._id}-${index}`}
                        >
                          <h4 className="text-indigo-400 font-semibold mb-3">
                            {new Date(
                              day.date
                            ).toLocaleDateString(
                              undefined,
                              {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                timeZone: "UTC",
                              }
                            )}
                          </h4>

                          {day.tasks.length === 0 ? (
                            <p className="text-sm text-gray-500 mb-3">
                              No tasks scheduled for this day.
                            </p>
                          ) : (
                            <div className="space-y-3">
                              {day.tasks.map((task) => {
                                const key = `${plan._id}-${task._id}`;

                                return (
                                  <div
                                    key={task._id}
                                    className="flex flex-wrap items-start gap-3 bg-[#080d1b] border border-gray-800 rounded-xl p-4"
                                  >
                                    {/* TASK STATUS BUTTON */}

                                    <button
                                      type="button"
                                      disabled={
                                        updatingTask === key
                                      }
                                      onClick={() =>
                                        handleTaskStatus(
                                          plan._id,
                                          task._id,
                                          task.status ===
                                            "Completed"
                                            ? "Pending"
                                            : "Completed"
                                        )
                                      }
                                      className="mt-1 text-indigo-400"
                                      title="Change task status"
                                    >
                                      {updatingTask === key ? (
                                        <Loader2
                                          size={20}
                                          className="animate-spin"
                                        />
                                      ) : task.status ===
                                        "Completed" ? (
                                        <CheckCircle2
                                          size={20}
                                        />
                                      ) : (
                                        <Circle size={20} />
                                      )}
                                    </button>

                                    <div className="flex-1 min-w-0">
                                      {/* TASK DETAILS */}

                                      <p
                                        className={`font-medium ${
                                          task.status ===
                                          "Completed"
                                            ? "line-through text-gray-500"
                                            : "text-white"
                                        }`}
                                      >
                                        {task.title}
                                      </p>

                                      <p className="text-sm text-gray-400 mt-1">
                                        {task.description}
                                      </p>

                                      <p className="text-xs text-indigo-400 mt-2">
                                        {task.duration} minutes
                                      </p>

                                      {/* EDIT TASK FORM */}

                                      {editingTask === key ? (
                                        <div className="mt-3 space-y-2 rounded-xl border border-indigo-500/30 bg-[#111a2e] p-3">
                                          <input
                                            type="text"
                                            value={
                                              editValues[key]?.title ??
                                              task.title
                                            }
                                            onChange={(e) =>
                                              setEditValues(
                                                (previous) => ({
                                                  ...previous,
                                                  [key]: {
                                                    title: e.target.value,
                                                    description:
                                                      previous[key]?.description ??
                                                      task.description,
                                                    duration:
                                                      previous[key]?.duration ??
                                                      String(task.duration),
                                                  },
                                                })
                                              )
                                            }
                                            placeholder="Task title"
                                            disabled={
                                              updatingTask === key
                                            }
                                            className="w-full rounded-lg border border-gray-700 bg-[#080d1b] px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
                                          />

                                          <textarea
                                            value={
                                              editValues[key]?.description ??
                                              task.description
                                            }
                                            onChange={(e) =>
                                              setEditValues(
                                                (previous) => ({
                                                  ...previous,
                                                  [key]: {
                                                    title:
                                                      previous[key]?.title ??
                                                      task.title,
                                                    description:
                                                      e.target.value,
                                                    duration:
                                                      previous[key]?.duration ??
                                                      String(task.duration),
                                                  },
                                                })
                                              )
                                            }
                                            placeholder="Task description"
                                            rows={2}
                                            disabled={
                                              updatingTask === key
                                            }
                                            className="w-full rounded-lg border border-gray-700 bg-[#080d1b] px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
                                          />

                                          <input
                                            type="number"
                                            min="1"
                                            value={
                                              editValues[key]?.duration ??
                                              String(task.duration)
                                            }
                                            onChange={(e) =>
                                              setEditValues(
                                                (previous) => ({
                                                  ...previous,
                                                  [key]: {
                                                    title:
                                                      previous[key]?.title ??
                                                      task.title,
                                                    description:
                                                      previous[key]?.description ??
                                                      task.description,
                                                    duration:
                                                      e.target.value,
                                                  },
                                                })
                                              )
                                            }
                                            placeholder="Duration in minutes"
                                            disabled={
                                              updatingTask === key
                                            }
                                            className="w-full rounded-lg border border-gray-700 bg-[#080d1b] px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
                                          />

                                          <div className="flex flex-wrap gap-2">
                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleEditTask(
                                                  plan._id,
                                                  task._id
                                                )
                                              }
                                              disabled={
                                                updatingTask === key
                                              }
                                              className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                                            >
                                              {updatingTask === key
                                                ? "Saving..."
                                                : "Save Changes"}
                                            </button>

                                            <button
                                              type="button"
                                              onClick={() =>
                                                setEditingTask("")
                                              }
                                              disabled={
                                                updatingTask === key
                                              }
                                              className="rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800"
                                            >
                                              Cancel
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setEditingTask(key);

                                            setEditValues(
                                              (previous) => ({
                                                ...previous,
                                                [key]: {
                                                  title: task.title,
                                                  description:
                                                    task.description,
                                                  duration:
                                                    String(task.duration),
                                                },
                                              })
                                            );

                                            setError("");
                                            setMessage("");
                                          }}
                                          disabled={
                                            updatingTask === key
                                          }
                                          className="mt-3 rounded-lg border border-indigo-500/40 px-3 py-2 text-sm font-medium text-indigo-300 hover:bg-indigo-500/10 disabled:opacity-50"
                                        >
                                          Edit Task
                                        </button>
                                      )}

                                      {/* DELETE TASK BUTTON */}

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleDeleteTask(
                                            plan._id,
                                            task._id
                                          )
                                        }
                                        disabled={
                                          updatingTask === key
                                        }
                                        className="mt-3 ml-2 rounded-lg border border-red-500/40 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                                      >
                                        {updatingTask === key ? (
                                          <span className="flex items-center gap-2">
                                            <Loader2
                                              size={15}
                                              className="animate-spin"
                                            />
                                            Deleting...
                                          </span>
                                        ) : (
                                          <span className="flex items-center gap-2">
                                            <Trash2 size={15} />
                                            Delete Task
                                          </span>
                                        )}
                                      </button>

                                      {/* RESCHEDULE TASK */}

                                      <div className="mt-3 flex flex-wrap items-center gap-2">
                                        <input
                                          type="date"
                                          min={new Date()
                                            .toISOString()
                                            .split("T")[0]}
                                          value={
                                            rescheduleDates[key] ??
                                            new Date(day.date)
                                              .toISOString()
                                              .split("T")[0]
                                          }
                                          onChange={(e) =>
                                            setRescheduleDates(
                                              (previous) => ({
                                                ...previous,
                                                [key]: e.target.value,
                                              })
                                            )
                                          }
                                          disabled={
                                            updatingTask === key
                                          }
                                          className="rounded-lg border border-gray-700 bg-[#111a2e] px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
                                        />

                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleRescheduleTask(
                                              plan._id,
                                              task._id
                                            )
                                          }
                                          disabled={
                                            updatingTask === key
                                          }
                                          className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                                        >
                                          {updatingTask === key
                                            ? "Updating..."
                                            : "Reschedule"}
                                        </button>
                                      </div>
                                    </div>

                                    {/* TASK STATUS BADGE */}

                                    <span
                                      className={`text-xs px-3 py-1 rounded-full ${
                                        task.status ===
                                        "Completed"
                                          ? "bg-green-500/10 text-green-400"
                                          : "bg-yellow-500/10 text-yellow-400"
                                      }`}
                                    >
                                      {task.status}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default StudyPlanner;
