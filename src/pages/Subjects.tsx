import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  ArrowLeft,
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

  const loadSubjects = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getSubjects();
      setSubjects(data);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to load subjects."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = subjectName.trim();

    if (!trimmedName) {
      setError("Please enter a subject name.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (editingId) {
        const response = await updateSubject(editingId, trimmedName);

        setSubjects((previous) =>
          previous.map((subject) =>
            subject._id === editingId ? response.subject : subject
          )
        );
      } else {
        const response = await createSubject(trimmedName);
        setSubjects((previous) => [...previous, response.subject]);
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
  };

  const handleCancelEdit = () => {
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
      await deleteSubject(id);

      setSubjects((previous) =>
        previous.filter((subject) => subject._id !== id)
      );
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to delete subject."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#080d1b] px-6 py-8 text-white md:px-10">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="rounded-xl bg-purple-500/15 p-3 text-purple-400">
              <BookOpen size={25} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">My Subjects</h1>
              <p className="mt-1 text-sm text-gray-400">
                Organize and manage your study subjects.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-white/10 bg-[#111a2e] p-6">
          <h2 className="mb-4 text-lg font-semibold">
            {editingId ? "Edit Subject" : "Add a New Subject"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="Enter subject name..."
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#080d1b] px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-purple-500"
            />

            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 font-medium transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Plus size={18} />
              )}
              {editingId ? "Update Subject" : "Add Subject"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-gray-300 transition hover:bg-white/5"
              >
                <X size={18} />
                Cancel
              </button>
            )}
          </form>

          {error && (
            <p className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </p>
          )}
        </div>

        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">All Subjects</h2>
          <span className="rounded-full bg-purple-500/15 px-3 py-1 text-sm text-purple-300">
            {subjects.length} Subjects
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-purple-400" size={32} />
          </div>
        ) : subjects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-[#111a2e]/50 px-6 py-16 text-center">
            <BookOpen
              size={40}
              className="mx-auto mb-4 text-gray-500"
            />
            <h3 className="mb-2 text-lg font-semibold">
              No subjects yet
            </h3>
            <p className="text-sm text-gray-400">
              Add your first subject using the form above.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <div
                key={subject._id}
                className="rounded-2xl border border-white/10 bg-[#111a2e] p-5 transition hover:border-purple-500/40"
              >
                <div className="mb-5 flex items-start justify-between">
                  <div className="rounded-xl bg-purple-500/15 p-3 text-purple-400">
                    <BookOpen size={22} />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(subject)}
                      title="Edit subject"
                      className="rounded-lg p-2 text-gray-400 transition hover:bg-blue-500/10 hover:text-blue-400"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      onClick={() => handleDelete(subject._id)}
                      title="Delete subject"
                      className="rounded-lg p-2 text-gray-400 transition hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                <h3 className="break-words text-lg font-semibold">
                  {subject.name}
                </h3>
                <p className="mt-2 text-xs text-gray-500">
                  Study subject
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Subjects;