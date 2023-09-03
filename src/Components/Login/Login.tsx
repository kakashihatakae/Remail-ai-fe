import React from "react";
import { InteractionType } from "@azure/msal-browser";
import { useMsalAuthentication } from "@azure/msal-react";
import { Box, Paper, Typography } from "@mui/material";
import { styled } from "styled-components";
import ThemedButton from "../../Shared/Button/ThemedButton";
import { MicrosoftLogo } from "../../Static";

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const LoginComponent = styled(Paper)`
  && {
    border-radius: 30px;
  }
  width: 400px;
  padding: 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LoginSubHeader = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Login = () => {
  const request = {
    scopes: ["User.Read"],
    prompt: "select_account",
  };
  const { login, result, error } = useMsalAuthentication(
    InteractionType.Silent,
    request
  );
  function handleLogin() {
    login(InteractionType.Redirect, request);
  }
  return (
    <LoginContainer>
      <LoginComponent sx={{ borderRadius: 8 }}>
        <LoginSubHeader>
          <Typography variant="h3" fontWeight="bold">
            Remail.ai
          </Typography>
          <Box my={3}>
            <Typography variant="h5" fontWeight="medium">
              Sign-in
            </Typography>
            <Typography variant="h6" fontWeight="medium" sx={{ color: "gray" }}>
              Sign in with your corporate account
            </Typography>
          </Box>
        </LoginSubHeader>
        <Box mt={4}>
          <ThemedButton
            onClick={handleLogin}
            variant="outlined"
            startIcon={<img src={MicrosoftLogo} alt="" />}
          >
            Signin using Microsoft
          </ThemedButton>
        </Box>
      </LoginComponent>
    </LoginContainer>
  );
};

export default Login;
