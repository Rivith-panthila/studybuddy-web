
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
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

import { useAppDispatch, useAppSelector } from "../store/hooks";

import {
  fetchAssignments,
  addAssignment,
  editAssignment,
  removeAssignment,
  clearAssignmentsError,
} from "../features/assignments/assignmentsSlice";

import { fetchSubjects } from "../features/subjects/subjectsSlice";

import type { Assignment } from "../service/assignment";

function Assignments() {
  const dispatch = useAppDispatch();

  const { assignments, loading, error } = useAppSelector(
    (state) => state.assignments
  );

  const { subjects } = useAppSelector(
    (state) => state.subjects
  );

  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    dispatch(fetchAssignments());
    dispatch(fetchSubjects());
  }, [dispatch]);

  const resetForm = () => {
    setTitle("");
    setSubjectId("");
    setDueDate("");
    setEditingId(null);
    dispatch(clearAssignmentsError());
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim() || !subjectId || !dueDate) return;

    try {
      setSaving(true);
      dispatch(clearAssignmentsError());

      if (editingId) {
        await dispatch(
          editAssignment({
            id: editingId,
            data: {
              title: title.trim(),
              dueDate,
            },
          })
        ).unwrap();
      } else {
        await dispatch(
          addAssignment({
            title: title.trim(),
            subjectId,
            dueDate,
          })
        ).unwrap();
      }

      resetForm();
    } catch {
      // Redux slice stores the error.
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

    dispatch(clearAssignmentsError());
  };

  const handleStatusChange = async (
    assignment: Assignment,
    status: "Pending" | "Completed"
  ) => {
    dispatch(clearAssignmentsError());

    try {
      await dispatch(
        editAssignment({
          id: assignment._id,
          data: { status },
        })
      ).unwrap();
    } catch {
      // Redux slice stores the error.
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this assignment?")) return;

    dispatch(clearAssignmentsError());

    try {
      setDeletingId(id);
      await dispatch(removeAssignment(id)).unwrap();

      if (editingId === id) {
        resetForm();
      }
    } catch {
      // Redux slice stores the error.
    } finally {
      setDeletingId("");
    }
  };

  const getSubjectName = (assignment: Assignment) => {
    if (typeof assignment.subjectId === "object") {
      return assignment.subjectId?.name || "Subject";
    }

    return (
      subjects.find(
        (subject) => subject._id === assignment.subjectId
      )?.name || "Subject"
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F7F0] px-6 py-8 text-[#374638] md:px-10">
      <div className="mx-auto max-w-6xl">

        <Link
          to="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#879183] transition hover:text-[#4F7049]"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        {/* PAGE HEADER */}
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-xl bg-[#DCE8D5] p-3 text-[#718B68]">
            <ClipboardList size={26} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-[#374638]">
              My Assignments
            </h1>
            <p className="mt-1 text-sm text-[#879183]">
              Manage your coursework and deadlines.
            </p>
          </div>
        </div>

        {/* ADD / EDIT ASSIGNMENT FORM */}
        <div className="mb-8 rounded-2xl border border-[#E5EBDD] bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-[#374638]">
            {editingId ? "Edit Assignment" : "Add New Assignment"}
          </h2>

          {subjects.length === 0 && !loading ? (
            <p className="text-sm text-[#A98753]">
              Please create a subject before adding an assignment.
              <Link
                to="/subjects"
                className="ml-2 font-medium underline hover:text-[#718B68]"
              >
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
                  className="rounded-xl border border-[#E5EBDD] bg-[#F8FAF5] px-4 py-3 text-[#374638] outline-none placeholder:text-[#A2AA9D] focus:border-[#9BB391] focus:ring-2 focus:ring-[#DCE8D5]"
                />

                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="rounded-xl border border-[#E5EBDD] bg-[#F8FAF5] px-4 py-3 text-[#374638] outline-none focus:border-[#9BB391] focus:ring-2 focus:ring-[#DCE8D5]"
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
                  className="rounded-xl border border-[#E5EBDD] bg-[#F8FAF5] px-4 py-3 text-[#374638] outline-none focus:border-[#9BB391] focus:ring-2 focus:ring-[#DCE8D5]"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-[#718B68] px-6 py-3 font-medium text-white transition hover:bg-[#5F7957] disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Plus size={18} />
                  )}

                  {saving ? "Saving..." : editingId ? "Update Assignment" : "Add Assignment"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex items-center gap-2 rounded-xl border border-[#E5EBDD] px-5 py-3 text-[#718071] transition hover:bg-[#F0F4EB]"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}

          {error && (
            <p className="mt-4 rounded-lg border border-[#F0D8D2] bg-[#F9EEEA] px-4 py-3 text-sm text-[#B56D62]">
              {error}
            </p>
          )}
        </div>

        {/* ASSIGNMENT COUNT */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#374638]">
            All Assignments
          </h2>

          <span className="rounded-full bg-[#DCE8D5] px-3 py-1 text-sm font-medium text-[#587451]">
            {assignments.length} Assignments
          </span>
        </div>

        {/* ASSIGNMENT LIST */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={32} className="animate-spin text-[#718B68]" />
          </div>
        ) : assignments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#C9D7C1] bg-white px-6 py-16 text-center">
            <ClipboardList
              size={40}
              className="mx-auto mb-4 text-[#A3B29B]"
            />

            <h3 className="mb-2 text-lg font-semibold text-[#374638]">
              No assignments yet
            </h3>

            <p className="text-sm text-[#879183]">
              Add your first assignment using the form above.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {assignments.map((assignment) => (
              <div
                key={assignment._id}
                className="rounded-2xl border border-[#E5EBDD] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#B9CCAF] hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-[#374638]">
                      {assignment.title}
                    </h3>

                    <p className="mt-1 text-sm text-[#879183]">
                      {getSubjectName(assignment)}
                    </p>
                  </div>

                  <span
                    className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                      assignment.status === "Completed"
                        ? "bg-[#DCE8D5] text-[#587451]"
                        : "bg-[#F3E9D8] text-[#A98753]"
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

                <p className="mb-5 text-sm text-[#879183]">
                  Due date:{" "}
                  {new Date(assignment.dueDate).toLocaleDateString()}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E5EBDD] pt-4">
                  <select
                    value={assignment.status}
                    onChange={(e) =>
                      handleStatusChange(
                        assignment,
                        e.target.value as "Pending" | "Completed"
                      )
                    }
                    className="rounded-lg border border-[#E5EBDD] bg-[#F8FAF5] px-3 py-2 text-xs text-[#5D6B5C] outline-none focus:border-[#9BB391]"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(assignment)}
                      title="Edit assignment"
                      className="rounded-lg p-2 text-[#879183] transition hover:bg-[#F0F4EB] hover:text-[#718B68]"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(assignment._id)}
                      disabled={deletingId === assignment._id}
                      title="Delete assignment"
                      className="rounded-lg p-2 text-[#A69A91] transition hover:bg-[#F9EEEA] hover:text-[#B56D62] disabled:opacity-50"
                    >
                      {deletingId === assignment._id ? (
                        <Loader2 size={17} className="animate-spin" />
                      ) : (
                        <Trash2 size={17} />
                      )}
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
