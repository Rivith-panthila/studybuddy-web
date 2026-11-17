
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import {
  MessageSquare,
  Paperclip,
  RefreshCw,
  Send,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  createDiscussion,
  getDiscussions,
  getDiscussionReplies,
  createDiscussionReply,
  updateDiscussionReply,
  deleteDiscussionReply,
  updateDiscussion,
  deleteDiscussion,
  type Discussion as DiscussionType,
  type DiscussionReply,
} from "../service/discussion";
import {
  connectSocket,
  disconnectSocket,
  socket,
} from "../service/socket";

function Discussion() {
  const [discussions, setDiscussions] = useState<DiscussionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [success, setSuccess] = useState("");
  const [replies, setReplies] = useState<Record<string, DiscussionReply[]>>({});
  const [expandedDiscussions, setExpandedDiscussions] = useState<string[]>([]);
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [replyLoading, setReplyLoading] = useState<string | null>(null);
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editReplyContent, setEditReplyContent] = useState("");
  const [replyActionLoading, setReplyActionLoading] = useState(false);
  const [replyErrors, setReplyErrors] = useState<Record<string, string>>({});

  const [editingDiscussionId, setEditingDiscussionId] = useState<string | null>(null);
  const [editDiscussionTitle, setEditDiscussionTitle] = useState("");
  const [editDiscussionContent, setEditDiscussionContent] = useState("");
  const [discussionActionLoading, setDiscussionActionLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUserId = useSelector(
    (state: RootState) => state.auth.user?._id
  );

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getDiscussions();
      setDiscussions(data);
    } catch {
      setError("Unable to load discussions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) return;

    connectSocket(token);

    return () => {
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    const handleNewDiscussion = (newDiscussion: DiscussionType) => {
      setDiscussions((current) => {
        const exists = current.some(
          (discussion) => discussion._id === newDiscussion._id
        );

        if (exists) return current;

        return [newDiscussion, ...current];
      });
    };

    const handleUpdatedDiscussion = (updatedDiscussion: DiscussionType) => {
      setDiscussions((current) =>
        current.map((discussion) =>
          discussion._id === updatedDiscussion._id
            ? updatedDiscussion
            : discussion
        )
      );
    };

    const handleDeletedDiscussion = (payload: string | { discussionId: string }) => {
      const deletedId =
        typeof payload === "string" ? payload : payload.discussionId;

      setDiscussions((current) =>
        current.filter((discussion) => discussion._id !== deletedId)
      );

      setReplies((current) => {
        const updated = { ...current };
        delete updated[deletedId];
        return updated;
      });

      setExpandedDiscussions((current) =>
        current.filter((id) => id !== deletedId)
      );
    };

    socket.on("discussion:new", handleNewDiscussion);
    socket.on("discussion:updated", handleUpdatedDiscussion);
    socket.on("discussion:deleted", handleDeletedDiscussion);

    return () => {
      socket.off("discussion:new", handleNewDiscussion);
      socket.off("discussion:updated", handleUpdatedDiscussion);
      socket.off("discussion:deleted", handleDeletedDiscussion);
    };
  }, []);

  useEffect(() => {
    const handleNewReply = (newReply: DiscussionReply) => {
      const discussionId = newReply.discussionId;

      setReplies((current) => {
        const existingReplies = current[discussionId] || [];
        const exists = existingReplies.some(
          (reply) => reply._id === newReply._id
        );

        if (exists) return current;

        return {
          ...current,
          [discussionId]: [...existingReplies, newReply],
        };
      });
    };

    const handleUpdatedReply = (updatedReply: DiscussionReply) => {
      const discussionId = updatedReply.discussionId;

      setReplies((current) => ({
        ...current,
        [discussionId]: (current[discussionId] || []).map((reply) =>
          reply._id === updatedReply._id ? updatedReply : reply
        ),
      }));
    };

    const handleDeletedReply = (deletedReply: {
      _id: string;
      discussionId: string;
    }) => {
      setReplies((current) => ({
        ...current,
        [deletedReply.discussionId]: (
          current[deletedReply.discussionId] || []
        ).filter((reply) => reply._id !== deletedReply._id),
      }));
    };

    socket.on("reply:new", handleNewReply);
    socket.on("reply:updated", handleUpdatedReply);
    socket.on("reply:deleted", handleDeletedReply);

    return () => {
      socket.off("reply:new", handleNewReply);
      socket.off("reply:updated", handleUpdatedReply);
      socket.off("reply:deleted", handleDeletedReply);
    };
  }, []);

  const handleCreateDiscussion = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("Please enter both a title and discussion content.");
      return;
    }

    if (attachment && attachment.size > 10 * 1024 * 1024) {
      setError("Attachment size must be 10MB or less.");
      return;
    }

    try {
      setPublishing(true);
      setError("");
      setSuccess("");

      await createDiscussion({
        title: title.trim(),
        content: content.trim(),
        attachment,
      });

      setTitle("");
      setContent("");
      setAttachment(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setSuccess("Your discussion has been published successfully.");
      await fetchDiscussions();
    } catch {
      setError("Unable to publish your discussion. Please try again.");
    } finally {
      setPublishing(false);
    }
  };

  const handleStartEditDiscussion = (discussion: DiscussionType) => {
    setEditingDiscussionId(discussion._id);
    setEditDiscussionTitle(discussion.title);
    setEditDiscussionContent(discussion.content);
  };

  const handleCancelEditDiscussion = () => {
    setEditingDiscussionId(null);
    setEditDiscussionTitle("");
    setEditDiscussionContent("");
  };

  const handleUpdateDiscussion = async (discussionId: string) => {
    if (!editDiscussionTitle.trim() || !editDiscussionContent.trim()) {
      setError("Please enter both a title and discussion content.");
      return;
    }

    try {
      setDiscussionActionLoading(true);
      setError("");

      const updatedDiscussion = await updateDiscussion(discussionId, {
        title: editDiscussionTitle.trim(),
        content: editDiscussionContent.trim(),
      });

      setDiscussions((current) =>
        current.map((discussion) =>
          discussion._id === discussionId ? updatedDiscussion : discussion
        )
      );

      handleCancelEditDiscussion();
    } catch {
      setError("Unable to update discussion. Please try again.");
    } finally {
      setDiscussionActionLoading(false);
    }
  };

  const handleDeleteDiscussion = async (discussionId: string) => {
    if (!window.confirm("Are you sure you want to delete this discussion?")) {
      return;
    }

    try {
      setDiscussionActionLoading(true);
      setError("");

      await deleteDiscussion(discussionId);

      setDiscussions((current) =>
        current.filter((discussion) => discussion._id !== discussionId)
      );

      setReplies((current) => {
        const updated = { ...current };
        delete updated[discussionId];
        return updated;
      });

      setExpandedDiscussions((current) =>
        current.filter((id) => id !== discussionId)
      );
    } catch {
      setError("Unable to delete discussion. Please try again.");
    } finally {
      setDiscussionActionLoading(false);
    }
  };

  const toggleReplies = async (discussionId: string) => {
    const isExpanded = expandedDiscussions.includes(discussionId);

    if (isExpanded) {
      socket.emit("discussion:leave", discussionId);

      setExpandedDiscussions((current) =>
        current.filter((id) => id !== discussionId)
      );

      return;
    }

    setExpandedDiscussions((current) => [...current, discussionId]);
    socket.emit("discussion:join", discussionId);

    try {
      setReplyErrors((current) => ({
        ...current,
        [discussionId]: "",
      }));

      const data = await getDiscussionReplies(discussionId);

      setReplies((current) => ({
        ...current,
        [discussionId]: data,
      }));
    } catch {
      setReplyErrors((current) => ({
        ...current,
        [discussionId]: "Unable to load comments. Please try again.",
      }));
    }
  };

  const handleCreateReply = async (discussionId: string) => {
    const replyContent = replyInputs[discussionId]?.trim();

    if (!replyContent) return;

    try {
      setReplyLoading(discussionId);
      setReplyErrors((current) => ({
        ...current,
        [discussionId]: "",
      }));

      const newReply = await createDiscussionReply(
        discussionId,
        replyContent
      );

      setReplies((current) => {
        const existingReplies = current[discussionId] || [];
        const exists = existingReplies.some(
          (reply) => reply._id === newReply._id
        );

        if (exists) return current;

        return {
          ...current,
          [discussionId]: [...existingReplies, newReply],
        };
      });

      setReplyInputs((current) => ({
        ...current,
        [discussionId]: "",
      }));
    } catch {
      setReplyErrors((current) => ({
        ...current,
        [discussionId]: "Unable to add comment. Please try again.",
      }));
    } finally {
      setReplyLoading(null);
    }
  };

  const handleUpdateReply = async (replyId: string, discussionId: string) => {
    if (!editReplyContent.trim()) return;

    try {
      setReplyActionLoading(true);
      setReplyErrors((current) => ({
        ...current,
        [discussionId]: "",
      }));

      const updatedReply = await updateDiscussionReply(
        replyId,
        editReplyContent.trim()
      );

      setReplies((current) => ({
        ...current,
        [discussionId]: (current[discussionId] || []).map((reply) =>
          reply._id === replyId ? updatedReply : reply
        ),
      }));

      setEditingReplyId(null);
      setEditReplyContent("");
    } catch {
      setReplyErrors((current) => ({
        ...current,
        [discussionId]: "Unable to update comment. Please try again.",
      }));
    } finally {
      setReplyActionLoading(false);
    }
  };

  const handleDeleteReply = async (replyId: string, discussionId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      setReplyActionLoading(true);
      setReplyErrors((current) => ({
        ...current,
        [discussionId]: "",
      }));

      await deleteDiscussionReply(replyId);

      setReplies((current) => ({
        ...current,
        [discussionId]: (current[discussionId] || []).filter(
          (reply) => reply._id !== replyId
        ),
      }));
    } catch {
      setReplyErrors((current) => ({
        ...current,
        [discussionId]: "Unable to delete comment. Please try again.",
      }));
    } finally {
      setReplyActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7F0] p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#374638]">
              Discussion
            </h1>
            <p className="mt-2 text-[#879183]">
              Share ideas, ask questions and connect with other students.
            </p>
          </div>

          <button
            onClick={fetchDiscussions}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-[#E5EBDD] bg-white px-4 py-2 text-sm font-medium text-[#4F7049] transition hover:bg-[#F0F4EB] disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        <form
          onSubmit={handleCreateDiscussion}
          className="mb-6 rounded-2xl border border-[#E5EBDD] bg-white p-6 shadow-sm"
        >
          <h2 className="mb-5 text-xl font-semibold text-[#374638]">
            Create a Discussion
          </h2>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-[#374638]">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="What would you like to discuss?"
              maxLength={150}
              className="w-full rounded-xl border border-[#E5EBDD] bg-[#FAFBF8] px-4 py-3 text-sm text-[#374638] outline-none transition placeholder:text-[#A1AA9C] focus:border-[#718B68]"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-[#374638]">
              Content
            </label>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Share your thoughts, questions or ideas with other students..."
              rows={5}
              maxLength={5000}
              className="w-full resize-y rounded-xl border border-[#E5EBDD] bg-[#FAFBF8] px-4 py-3 text-sm text-[#374638] outline-none transition placeholder:text-[#A1AA9C] focus:border-[#718B68]"
            />
          </div>

          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                onChange={(event) =>
                  setAttachment(event.target.files?.[0] || null)
                }
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 rounded-xl border border-[#E5EBDD] px-4 py-2 text-sm font-medium text-[#4F7049] transition hover:bg-[#F0F4EB]"
              >
                <Paperclip size={17} />
                Attach file
              </button>
            </div>

            {attachment && (
              <div className="flex max-w-full items-center gap-2 rounded-lg bg-[#F0F4EB] px-3 py-2 text-sm text-[#4F7049]">
                <Paperclip size={15} />
                <span className="max-w-[200px] truncate">
                  {attachment.name}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setAttachment(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="rounded-full p-1 hover:bg-[#DCE8D5]"
                  aria-label="Remove attachment"
                >
                  <X size={15} />
                </button>
              </div>
            )}
          </div>

          <p className="mb-4 text-xs text-[#879183]">
            Supported: PDF, DOC, DOCX, PPT, PPTX, JPG and PNG. Maximum 10MB.
          </p>

          {error && (
            <p className="mb-4 text-sm text-[#B56D62]">{error}</p>
          )}

          {success && (
            <p className="mb-4 text-sm text-[#4F7049]">{success}</p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={publishing}
              className="flex items-center gap-2 rounded-xl bg-[#718B68] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5F7957] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send size={16} />
              {publishing ? "Publishing..." : "Publish Discussion"}
            </button>
          </div>
        </form>

        <div className="mb-5">
          <h2 className="text-xl font-semibold text-[#374638]">
            Recent Discussions
          </h2>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-[#E5EBDD] bg-white p-10 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#DCE8D5] border-t-[#718B68]" />
            <p className="mt-4 text-sm text-[#879183]">
              Loading discussions...
            </p>
          </div>
        ) : error && discussions.length === 0 ? (
          <div className="rounded-2xl border border-[#E5EBDD] bg-white p-8 text-center">
            <p className="text-sm text-[#B56D62]">{error}</p>
            <button
              onClick={fetchDiscussions}
              className="mt-4 rounded-xl bg-[#718B68] px-5 py-2 text-sm font-medium text-white hover:bg-[#5F7957]"
            >
              Try Again
            </button>
          </div>
        ) : discussions.length === 0 ? (
          <div className="rounded-2xl border border-[#E5EBDD] bg-white p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#DCE8D5] text-[#718B68]">
              <MessageSquare size={28} />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-[#374638]">
              No discussions yet
            </h2>
            <p className="mt-2 text-sm text-[#879183]">
              Be the first to start a discussion with other students.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {discussions.map((discussion) => (
              <article
                key={discussion._id}
                className="rounded-2xl border border-[#E5EBDD] bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    {discussion.userId?.profileImage ? (
                      <img
                        src={discussion.userId.profileImage}
                        alt={discussion.userId.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DCE8D5] font-semibold text-[#4F7049]">
                        {discussion.userId?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="font-semibold text-[#374638]">
                        {discussion.userId?.name || "Student"}
                      </p>
                      <p className="text-xs text-[#879183]">
                        {new Date(discussion.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {currentUserId === discussion.userId?._id &&
                    editingDiscussionId !== discussion._id && (
                      <div className="flex shrink-0 gap-3">
                        <button
                          type="button"
                          onClick={() => handleStartEditDiscussion(discussion)}
                          className="text-xs font-medium text-[#4F7049] hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          disabled={discussionActionLoading}
                          onClick={() => handleDeleteDiscussion(discussion._id)}
                          className="text-xs font-medium text-[#B56D62] hover:underline disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                </div>

                {editingDiscussionId === discussion._id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editDiscussionTitle}
                      onChange={(event) =>
                        setEditDiscussionTitle(event.target.value)
                      }
                      maxLength={150}
                      className="w-full rounded-xl border border-[#E5EBDD] bg-[#FAFBF8] px-4 py-3 text-sm text-[#374638] outline-none focus:border-[#718B68]"
                    />

                    <textarea
                      value={editDiscussionContent}
                      onChange={(event) =>
                        setEditDiscussionContent(event.target.value)
                      }
                      rows={5}
                      maxLength={5000}
                      className="w-full resize-y rounded-xl border border-[#E5EBDD] bg-[#FAFBF8] px-4 py-3 text-sm text-[#374638] outline-none focus:border-[#718B68]"
                    />

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={handleCancelEditDiscussion}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-[#879183] hover:bg-[#F0F4EB]"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        disabled={
                          discussionActionLoading ||
                          !editDiscussionTitle.trim() ||
                          !editDiscussionContent.trim()
                        }
                        onClick={() =>
                          handleUpdateDiscussion(discussion._id)
                        }
                        className="rounded-lg bg-[#718B68] px-4 py-2 text-sm font-medium text-white hover:bg-[#5F7957] disabled:opacity-50"
                      >
                        {discussionActionLoading ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold text-[#374638]">
                      {discussion.title}
                    </h2>

                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#667363]">
                      {discussion.content}
                    </p>

                    {discussion.attachment && (
                      <a
                        href={discussion.attachment.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#F0F4EB] px-4 py-3 text-sm font-medium text-[#4F7049] hover:bg-[#E5EFE1]"
                      >
                        <Paperclip size={16} />
                        {discussion.attachment.fileName}
                      </a>
                    )}
                  </>
                )}

                <div className="mt-5 border-t border-[#E5EBDD] pt-4">
                  <button
                    type="button"
                    onClick={() => toggleReplies(discussion._id)}
                    className="flex items-center gap-2 text-sm font-medium text-[#4F7049] hover:text-[#374638]"
                  >
                    <MessageSquare size={17} />
                    Comments
                    {expandedDiscussions.includes(discussion._id) ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>

                  {expandedDiscussions.includes(discussion._id) && (
                    <div className="mt-4 space-y-4">
                      <div className="space-y-3">
                        {(replies[discussion._id] || []).map((reply) => (
                          <div key={reply._id} className="flex gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#DCE8D5] text-sm font-semibold text-[#4F7049]">
                              {reply.userId?.name?.charAt(0).toUpperCase() || "U"}
                            </div>

                            <div className="min-w-0 flex-1 rounded-xl bg-[#F5F7F0] p-3">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="text-sm font-semibold text-[#374638]">
                                  {reply.userId?.name || "Student"}
                                </p>
                                <p className="text-xs text-[#879183]">
                                  {new Date(reply.createdAt).toLocaleString()}
                                </p>
                              </div>

                              {editingReplyId === reply._id ? (
                                <div className="mt-2 space-y-2">
                                  <textarea
                                    value={editReplyContent}
                                    onChange={(event) =>
                                      setEditReplyContent(event.target.value)
                                    }
                                    maxLength={2000}
                                    rows={3}
                                    className="w-full rounded-lg border border-[#E5EBDD] bg-white p-3 text-sm text-[#374638] outline-none focus:border-[#718B68]"
                                  />

                                  <div className="flex justify-end gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingReplyId(null);
                                        setEditReplyContent("");
                                      }}
                                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-[#879183] hover:bg-[#E5EBDD]"
                                    >
                                      Cancel
                                    </button>

                                    <button
                                      type="button"
                                      disabled={
                                        replyActionLoading ||
                                        !editReplyContent.trim()
                                      }
                                      onClick={() =>
                                        handleUpdateReply(
                                          reply._id,
                                          discussion._id
                                        )
                                      }
                                      className="rounded-lg bg-[#718B68] px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                                    >
                                      Save
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <p className="mt-2 whitespace-pre-wrap text-sm text-[#667363]">
                                    {reply.content}
                                  </p>

                                  {currentUserId === reply.userId?._id && (
                                    <div className="mt-3 flex justify-end gap-3">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setEditingReplyId(reply._id);
                                          setEditReplyContent(reply.content);
                                        }}
                                        className="text-xs font-medium text-[#4F7049] hover:underline"
                                      >
                                        Edit
                                      </button>

                                      <button
                                        type="button"
                                        disabled={replyActionLoading}
                                        onClick={() =>
                                          handleDeleteReply(
                                            reply._id,
                                            discussion._id
                                          )
                                        }
                                        className="text-xs font-medium text-[#B56D62] hover:underline disabled:opacity-50"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        ))}

                        {replies[discussion._id]?.length === 0 && (
                          <p className="py-2 text-sm text-[#879183]">
                            No comments yet. Start the conversation!
                          </p>
                        )}
                      </div>

                      {replyErrors[discussion._id] && (
                        <p className="text-sm text-[#B56D62]">
                          {replyErrors[discussion._id]}
                        </p>
                      )}

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={replyInputs[discussion._id] || ""}
                          onChange={(event) =>
                            setReplyInputs((current) => ({
                              ...current,
                              [discussion._id]: event.target.value,
                            }))
                          }
                          onKeyDown={(event) => {
                            if (event.key === "Enter" && !event.shiftKey) {
                              event.preventDefault();
                              handleCreateReply(discussion._id);
                            }
                          }}
                          placeholder="Write a comment..."
                          maxLength={2000}
                          className="min-w-0 flex-1 rounded-xl border border-[#E5EBDD] bg-[#FAFBF8] px-4 py-3 text-sm text-[#374638] outline-none focus:border-[#718B68]"
                        />

                        <button
                          type="button"
                          onClick={() => handleCreateReply(discussion._id)}
                          disabled={
                            replyLoading === discussion._id ||
                            !replyInputs[discussion._id]?.trim()
                          }
                          className="flex items-center justify-center rounded-xl bg-[#718B68] p-3 text-white transition hover:bg-[#5F7957] disabled:cursor-not-allowed disabled:opacity-50"
                          aria-label="Send comment"
                        >
                          <Send size={17} />
                        </button>
                      </div>

                      {replyLoading === discussion._id && (
                        <p className="text-xs text-[#879183]">
                          Posting comment...
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Discussion;
