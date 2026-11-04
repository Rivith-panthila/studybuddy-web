
import { useEffect, useState } from "react";
import {
  ClipboardList,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  CalendarDays,
  CheckCircle2,
  Clock,
} from "lucide-react";

import {
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  type Assignment,
} from "../service/assignment";

import {
  getSubjects,
  type Subject,
} from "../service/subject";

function Assignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchData = async () => {
    try {
      setError("");

      const [assignmentData, subjectData] = await Promise.all([
        getAssignments(),
        getSubjects(),
      ]);

      setAssignments(assignmentData);
      setSubjects(subjectData);
    } catch {
      setError("Failed to load assignments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setTitle("");
    setSubjectId("");
    setDueDate("");
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim() || !subjectId || !dueDate) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (editingId) {
        await updateAssignment(editingId, {
          title: title.trim(),
          dueDate,
        });

        setSuccess("Assignment updated successfully!");
      } else {
        await createAssignment({
          title: title.trim(),
          subjectId,
          dueDate,
        });

        setSuccess("Assignment added successfully!");
      }

      resetForm();
      await fetchData();
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (assignment: Assignment) => {
    setTitle(assignment.title);
    setSubjectId(assignment.subjectId?._id || "");
    setDueDate(assignment.dueDate.slice(0, 10));
    setEditingId(assignment._id);
    setError("");
    setSuccess("");
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this assignment?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await deleteAssignment(id);

      if (editingId === id) {
        resetForm();
      }

      setSuccess("Assignment deleted successfully!");
      await fetchData();
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to delete assignment."
      );
    }
  };

  const handleStatusChange = async (
    assignment: Assignment
  ) => {
    const newStatus =
      assignment.status === "Completed" ? "Pending" : "Completed";

    try {
      setError("");
      setSuccess("");

      await updateAssignment(assignment._id, {
        status: newStatus,
      });

      setSuccess("Assignment status updated!");
      await fetchData();
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to update status."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#080d1b] p-6 text-white md:p-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10">
          <p className="mb-2 text-sm text-blue-400">STUDYBUDDY</p>

          <h1 className="text-3xl font-bold md:text-4xl">
            My Assignments
          </h1>

          <p className="mt-2 text-gray-400">
            Manage your assignments and keep track of deadlines.
          </p>
        </div>

        {/* Add / Edit Form */}
        <div className="mb-8 rounded-2xl border border-white/10 bg-[#111a2e] p-6">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold">
            {editingId ? (
              <Pencil className="h-5 w-5 text-blue-400" />
            ) : (
              <Plus className="h-5 w-5 text-blue-400" />
            )}

            {editingId ? "Edit Assignment" : "Add New Assignment"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

              {/* Assignment Title */}
              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  Assignment Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter assignment title"
                  maxLength={150}
                  className="w-full rounded-xl border border-white/10 bg-[#080d1b] px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  Select Subject
                </label>

                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  disabled={!!editingId}
                  className="w-full rounded-xl border border-white/10 bg-[#080d1b] px-4 py-3 text-white outline-none focus:border-blue-500 disabled:opacity-50"
                >
                  <option value="">Choose a subject</option>

                  {subjects.map((subject) => (
                    <option
                      key={subject._id}
                      value={subject._id}
                      className="bg-[#111a2e]"
                    >
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  Due Date
                </label>

                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#080d1b] px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Form Buttons */}
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving || subjects.length === 0}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium transition hover:bg-blue-500 disabled:opacity-50"
              >
                {editingId ? (
                  <Save className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}

                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Assignment"
                    : "Add Assignment"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-gray-300 transition hover:bg-white/5"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              )}
            </div>

            {subjects.length === 0 && !loading && (
              <p className="mt-3 text-sm text-orange-400">
                Please create a subject before adding an assignment.
              </p>
            )}
          </form>

          {error && (
            <p className="mt-4 text-sm text-red-400">{error}</p>
          )}

          {success && (
            <p className="mt-4 text-sm text-green-400">{success}</p>
          )}
        </div>

        {/* Assignments List */}
        <div className="rounded-2xl border border-white/10 bg-[#111a2e] p-6">

          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">
              All Assignments
            </h2>

            <span className="rounded-full bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
              {assignments.length} Assignments
            </span>
          </div>

          {loading ? (
            <p className="py-10 text-center text-gray-400">
              Loading assignments...
            </p>
          ) : assignments.length === 0 ? (
            <div className="py-12 text-center">
              <ClipboardList className="mx-auto mb-4 h-12 w-12 text-gray-600" />

              <h3 className="text-lg font-medium text-gray-300">
                No assignments yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Add your first assignment to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              {assignments.map((assignment) => (
                <div
                  key={assignment._id}
                  className="rounded-xl border border-white/10 bg-[#080d1b] p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">

                    <div className="min-w-0">
                      <h3 className="break-words text-lg font-semibold">
                        {assignment.title}
                      </h3>

                      <p className="mt-2 text-sm text-gray-400">
                        {assignment.subjectId?.name || "No subject"}
                      </p>
                    </div>

                    <span
                      className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs ${
                        assignment.status === "Completed"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-orange-500/10 text-orange-400"
                      }`}
                    >
                      {assignment.status === "Completed" ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}

                      {assignment.status}
                    </span>
                  </div>

                  <div className="mt-5 flex items-center gap-2 text-sm text-blue-400">
                    <CalendarDays className="h-4 w-4" />

                    Due:{" "}
                    {new Date(assignment.dueDate).toLocaleDateString()}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">

                    <button
                      type="button"
                      onClick={() => handleStatusChange(assignment)}
                      className="text-sm text-green-400 transition hover:text-green-300"
                    >
                      {assignment.status === "Completed"
                        ? "Mark as Pending"
                        : "Mark as Completed"}
                    </button>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(assignment)}
                        title="Edit assignment"
                        className="rounded-lg p-2 text-blue-400 transition hover:bg-blue-500/10"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(assignment._id)}
                        title="Delete assignment"
                        className="rounded-lg p-2 text-red-400 transition hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Assignments;
