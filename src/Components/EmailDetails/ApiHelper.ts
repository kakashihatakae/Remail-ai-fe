import { BASE_URL, MS_GRAPH_BASE_URL } from "../../Shared/constants";

export const saveDraftInOutlook = async (
  body: string,
  token: string,
  id: string,
  subject: string
) => {
  const newBody = {
    subject: subject,
    body: {
      contentType: "text",
      content: body,
    },
  };

  const graphEndPoint = `${MS_GRAPH_BASE_URL}/me/messages/${id}`;
  try {
    const res = await fetch(graphEndPoint, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBody),
    });
    return await res.json();
  } catch (error) {
    throw new Error(
      `[EmailEditor/saveDraftMessage]: failed to save a draft in outlook. Error: ${error}`
    );
  }
};

export const getConversation = async (
  conversationId: string,
  token: string
) => {
  const graphEndPoint = `${MS_GRAPH_BASE_URL}/me/messages?$filter=conversationId eq '${conversationId}'`;
  try {
    const res = await fetch(graphEndPoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (error) {
    throw new Error(
      `[EmailDetails/getConversation]: failed to get conersation. Error: ${error}`
    );
  }
};

interface generateReplyProps {
  prevBodySent: string;
  prevSender?: string;
  meetingLink?: string;
  isMeFollowUp: boolean;
  extraNotes?: string;
}

export const getGeneratedReply = async ({
  prevBodySent,
  prevSender,
  meetingLink,
  isMeFollowUp,
  extraNotes,
}: generateReplyProps) => {
  const backendEndPoint = `${BASE_URL}/ai-reply`;
  console.log({ prevBodySent, prevSender, isMeFollowUp });
  try {
    const res = await fetch(backendEndPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prevBodySent,
        prevSender,
        meetingLink,
        isMeFollowUp,
        extraNotes,
      }),
    });
    return await res.json();
  } catch (error) {
    throw new Error(
      `[EmailDetails/generateReply]: failed to generate reply. Error: ${error}`
    );
  }
};

export const createDraftToReply = async (draftMessageInfo: {
  token: string;
  id: string;
}) => {
  const graphEndPoint = `${MS_GRAPH_BASE_URL}/me/messages/${draftMessageInfo.id}/createReply`;
  try {
    const res = await fetch(graphEndPoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${draftMessageInfo.token}`,
      },
    });
    return await res.json();
  } catch (error) {
    throw new Error(
      `[EmailDetails/createDraftToReply]: failed to create draft to reply. Error: ${error}`
    );
  }
};
