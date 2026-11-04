
import { useEffect, useState } from "react";
import {
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
} from "lucide-react";

import {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  type Subject,
} from "../service/subject";

function Subjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectName, setSubjectName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchSubjects = async () => {
    try {
      setError("");
      const data = await getSubjects();
      setSubjects(data);
    } catch {
      setError("Failed to load subjects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = subjectName.trim();

    if (!trimmedName) {
      setError("Please enter a subject name.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (editingId) {
        const response = await updateSubject(editingId, trimmedName);

        setSubjects((prev) =>
          prev.map((subject) =>
            subject._id === editingId
              ? response.subject
              : subject
          )
        );

        setSuccess("Subject updated successfully!");
      } else {
        const response = await createSubject(trimmedName);

        setSubjects((prev) => [...prev, response.subject]);

        setSuccess("Subject added successfully!");
      }

      setSubjectName("");
      setEditingId(null);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (subject: Subject) => {
    setSubjectName(subject.name);
    setEditingId(subject._id);
    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    setSubjectName("");
    setEditingId(null);
    setError("");
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this subject?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await deleteSubject(id);

      setSubjects((prev) =>
        prev.filter((subject) => subject._id !== id)
      );

      if (editingId === id) {
        handleCancel();
      }

      setSuccess("Subject deleted successfully!");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to delete subject."
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
            My Subjects
          </h1>

          <p className="mt-2 text-gray-400">
            Organize and manage your study subjects.
          </p>
        </div>

        {/* Add / Edit Subject Form */}
        <div className="mb-8 rounded-2xl border border-white/10 bg-[#111a2e] p-6">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold">
            {editingId ? (
              <Pencil className="h-5 w-5 text-blue-400" />
            ) : (
              <Plus className="h-5 w-5 text-blue-400" />
            )}

            {editingId ? "Edit Subject" : "Add New Subject"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="Enter subject name"
              maxLength={100}
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#080d1b] px-4 py-3 text-white outline-none transition focus:border-blue-500"
            />

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium transition hover:bg-blue-500 disabled:opacity-50"
              >
                {editingId ? (
                  <Save className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}

                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update"
                    : "Add Subject"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-gray-300 transition hover:bg-white/5"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              )}
            </div>
          </form>

          {error && (
            <p className="mt-4 text-sm text-red-400">{error}</p>
          )}

          {success && (
            <p className="mt-4 text-sm text-green-400">{success}</p>
          )}
        </div>

        {/* Subjects List */}
        <div className="rounded-2xl border border-white/10 bg-[#111a2e] p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              All Subjects
            </h2>

            <span className="rounded-full bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
              {subjects.length} Subjects
            </span>
          </div>

          {loading ? (
            <p className="py-10 text-center text-gray-400">
              Loading subjects...
            </p>
          ) : subjects.length === 0 ? (
            <div className="py-12 text-center">
              <BookOpen className="mx-auto mb-4 h-12 w-12 text-gray-600" />

              <h3 className="text-lg font-medium text-gray-300">
                No subjects yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Add your first subject to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {subjects.map((subject) => (
                <div
                  key={subject._id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#080d1b] p-5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="rounded-xl bg-blue-500/10 p-3">
                      <BookOpen className="h-5 w-5 text-blue-400" />
                    </div>

                    <h3 className="truncate font-medium">
                      {subject.name}
                    </h3>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(subject)}
                      title="Edit subject"
                      className="rounded-lg p-2 text-blue-400 transition hover:bg-blue-500/10"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(subject._id)}
                      title="Delete subject"
                      className="rounded-lg p-2 text-red-400 transition hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
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

export default Subjects;
