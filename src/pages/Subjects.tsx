
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
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

import { useAppDispatch, useAppSelector } from "../store/hooks";

import {
  fetchSubjects,
  addSubject,
  editSubject,
  removeSubject,
  clearSubjectsError,
} from "../features/subjects/subjectsSlice";

import type { Subject } from "../service/subject";

function Subjects() {
  const dispatch = useAppDispatch();

  const { subjects, loading, error } = useAppSelector(
    (state) => state.subjects
  );

  const [subjectName, setSubjectName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    dispatch(fetchSubjects());
  }, [dispatch]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = subjectName.trim();

    if (!trimmedName) return;

    try {
      setSaving(true);
      dispatch(clearSubjectsError());

      if (editingId) {
        await dispatch(
          editSubject({
            id: editingId,
            name: trimmedName,
          })
        ).unwrap();
      } else {
        await dispatch(addSubject(trimmedName)).unwrap();
      }

      setSubjectName("");
      setEditingId(null);
    } catch {
      // Redux handles the error state
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (subject: Subject) => {
    setSubjectName(subject.name);
    setEditingId(subject._id);
    dispatch(clearSubjectsError());
  };

  const handleCancelEdit = () => {
    setSubjectName("");
    setEditingId(null);
    dispatch(clearSubjectsError());
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this subject?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      dispatch(clearSubjectsError());

      await dispatch(removeSubject(id)).unwrap();

      if (editingId === id) {
        setSubjectName("");
        setEditingId(null);
      }
    } catch {
      // Redux handles the error state
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7F0] px-6 py-8 text-[#374638] md:px-10">
      <div className="mx-auto max-w-5xl">

        <Link
          to="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#879183] transition hover:text-[#4F7049]"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        {/* PAGE HEADER */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="rounded-xl bg-[#DCE8D5] p-3 text-[#718B68]">
              <BookOpen size={25} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-[#374638]">
                My Subjects
              </h1>

              <p className="mt-1 text-sm text-[#879183]">
                Organize and manage your study subjects.
              </p>
            </div>
          </div>
        </div>

        {/* ADD / EDIT SUBJECT FORM */}
        <div className="mb-8 rounded-2xl border border-[#E5EBDD] bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-[#374638]">
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
              disabled={saving}
              className="min-w-0 flex-1 rounded-xl border border-[#E5EBDD] bg-[#F8FAF5] px-4 py-3 text-[#374638] outline-none transition placeholder:text-[#A2AA9D] focus:border-[#9BB391] focus:ring-2 focus:ring-[#DCE8D5]"
            />

            <button
              type="submit"
              disabled={saving || !subjectName.trim()}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#718B68] px-6 py-3 font-medium text-white transition hover:bg-[#5F7957] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Plus size={18} />
              )}

              {saving
                ? "Saving..."
                : editingId
                  ? "Update Subject"
                  : "Add Subject"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#E5EBDD] px-5 py-3 text-[#718071] transition hover:bg-[#F0F4EB]"
              >
                <X size={18} />
                Cancel
              </button>
            )}
          </form>

          {error && (
            <p className="mt-4 rounded-lg border border-[#F0D8D2] bg-[#F9EEEA] px-4 py-3 text-sm text-[#B56D62]">
              {error}
            </p>
          )}
        </div>

        {/* SUBJECT COUNT */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#374638]">
            All Subjects
          </h2>

          <span className="rounded-full bg-[#DCE8D5] px-3 py-1 text-sm font-medium text-[#587451]">
            {subjects.length} Subjects
          </span>
        </div>

        {/* SUBJECT LIST */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2
              className="animate-spin text-[#718B68]"
              size={32}
            />
          </div>
        ) : subjects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#C9D7C1] bg-white px-6 py-16 text-center">
            <BookOpen
              size={40}
              className="mx-auto mb-4 text-[#A3B29B]"
            />

            <h3 className="mb-2 text-lg font-semibold text-[#374638]">
              No subjects yet
            </h3>

            <p className="text-sm text-[#879183]">
              Add your first subject using the form above.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <div
                key={subject._id}
                className="rounded-2xl border border-[#E5EBDD] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#B9CCAF] hover:shadow-md"
              >
                <div className="mb-5 flex items-start justify-between">
                  <div className="rounded-xl bg-[#DCE8D5] p-3 text-[#718B68]">
                    <BookOpen size={22} />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(subject)}
                      title="Edit subject"
                      className="rounded-lg p-2 text-[#879183] transition hover:bg-[#F0F4EB] hover:text-[#718B68]"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(subject._id)}
                      disabled={deletingId === subject._id}
                      title="Delete subject"
                      className="rounded-lg p-2 text-[#A69A91] transition hover:bg-[#F9EEEA] hover:text-[#B56D62] disabled:opacity-50"
                    >
                      {deletingId === subject._id ? (
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />
                      ) : (
                        <Trash2 size={17} />
                      )}
                    </button>
                  </div>
                </div>

                <h3 className="break-words text-lg font-semibold text-[#374638]">
                  {subject.name}
                </h3>

                <p className="mt-2 text-xs text-[#879183]">
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
