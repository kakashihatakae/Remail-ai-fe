import { Box, Button, CircularProgress, Paper } from "@mui/material";
import React, { useState } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useLocation, useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { BASE_URL } from "../../Shared/constants";

const LoadingContainer = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  height: 150%;
  backdrop-filter: blur(2px);
`;

const NewEmailButton = styled(Button)`
  && {
    text-transform: none;
    border-radius: 20px;
    color: #030303;
    border-color: #030303;
    &:hover {
      box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.6);
      border-color: #ebebeb;
      border-color: #030303;
      background: none;
    }
  }
`;

const HeadingContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  width: 100%;
`;

const Headline = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const Subtitle = styled.div`
  color: #5d5d5b;
`;

interface EmailDetailsProps {
  state: {
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
  };
}

const EmailDetails = () => {
  const requirement: EmailDetailsProps = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  console.log(requirement);

  const regenerateEmail = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/regenerate_email/${requirement.state.id}`
      );
      const emailString = await response.json();
      navigate("/email_details", {
        state: { ...requirement.state, email: emailString.ai_email },
      });
      // setEmail(emailString.ai_email);
    } catch (error) {
      console.error("Error updating data:", error);
    }
    setIsLoading(false);
  };

  return (
    <>
      <HeadingContainer>
        {/* <JDText> */}
        <Box mr={5}>
          <Headline>{requirement.state.title}</Headline>
          <Subtitle>The perfect candidate is waiting for you! </Subtitle>
        </Box>
        {/* </JDText> */}
        <NewEmailButton
          variant="outlined"
          color="primary"
          startIcon={<AutorenewIcon />}
          onClick={regenerateEmail}
        >
          Regenerate Email
        </NewEmailButton>
        {isLoading && (
          <>
            <LoadingContainer />
            <CircularProgress
              style={{ position: "absolute", top: "50%", left: "50%" }}
            />
          </>
        )}
      </HeadingContainer>
      <Paper
        sx={{ whiteSpace: "pre-wrap", width: "100%", marginTop: 4 }}
        variant="outlined"
      >
        <Box p={3}>
          <ReactMarkdown>{requirement.state.email}</ReactMarkdown>
        </Box>
      </Paper>
    </>
  );
};

export default EmailDetails;
