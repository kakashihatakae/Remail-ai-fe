import { Divider } from "@mui/material";
import React from "react";
import { styled } from "styled-components";

interface EmailItemProps {
  title: String;
  experience: String;
  skills: String;
  visa: String;
  location: String;
  rate: String;
}

const Container = styled.div`
  padding: 21px;
  margin-top: 5px;
  margin-bottom: 7px;
  border-color: #ebebeb;
  border-radius: 10px;
  border-style: solid;
  border-width: 1px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  &:hover {
    box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.7);
  }
`;

const JobTitle = styled.div`
  font-size: 20px;
  font-weight: medium;
`;

const Location = styled.div`
  font-size: 14px;
  font-weight: light;
  color: #5d5d5b;
  margin-top: 4px;
`;

const Experience = styled.div`
  font-weight: medium;
  font-size: 20px;
`;

const Visa = styled.div`
  font-size: 14px;
  font-weight: light;
  color: #5d5d5b;
  margin-top: 4px;
  margin-bottom: 16px;
`;

const Rate = styled.div`
  padding-right: 16px;
  font-size: 25px;
  font-weight: 500;
`;

const JobDescription = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Skills = styled.div`
  font-size: 14px;
  max-width: 300px;
`;

const EmailItem = ({
  title,
  experience,
  skills,
  visa,
  location,
  rate,
}: EmailItemProps): React.ReactElement => {
  return (
    <Container>
      <JobDescription>
        <div>
          <JobTitle>{title}</JobTitle>
          <Location>Location: {location}</Location>
          <Visa>Visa: {visa}</Visa>
          <Skills>{skills}</Skills>
        </div>
        <Divider
          orientation="vertical"
          variant="middle"
          flexItem
          sx={{ mx: 3 }}
        />
        <Experience>{experience}</Experience>
      </JobDescription>
      <Rate>{rate}</Rate>
    </Container>
  );
};

export default EmailItem;
