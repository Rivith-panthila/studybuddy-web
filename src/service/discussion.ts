import api from "./api";

export interface DiscussionUser {
  _id: string;
  name: string;
  profileImage?: string;
}

export interface Discussion {
  _id: string;
  userId: DiscussionUser;
  title: string;
  content: string;
  attachment?: {
    fileName: string;
    fileUrl: string;
    fileType: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateDiscussionData {
  title: string;
  content: string;
  attachment?: File | null;
}

export const getDiscussions = async (): Promise<Discussion[]> => {
  const response = await api.get("/discussions");
  return response.data.discussions;
};

export const createDiscussion = async (
  data: CreateDiscussionData
): Promise<Discussion> => {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("content", data.content);

  if (data.attachment) {
    formData.append("attachment", data.attachment);
  }

  const response = await api.post("/discussions", formData);

  return response.data.discussion;
};


export interface DiscussionReply {
  _id: string;
  discussionId: string;
  userId: DiscussionUser;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const getDiscussionReplies = async (
  discussionId: string
): Promise<DiscussionReply[]> => {
  const response = await api.get(
    `/discussion-replies/${discussionId}`
  );

  return response.data.replies;
};

export const createDiscussionReply = async (
  discussionId: string,
  content: string
): Promise<DiscussionReply> => {
  const response = await api.post(
    `/discussion-replies/${discussionId}`,
    { content }
  );

  return response.data.reply;
};

export const updateDiscussionReply = async (
  replyId: string,
  content: string
): Promise<DiscussionReply> => {
  const response = await api.put(
    `/discussion-replies/reply/${replyId}`,
    { content }
  );

  return response.data.reply;
};

export const deleteDiscussionReply = async (
  replyId: string
): Promise<void> => {
  await api.delete(`/discussion-replies/reply/${replyId}`);
};
