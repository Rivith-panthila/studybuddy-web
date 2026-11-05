import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  ArrowLeft,
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

import { getSubjects, type Subject } from "../service/subject";

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

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [assignmentData, subjectData] = await Promise.all([
        getAssignments(),
        getSubjects(),
      ]);

      setAssignments(assignmentData);
      setSubjects(subjectData);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to load assignments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setTitle("");
    setSubjectId("");
    setDueDate("");
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !subjectId || !dueDate) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (editingId) {
        const response = await updateAssignment(editingId, {
          title: title.trim(),
          dueDate,
        });

        setAssignments((previous) =>
          previous.map((item) =>
            item._id === editingId
              ? response.assignment
              : item
          )
        );
      } else {
        const response = await createAssignment({
          title: title.trim(),
          subjectId,
          dueDate,
        });

        setAssignments((previous) => [
          ...previous,
          response.assignment,
        ]);
      }

      resetForm();
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (assignment: Assignment) => {
    const selectedSubject =
      typeof assignment.subjectId === "string"
        ? assignment.subjectId
        : assignment.subjectId?._id;

    setEditingId(assignment._id);
    setTitle(assignment.title);
    setSubjectId(selectedSubject || "");
    setDueDate(assignment.dueDate.slice(0, 10));
    setError("");
  };

  const handleStatusChange = async (
    assignment: Assignment,
    status: "Pending" | "Completed"
  ) => {
    try {
      setError("");

      const response = await updateAssignment(assignment._id, {
        status,
      });

      setAssignments((previous) =>
        previous.map((item) =>
          item._id === assignment._id
            ? response.assignment
            : item
        )
      );
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to update status."
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this assignment?")) return;

    try {
      setError("");
      await deleteAssignment(id);

      setAssignments((previous) =>
        previous.filter((item) => item._id !== id)
      );
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to delete assignment."
      );
    }
  };

  const getSubjectName = (assignment: Assignment) => {
    if (typeof assignment.subjectId === "object") {
      return assignment.subjectId?.name || "Subject";
    }

    return (
      subjects.find((subject) => subject._id === assignment.subjectId)
        ?.name || "Subject"
    );
  };

  return (
    <div className="min-h-screen bg-[#080d1b] px-6 py-8 text-white md:px-10">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-xl bg-blue-500/15 p-3 text-blue-400">
            <ClipboardList size={26} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">My Assignments</h1>
            <p className="mt-1 text-sm text-gray-400">
              Manage your coursework and deadlines.
            </p>
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-white/10 bg-[#111a2e] p-6">
          <h2 className="mb-5 text-lg font-semibold">
            {editingId ? "Edit Assignment" : "Add New Assignment"}
          </h2>

          {subjects.length === 0 && !loading ? (
            <p className="text-sm text-amber-400">
              Please create a subject before adding an assignment.
              <Link to="/subjects" className="ml-2 underline">
                Go to Subjects
              </Link>
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Assignment title"
                  className="rounded-xl border border-white/10 bg-[#080d1b] px-4 py-3 outline-none focus:border-blue-500"
                />

                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="rounded-xl border border-white/10 bg-[#080d1b] px-4 py-3 text-white outline-none focus:border-blue-500"
                >
                  <option value="">Select subject</option>
                  {subjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>
                      {subject.name}
                    </option>
                  ))}
                </select>

                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="rounded-xl border border-white/10 bg-[#080d1b] px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium hover:bg-blue-500 disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Plus size={18} />
                  )}
                  {editingId ? "Update Assignment" : "Add Assignment"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-gray-300 hover:bg-white/5"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}

          {error && (
            <p className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </p>
          )}
        </div>

        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">All Assignments</h2>
          <span className="rounded-full bg-blue-500/15 px-3 py-1 text-sm text-blue-300">
            {assignments.length} Assignments
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={32} className="animate-spin text-blue-400" />
          </div>
        ) : assignments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 px-6 py-16 text-center">
            <ClipboardList
              size={40}
              className="mx-auto mb-4 text-gray-500"
            />
            <h3 className="mb-2 text-lg font-semibold">
              No assignments yet
            </h3>
            <p className="text-sm text-gray-400">
              Add your first assignment using the form above.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {assignments.map((assignment) => (
              <div
                key={assignment._id}
                className="rounded-2xl border border-white/10 bg-[#111a2e] p-5"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {assignment.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-400">
                      {getSubjectName(assignment)}
                    </p>
                  </div>

                  <span
                    className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs ${
                      assignment.status === "Completed"
                        ? "bg-green-500/15 text-green-400"
                        : "bg-amber-500/15 text-amber-400"
                    }`}
                  >
                    {assignment.status === "Completed" ? (
                      <CheckCircle2 size={13} />
                    ) : (
                      <Clock size={13} />
                    )}
                    {assignment.status}
                  </span>
                </div>

                <p className="mb-5 text-sm text-gray-400">
                  Due date:{" "}
                  {new Date(assignment.dueDate).toLocaleDateString()}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                  <select
                    value={assignment.status}
                    onChange={(e) =>
                      handleStatusChange(
                        assignment,
                        e.target.value as "Pending" | "Completed"
                      )
                    }
                    className="rounded-lg border border-white/10 bg-[#080d1b] px-3 py-2 text-xs text-gray-300 outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(assignment)}
                      title="Edit assignment"
                      className="rounded-lg p-2 text-gray-400 hover:bg-blue-500/10 hover:text-blue-400"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      onClick={() => handleDelete(assignment._id)}
                      title="Delete assignment"
                      className="rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Assignments;