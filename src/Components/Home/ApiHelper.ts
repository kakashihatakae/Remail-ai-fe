import { BASE_URL, MS_GRAPH_BASE_URL } from "../../Shared/constants";

type VendorInformation = {
  vendorName: string;
  vendorCompany: string;
  vendorEmail: string;
};

type SenderInformation = {
  senderName?: string;
  senderCompany?: string;
  senderEmail: string;
};

type Email = {
  body: string;
  subject: string;
};

/*
 * Permissions-
 * - Delegated : mail.send
 */
export const getGeneratedIntro = async (
  newMailInfo: VendorInformation & SenderInformation
) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/new-email-intro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vendorName: newMailInfo.vendorCompany,
        vendorCompany: newMailInfo.vendorCompany,
        vendorEmail: newMailInfo.vendorEmail,
        senderName: newMailInfo.senderName,
        senderCompany: newMailInfo.senderCompany,
        senderEmail: newMailInfo.senderEmail,
      }),
    });

    return await response.json();
  } catch (error) {
    throw new Error(
      `[ApiHerlper/getGeneratedIntro]: openai failed to generate Intro. ${error}`
    );
  }
};

export const createDraftMessage = async (
  draftMessageInfo: Email & { vendorEmail: string; token: string }
): Promise<any> => {
  let draftResponse = {};
  const body = {
    subject: draftMessageInfo.subject,
    body: {
      contentType: "Text",
      content: draftMessageInfo.body,
    },
    toRecipients: [
      {
        emailAddress: {
          address: draftMessageInfo.vendorEmail,
        },
      },
    ],
  };
  const graphEndPoint = `${MS_GRAPH_BASE_URL}/me/messages`;
  try {
    const response = await fetch(graphEndPoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${draftMessageInfo.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    draftResponse = await response.json();
  } catch (error) {
    throw new Error(
      `[createDraftMessage]: failed to create a draft in outlook. Error: ${error}`
    );
  }
  return draftResponse;
};

/*
 * Permissions-
 * - Delegated : mail.send
 */
export const sendDraftMessage = async (Id: String, token: string) => {
  try {
    const graphEndPoint = `${MS_GRAPH_BASE_URL}/me/messages/${Id}/send`;
    await fetch(graphEndPoint, {
      method: "POST",
      headers: {
        Authorization: token,
      },
    });
  } catch (error) {
    throw new Error(
      `[sendDraftMessage]: failed to send draft in outlook. Error: ${error}`
    );
  }
};

export const saveConversationId = async (
  conversationId: string,
  userId: string,
  vendor: VendorInformation
) => {
  try {
    const backendEndPoint = `${BASE_URL}/campaign`;
    fetch(backendEndPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        MSConversationId: conversationId,
        MSUserId: userId,
        vendorEmail: vendor.vendorEmail,
        vendorCompany: vendor.vendorCompany,
        vendorName: vendor.vendorName,
      }),
    });
  } catch (error) {
    throw new Error(
      `[saveConversationId]: failed to create an email try again.. Error: ${error}`
    );
  }
};

export const getAllCampaigns = async (MSUserId: string) => {
  const backendEndPoint = `${BASE_URL}/campaign/${MSUserId}`;
  let conversationIds = [];
  try {
    const response = await fetch(backendEndPoint);
    conversationIds = await response.json();
  } catch (error) {
    throw new Error(
      `[getAllCampaigns]: failed to get all campaigns. Error: ${error}`
    );
  }
  return conversationIds;
};
