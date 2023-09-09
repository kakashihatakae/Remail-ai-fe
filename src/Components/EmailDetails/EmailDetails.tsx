import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import EmailEditor from "./EmailEditor";
import { useMsal } from "@azure/msal-react";
import {
  createDraftMessage,
  getToken,
  sendDraftMessage,
} from "../../Shared/SharedApiHelper/SharedApiHelper";
import { useMeInfo } from "../../Shared/MeContext/MeContext";
import {
  createDraftToReply,
  getConversation,
  getGeneratedReply,
  saveDraftInOutlook,
} from "./ApiHelper";

const LoadingContainer = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  height: 150%;
  backdrop-filter: blur(2px);
`;

const HeadingContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  width: 100%;
`;

export interface EmailDetailsProps {
  id: string;
  bodyPreview: string;
  subject: string;
  isRead: string;
  isDraft: boolean;
  body: {
    contentType: string;
    content: string;
  };
  sender?: {
    emailAddress: {
      name: string;
      address: string;
    };
  };
  from?: {
    emailAddress: {
      name: string;
      address: string;
    };
  };
  toRecipients: {
    emailAddress: {
      name: string;
      address: string;
    };
  }[];
}

interface EmailDetailsState {
  state?: string;
}

const EmailDetails = () => {
  const { state }: EmailDetailsState = useLocation();
  const conversationId = state;
  const { accounts, instance } = useMsal();
  const { mail, displayName } = useMeInfo();

  const [isLoading, setIsLoading] = useState(false);
  const [campaign, setCampaign] = useState<any[]>([]);
  console.log(campaign);
  const navigate = useNavigate();

  if (conversationId === undefined) {
    navigate("/");
  }

  useEffect(() => {
    const getCampaign = async () => {
      try {
        const token = await getToken(accounts[0], instance);
        const response = await getConversation(conversationId || "", token);
        setCampaign(response.value);
      } catch (error) {
        throw new Error(
          `[EmailDetails page]: failed to get email details. Error: ${error}`
        );
      }
    };
    getCampaign();
  }, []);

  const sendEmail = async (id: string) => {
    try {
      const token = await getToken(accounts[0], instance);
      await sendDraftMessage(id, token);
      setTimeout(() => window.location.reload(), 700);
    } catch (error) {
      console.log(
        // TODO:
        // Show a toast if failed to send
        `[EmailDetails/sendEmail]: failed to send email. Try again. Error: ${error}`
      );
    }
  };

  return (
    <>
      <HeadingContainer>
        {isLoading && (
          <>
            <LoadingContainer />
            <CircularProgress
              style={{ position: "absolute", top: "50%", left: "50%" }}
            />
          </>
        )}
      </HeadingContainer>
      {campaign.map((email, index) => {
        const senderEmail =
          email?.sender?.emailAddress.address ||
          email?.from?.emailAddress.address ||
          mail;

        const senderName =
          email?.sender?.emailAddress.name ||
          email?.from?.emailAddress.name ||
          displayName;

        // TODO: get meeting linke
        const generateReply = async () => {
          const token = await getToken(accounts[0], instance);
          const createdReply = await createDraftToReply({
            token,
            id: email.id,
          });
          const isMeFollowUp = senderEmail === mail;
          const newAIReply = await getGeneratedReply({
            prevBodySent: email.body.content,
            isMeFollowUp,
            prevSender: email.sender.emailAddress,
            // meetingLink: "",
            // extraNotes: "",
          });
          const newReply = await saveDraftInOutlook(
            newAIReply.body,
            token,
            createdReply.id,
            ""
          );
          // const newEmail = await createDraftMessage({
          //   ...newAIReply,
          //   token,
          //   vendorEmail: isMeFollowUp
          //     ? email.toRecipients[0].emailAddress.address
          //     : senderEmail,
          // });          const isMeFollowUp = senderEmail === mail;
          // console.log({ newReply });
          setCampaign([...campaign, newReply]);
        };

        return (
          <EmailEditor
            id={email.id}
            receiverEmail={email.toRecipients[0].emailAddress.address}
            receiverName={email.toRecipients[0].emailAddress.name}
            senderName={senderName}
            senderEmail={senderEmail}
            isEditing={email.isDraft}
            sendEmail={() => sendEmail(email.id)}
            generateReply={() => generateReply()}
            body={email.body}
            subject={email.subject}
            key={index}
          />
        );
      })}
    </>
  );
};

export default EmailDetails;
