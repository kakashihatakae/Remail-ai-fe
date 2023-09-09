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

/*
 * Permissions-
 * - Delegated : mail.send
 */
export const getGeneratedIntro = async (
  newMailInfo: VendorInformation & SenderInformation
) => {
  try {
    const backendEndPoint = `${BASE_URL}/new-email-intro`;
    const response = await fetch(backendEndPoint, {
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
