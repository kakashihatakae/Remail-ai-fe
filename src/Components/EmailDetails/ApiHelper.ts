import { MS_GRAPH_BASE_URL } from "../../Shared/constants";

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
    await fetch(graphEndPoint, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBody),
    });
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
