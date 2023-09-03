import React, { useEffect, useState } from "react";
import styled from "styled-components";
import AddEmail from "./AddEmail";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EmailItem from "./EmailItem";
import NewEmailModal from "./NewEmailModal";
import { getAllCampaigns } from "./ApiHelper";
import { useMsal } from "@azure/msal-react";

const AddContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  flex-direction: column;
  align-items: center;
`;

const LoadingContainer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 150%;
  backdrop-filter: blur(2px);
`;

const PaperListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 25px;
`;

const Home = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { accounts } = useMsal();
  const [showNewEmailModal, setShowNewEmailModal] = useState(false);
  const navigate = useNavigate();

  const handleIsLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const onPostClick = (MSConversationId: string) => {
    navigate("/email_details", { state: MSConversationId });
  };

  useEffect(() => {
    const getCampaignData = async () => {
      setIsLoading(true);
      const res = await getAllCampaigns(accounts[0].localAccountId);
      setCampaigns(res);
      setIsLoading(false);
    };
    getCampaignData();
  }, []);
  const onAddEmail = () => {
    setShowNewEmailModal(true);
  };

  const handleCloseDialog = () => {
    setShowNewEmailModal(false);
  };
  return (
    <>
      <AddContainer>
        <NewEmailModal
          showDialog={showNewEmailModal}
          handleCloseDialog={handleCloseDialog}
          handleIsLoading={handleIsLoading}
        />
        <AddEmail onAddEmail={onAddEmail} />
        {isLoading && (
          <>
            <LoadingContainer />
            <CircularProgress
              style={{ position: "absolute", top: "50%", left: "50%" }}
            />
          </>
        )}
        <PaperListContainer>
          {campaigns.map((email) => (
            <div onClick={() => onPostClick(email.MSConversationId)}>
              <EmailItem
                email={email.vendorEmail}
                name={email.vendorName}
                company={email.vendorCompany}
              />
            </div>
          ))}
        </PaperListContainer>
      </AddContainer>
    </>
  );
};

export default Home;
