import "./App.css";
import styled from "styled-components";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home/Home";
import EmailDetails from "./Components/EmailDetails/EmailDetails";
import Navbar from "./Components/NavBar/Navbar";
import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import Integrations from "./Components/Integrations/Integrations";
import { FEPagePaths } from "./Shared/constants";

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

const REACT_APP_CLERK_PUBLISHABLE_KEY = process.env.REACT_APP_VAR_NAME;

function App() {
  return (
    <>
      <ClerkProvider publishableKey={REACT_APP_CLERK_PUBLISHABLE_KEY || ""}>
        <SignedIn>
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
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </ClerkProvider>
    </>
  );
}

export default App;
