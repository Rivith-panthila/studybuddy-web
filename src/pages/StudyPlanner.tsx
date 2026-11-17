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
      <div className="min-h-screen bg-[#FAFBF8] flex items-center justify-center text-[#374638]">
        <Loader2 className="animate-spin mr-2" />
        Loading Study Planner...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFBF8] text-[#374638] p-5 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* PAGE HEADER */}

        <div>
          <p className="text-sm text-[#718B68] font-semibold mb-2">
            AI POWERED LEARNING
          </p>

          <h1 className="text-3xl font-bold">
            AI Study Planner
          </h1>

          <p className="text-[#879183] mt-2">
            Upload coursework and create your personalized study schedule.
          </p>
        </div>

        {/* SUCCESS MESSAGE */}

        {message && (
          <div className="bg-[#EAF2E5] border border-[#DCE8D5] text-[#526D4D] px-4 py-3 rounded-xl">
            {message}
          </div>
        )}

        {/* ERROR MESSAGE */}

        {error && (
          <div className="bg-[#F9EEEA] border border-[#F0D9D2] text-[#B56D62] px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* UPLOAD COURSEWORK */}

        <section className="bg-white border border-[#E5EBDD] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-xl bg-[#EAF2E5] flex items-center justify-center">
              <Upload className="text-[#718B68]" />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Upload Coursework
              </h2>
              <p className="text-sm text-[#879183]">
                Upload your assignment PDF for AI analysis.
              </p>
            </div>
          </div>

          <form onSubmit={handleUpload} className="space-y-4">
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#DCE8D5] bg-[#F7F9F4] rounded-xl p-8 cursor-pointer hover:bg-[#F0F4EB] transition">
              <FileText size={36} className="text-[#718B68] mb-3" />

              <span className="font-semibold text-[#374638]">
                {selectedFile
                  ? selectedFile.name
                  : "Choose a PDF file"}
              </span>

              <span className="text-sm text-[#879183] mt-1">
                PDF files only
              </span>

              <input
                type="file"
                accept="application/pdf"
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
              disabled={uploading}
              className="flex items-center justify-center gap-2 bg-[#718B68] hover:bg-[#5F7957] text-white px-6 py-3 rounded-xl font-semibold transition disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Upload and Analyze
                </>
              )}
            </button>
          </form>
        </section>

        {/* COURSEWORK LIST */}

        <section className="bg-white border border-[#E5EBDD] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-xl bg-[#F0F4EB] flex items-center justify-center">
              <BookOpen className="text-[#718B68]" />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                My Courseworks
              </h2>
              <p className="text-sm text-[#879183]">
                Your uploaded coursework documents.
              </p>
            </div>
          </div>

          {courseworks.length === 0 ? (
            <div className="text-center py-10 text-[#879183]">
              <FileText
                size={40}
                className="mx-auto mb-3 opacity-50"
              />
              <p>No coursework uploaded yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {courseworks.map((coursework) => (
                <div
                  key={coursework._id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-[#E5EBDD] bg-[#FAFBF8]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#EAF2E5] flex items-center justify-center">
                      <FileText className="text-[#718B68]" />
                    </div>

                    <div>
                      <h3 className="font-semibold">
                        {coursework.originalFileName}
                      </h3>

                      <p className="text-xs text-[#879183]">
                        {coursework.analysis
                          ? "AI analysis completed"
                          : "Uploaded"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedCoursework(coursework._id)
                      }
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                        selectedCoursework === coursework._id
                          ? "bg-[#718B68] text-white"
                          : "bg-[#EAF2E5] text-[#526D4D] hover:bg-[#DCE8D5]"
                      }`}
                    >
                      {selectedCoursework === coursework._id
                        ? "Selected"
                        : "Select"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteCoursework(coursework._id)
                      }
                      className="p-2 rounded-lg bg-[#F9EEEA] text-[#B56D62] hover:bg-[#F3DFD9] transition"
                      title="Delete coursework"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* STUDY PREFERENCES */}

        <section className="bg-white border border-[#E5EBDD] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-[#F3E9D8] flex items-center justify-center">
              <Clock className="text-[#A98753]" />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Study Preferences
              </h2>
              <p className="text-sm text-[#879183]">
                Customize your daily study routine.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* HOURS PER DAY */}

            <div>
              <label className="block text-sm font-semibold mb-2">
                Hours per day
              </label>

              <input
                type="number"
                min="1"
                max="12"
                value={hoursPerDay}
                onChange={(e) =>
                  setHoursPerDay(Number(e.target.value))
                }
                className="w-full border border-[#E5EBDD] bg-[#FAFBF8] rounded-xl px-4 py-3 outline-none focus:border-[#718B68]"
              />
            </div>

            {/* BREAK DURATION */}

            <div>
              <label className="block text-sm font-semibold mb-2">
                Break duration (minutes)
              </label>

              <input
                type="number"
                min="0"
                max="120"
                value={breakDuration}
                onChange={(e) =>
                  setBreakDuration(Number(e.target.value))
                }
                className="w-full border border-[#E5EBDD] bg-[#FAFBF8] rounded-xl px-4 py-3 outline-none focus:border-[#718B68]"
              />
            </div>

            {/* PREFERRED TIME */}

            <div>
              <label className="block text-sm font-semibold mb-2">
                Preferred study time
              </label>

              <select
                value={preferredTime}
                onChange={(e) =>
                  setPreferredTime(
                    e.target.value as StudyPreferenceData["preferredTime"]
                  )
                }
                className="w-full border border-[#E5EBDD] bg-[#FAFBF8] rounded-xl px-4 py-3 outline-none focus:border-[#718B68]"
              >
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
                <option value="Night">Night</option>
              </select>
            </div>
          </div>

          {/* AVAILABLE DAYS */}

          <div className="mt-6">
            <label className="block text-sm font-semibold mb-3">
              Available days
            </label>

            <div className="flex flex-wrap gap-2">
              {weekdays.map((day) => {
                const isSelected = availableDays.some(
                  (item) => item.day === day
                );

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${
                      isSelected
                        ? "bg-[#DCE8D5] border-[#718B68] text-[#526D4D]"
                        : "bg-[#FAFBF8] border-[#E5EBDD] text-[#879183] hover:bg-[#F0F4EB]"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={handleSavePreferences}
            disabled={saving}
            className="mt-6 flex items-center gap-2 bg-[#718B68] hover:bg-[#5F7957] text-white px-6 py-3 rounded-xl font-semibold transition disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              "Save Preferences"
            )}
          </button>
        </section>
                {/* GENERATE STUDY PLAN */}

        <section className="bg-white border border-[#E5EBDD] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-xl bg-[#EAF2E5] flex items-center justify-center">
              <Brain className="text-[#718B68]" />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Generate AI Study Plan
              </h2>
              <p className="text-sm text-[#879183]">
                Let AI organize your coursework into daily tasks.
              </p>
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold mb-2">
              Select Coursework
            </label>

            <select
              value={selectedCoursework}
              onChange={(e) =>
                setSelectedCoursework(e.target.value)
              }
              className="w-full border border-[#E5EBDD] bg-[#FAFBF8] rounded-xl px-4 py-3 outline-none focus:border-[#718B68]"
            >
              <option value="">
                Select a coursework
              </option>

              {courseworks.map((coursework) => (
                <option
                  key={coursework._id}
                  value={coursework._id}
                >
                 {coursework.title}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleGeneratePlan}
            disabled={generating || !selectedCoursework}
            className="flex items-center justify-center gap-2 bg-[#718B68] hover:bg-[#5F7957] text-white px-6 py-3 rounded-xl font-semibold transition disabled:opacity-50"
          >
            {generating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Brain size={18} />
                Generate Study Plan
              </>
            )}
          </button>
        </section>

        {/* GENERATED STUDY PLANS */}

        <section className="bg-white border border-[#E5EBDD] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-[#F3E9D8] flex items-center justify-center">
              <CalendarDays className="text-[#A98753]" />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Your Study Schedule
              </h2>
              <p className="text-sm text-[#879183]">
                Manage your AI-generated daily study tasks.
              </p>
            </div>
          </div>

          {plans.length === 0 ? (
            <div className="text-center py-12 text-[#879183]">
              <CalendarDays
                size={42}
                className="mx-auto mb-3 opacity-50"
              />

              <p className="font-medium">
                No study plans available.
              </p>

              <p className="text-sm mt-1">
                Generate a study plan to see your daily schedule here.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {plans.map((plan) => (
                <div
                  key={plan._id}
                  className="border border-[#E5EBDD] rounded-xl overflow-hidden"
                >
                  <div className="bg-[#F0F4EB] px-5 py-4">
                    <h3 className="font-bold text-lg">
                      Study Plan
                    </h3>

                    <p className="text-sm text-[#879183] mt-1">
                      {plan.dailySchedule.length} study days
                    </p>
                  </div>

                  <div className="p-5 space-y-5">
                    {plan.dailySchedule.map((day, index) => (
                      <div
                        key={`${plan._id}-${index}`}
                        className="border border-[#E5EBDD] rounded-xl p-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                          <div>
                            <h4 className="font-bold text-[#374638]">
  {new Date(day.date).toLocaleDateString("en-US", {
    weekday: "long",
  })}
</h4>

                            <p className="text-sm text-[#879183]">
                              {new Date(day.date).toLocaleDateString()}
                            </p>
                          </div>

                          <span className="text-xs font-semibold bg-[#EAF2E5] text-[#526D4D] px-3 py-1 rounded-full">
                            {day.tasks.length} tasks
                          </span>
                        </div>

                        {day.tasks.length === 0 ? (
                          <p className="text-sm text-[#879183]">
                            No tasks scheduled for this day.
                          </p>
                        ) : (
                          <div className="space-y-4">
                            {day.tasks.map((task) => {
                              const key = `${plan._id}-${task._id}`;

                              return (
                                <div
                                  key={task._id}
                                  className="bg-[#FAFBF8] border border-[#E5EBDD] rounded-xl p-4"
                                >
                                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                                    <div className="flex gap-3">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleTaskStatus(
                                            plan._id,
                                            task._id,
                                            task.status === "Completed"
                                              ? "Pending"
                                              : "Completed"
                                          )
                                        }
                                        disabled={updatingTask === key}
                                        className="mt-1 text-[#718B68] disabled:opacity-50"
                                        title="Change task status"
                                      >
                                        {updatingTask === key ? (
                                          <Loader2
                                            size={21}
                                            className="animate-spin"
                                          />
                                        ) : task.status === "Completed" ? (
                                          <CheckCircle2 size={21} />
                                        ) : (
                                          <Circle size={21} />
                                        )}
                                      </button>

                                      <div className="flex-1">
                                        <h5
                                          className={`font-semibold ${
                                            task.status === "Completed"
                                              ? "line-through text-[#879183]"
                                              : "text-[#374638]"
                                          }`}
                                        >
                                          {task.title}
                                        </h5>

                                        <p className="text-sm text-[#879183] mt-1">
                                          {task.description}
                                        </p>

                                        <p className="text-xs text-[#718B68] mt-2">
                                          <Clock
                                            size={13}
                                            className="inline mr-1"
                                          />
                                          {task.duration} minutes
                                        </p>
                                      </div>
                                    </div>

                                    <span
                                      className={`text-xs px-3 py-1 rounded-full font-semibold ${
                                        task.status === "Completed"
                                          ? "bg-[#E5EFE1] text-[#5D8055]"
                                          : "bg-[#F3E9D8] text-[#A98753]"
                                      }`}
                                    >
                                      {task.status}
                                    </span>
                                  </div>

                                  {/* EDIT TASK */}

                                  {editingTask === key ? (
                                    <div className="mt-4 space-y-3">
                                      <input
                                        type="text"
                                        value={editValues[key]?.title ?? ""}
                                        onChange={(e) =>
                                          setEditValues((previous) => ({
                                            ...previous,
                                            [key]: {
                                              ...previous[key],
                                              title: e.target.value,
                                            },
                                          }))
                                        }
                                        placeholder="Task title"
                                        className="w-full rounded-lg border border-[#E5EBDD] bg-white px-3 py-2 text-sm outline-none focus:border-[#718B68]"
                                      />

                                      <textarea
                                        value={editValues[key]?.description ?? ""}
                                        onChange={(e) =>
                                          setEditValues((previous) => ({
                                            ...previous,
                                            [key]: {
                                              ...previous[key],
                                              description: e.target.value,
                                            },
                                          }))
                                        }
                                        placeholder="Task description"
                                        rows={3}
                                        className="w-full rounded-lg border border-[#E5EBDD] bg-white px-3 py-2 text-sm outline-none focus:border-[#718B68]"
                                      />

                                      <input
                                        type="number"
                                        min="1"
                                        value={editValues[key]?.duration ?? ""}
                                        onChange={(e) =>
                                          setEditValues((previous) => ({
                                            ...previous,
                                            [key]: {
                                              ...previous[key],
                                              duration: e.target.value,
                                            },
                                          }))
                                        }
                                        placeholder="Duration in minutes"
                                        className="w-full rounded-lg border border-[#E5EBDD] bg-white px-3 py-2 text-sm outline-none focus:border-[#718B68]"
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
                                          disabled={updatingTask === key}
                                          className="rounded-lg bg-[#718B68] px-3 py-2 text-sm font-medium text-white hover:bg-[#5F7957] disabled:opacity-50"
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
                                          disabled={updatingTask === key}
                                          className="rounded-lg border border-[#E5EBDD] px-3 py-2 text-sm text-[#5E6D5D] hover:bg-[#F0F4EB]"
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

                                        setEditValues((previous) => ({
                                          ...previous,
                                          [key]: {
                                            title: task.title,
                                            description: task.description,
                                            duration: String(task.duration),
                                          },
                                        }));

                                        setError("");
                                        setMessage("");
                                      }}
                                      disabled={updatingTask === key}
                                      className="mt-3 rounded-lg border border-[#718B68]/40 px-3 py-2 text-sm font-medium text-[#718B68] hover:bg-[#F0F4EB] disabled:opacity-50"
                                    >
                                      Edit Task
                                    </button>
                                  )}

                                  {/* DELETE TASK */}

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeleteTask(
                                        plan._id,
                                        task._id
                                      )
                                    }
                                    disabled={updatingTask === key}
                                    className="mt-3 ml-2 rounded-lg border border-[#F0D9D2] px-3 py-2 text-sm font-medium text-[#B56D62] hover:bg-[#F9EEEA] disabled:opacity-50"
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
                                        setRescheduleDates((previous) => ({
                                          ...previous,
                                          [key]: e.target.value,
                                        }))
                                      }
                                      disabled={updatingTask === key}
                                      className="rounded-lg border border-[#E5EBDD] bg-white px-3 py-2 text-sm text-[#374638] outline-none focus:border-[#718B68]"
                                    />

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleRescheduleTask(
                                          plan._id,
                                          task._id
                                        )
                                      }
                                      disabled={updatingTask === key}
                                      className="rounded-lg bg-[#718B68] px-3 py-2 text-sm font-medium text-white hover:bg-[#5F7957] disabled:opacity-50"
                                    >
                                      {updatingTask === key
                                        ? "Updating..."
                                        : "Reschedule"}
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
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