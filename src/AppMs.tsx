import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { styled } from "styled-components";
import Navbar from "./Components/NavBar/Navbar";
import { FEPagePaths } from "./Shared/constants";
import EmailDetails from "./Components/EmailDetails/EmailDetails";
import Integrations from "./Components/Integrations/Integrations";
import Home from "./Components/Home/Home";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import Login from "./Components/Login/Login";

const OuterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Container = styled.div`
  margin-top: 80px;
  display: flex;
  justify-content: center;
  width: 80%;
  flex-direction: column;
  align-items: center;
`;

const AppMs = () => {
  return (
    <>
      <AuthenticatedTemplate>
        <OuterContainer>
          <Router>
            <Navbar />
            <Container>
              <Routes>
                <Route path={FEPagePaths.HOME} Component={Home} />
                <Route
                  path={FEPagePaths.EMAIL_DETAILS}
                  Component={EmailDetails}
                />
                <Route
                  path={FEPagePaths.INTEGRATIONS}
                  Component={Integrations}
                />
              </Routes>
            </Container>
          </Router>
        </OuterContainer>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Login />
      </UnauthenticatedTemplate>
    </>
  );
};

export default AppMs;
