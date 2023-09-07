import { Typography } from "@mui/material";
import React from "react";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { styled } from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

interface SingleEmailHeaderprops {
  receiverEmail: string;
  senderEmail: string;
  receiverName: string;
}

const SingleEmailHeader = ({
  receiverName,
  receiverEmail,
  senderEmail,
}: SingleEmailHeaderprops) => {
  return (
    <Container>
      <Typography variant="h6" fontWeight="bold">
        {receiverName}
      </Typography>
      <Typography
        sx={{
          display: "flex",
          alignItems: "center",
          fontWeight: "light",
          color: "#5d5d5b",
        }}
        variant="body2"
      >
        {senderEmail}
        <ArrowRightAltIcon sx={{ paddingX: 1 }} />
        {receiverEmail}
      </Typography>
    </Container>
  );
};

export default SingleEmailHeader;
