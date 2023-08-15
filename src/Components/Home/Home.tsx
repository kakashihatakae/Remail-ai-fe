import React, { useEffect, useState } from "react";
import styled from "styled-components";
import AddEmail from "./AddEmail";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EmailItem from "./EmailItem";
import NewEmailModal from "./NewEmailModal";
import { useAuth } from "@clerk/clerk-react";
import { BASE_URL } from "../../Shared/constants";

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

interface Requirement {
  id: number;
  title: string;
  onsite_remote: string;
  contract_type: string;
  duration: string;
  rate: string;
  visa: string;
  experience: string;
  skills: string;
  location: string;
  email: string;
}

const Home = () => {
  const [campaigns, setCampaigns] = useState<Requirement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewEmailModal, setShowNewEmailModal] = useState(false);
  const { getToken, userId } = useAuth();

  const navigate = useNavigate();

  const handleIsLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const onPostClick = (jobRequierment: Requirement) => {
    navigate("/email_details", { state: jobRequierment });
  };

  useEffect(() => {
    const getCampaignData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/get_all_emails/${userId}`, {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
            "Content-Type": "application/json",
          },
        });
        const campaign = await response.json();
        setCampaigns(campaign);
      } catch (error) {
        throw new Error("[Home]: Couldn't get emails");
      }
      setIsLoading(false);
    };
    getCampaignData();
  }, [userId, getToken]);
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
            <div onClick={() => onPostClick(email)}>
              <EmailItem {...email} />
            </div>
          ))}
        </PaperListContainer>
      </AddContainer>
    </>
  );
};

export default Home;
