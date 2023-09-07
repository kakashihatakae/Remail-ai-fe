import { Divider, Typography } from "@mui/material";
import React from "react";
import { styled } from "styled-components";

interface EmailItemProps {
  email: string;
  name: string;
  company: string;
}

const Container = styled.div`
  padding: 10px;
  margin-top: 5px;
  border-color: #ebebeb;
  border-radius: 10px;
  border-style: solid;
  border-width: 1px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  cursor: pointer;
  &:hover {
    box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.7);
  }
`;

const JobDescription = styled.div`
  display: flex;
  flex-direction: column;
  flex-direction: row;
  align-items: center;
`;

const EmailHeading = styled.div`
  color: #5d5d5b;
`;

const EmailItem = ({
  email,
  name,
  company,
}: EmailItemProps): React.ReactElement => {
  return (
    <Container>
      <JobDescription>
        <Typography variant="body2" fontWeight="bold">
          {name}
        </Typography>
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        <Typography variant="body2" sx={{ color: "#2196f3" }}>
          {company}
        </Typography>
      </JobDescription>
      <EmailHeading>
        <Typography variant="body2" fontWeight="light">
          {email}
        </Typography>
      </EmailHeading>
    </Container>
  );
};

export default EmailItem;
