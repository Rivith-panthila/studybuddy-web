
import { useEffect, useRef, useState } from "react";
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
  type Discussion as DiscussionType,
  type DiscussionReply,
} from "../service/discussion";

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
  const [replyErrors, setReplyErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const toggleReplies = async (discussionId: string) => {
    const isExpanded = expandedDiscussions.includes(discussionId);

    if (isExpanded) {
      setExpandedDiscussions((current) =>
        current.filter((id) => id !== discussionId)
      );
      return;
    }

    setExpandedDiscussions((current) => [...current, discussionId]);

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

      setReplies((current) => ({
        ...current,
        [discussionId]: [...(current[discussionId] || []), newReply],
      }));

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
                <div className="mb-4 flex items-center gap-3">
                  {discussion.userId?.profileImage ? (
                    <img
                      src={discussion.userId.profileImage}
                      alt={discussion.userId.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DCE8D5] font-semibold text-[#4F7049]">
                      {discussion.userId?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}

                  <div>
                    <p className="font-semibold text-[#374638]">
                      {discussion.userId?.name || "Student"}
                    </p>
                    <p className="text-xs text-[#879183]">
                      {new Date(discussion.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

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
                              <p className="mt-2 whitespace-pre-wrap text-sm text-[#667363]">
                                {reply.content}
                              </p>
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
