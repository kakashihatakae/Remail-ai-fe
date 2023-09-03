import { AccountInfo, IPublicClientApplication } from "@azure/msal-browser";
import { MS_GRAPH_BASE_URL } from "../constants";

interface Email {
  body: string;
  subject: string;
}

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
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw new Error(
      `[sendDraftMessage]: failed to send draft in outlook. Error: ${error}`
    );
  }
};

export const getToken = async (
  account: AccountInfo,
  instance: IPublicClientApplication
) => {
  const accessTokenRequest = {
    scopes: ["user.read", "mail.readwrite", "mail.send"],
    account: account,
  };
  let token = "";
  try {
    token = (await instance.acquireTokenSilent(accessTokenRequest)).accessToken;
  } catch (error) {
    console.log(error);
    token = (await instance.acquireTokenPopup(accessTokenRequest)).accessToken;
  }
  return token;
};
