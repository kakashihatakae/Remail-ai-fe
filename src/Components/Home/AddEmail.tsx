import { Button } from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "styled-components";

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

const NewEmailText = styled.div`
  margin-right: 16px;
`;

const Headline = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const Subtitle = styled.div`
  color: #5d5d5b;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

interface AddEmailProps {
  onAddEmail: () => void;
}

const AddEmail = ({ onAddEmail }: AddEmailProps) => {
  return (
    <Container>
      <NewEmailText>
        <Headline>Home</Headline>
        <Subtitle>The perfect candidate is waiting for you! </Subtitle>
      </NewEmailText>
      <NewEmailButton
        variant="outlined"
        color="primary"
        startIcon={<AddIcon />}
        onClick={onAddEmail}
      >
        New Campaign
      </NewEmailButton>
    </Container>
  );
};

export default AddEmail;
