// import { UserButton } from "@clerk/clerk-react";
import {
  AppBar,
  Box,
  Button,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { FEPagePaths } from "../../Shared/constants";
import { useMsal } from "@azure/msal-react";

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const IconStyle = styled.div`
  cursor: pointer;
`;

const NavBarRightSection = styled.div`
  display: flex;
  align-items: center;
`;

const TabLowerCase = styled(Tab)`
  && {
    text-transform: none;
    border-radius: 20px;
    color: #030303;
    border-color: #030303;
  }
`;

const TabValues = {
  HOME: 0,
  INTEGRATIONS: 1,
};

const TabLabels = {
  HOME: "Home",
  INTEGRATIONS: "Manage Integrations",
};

const TabRoutes = {
  [TabValues.HOME]: FEPagePaths.HOME,
  [TabValues.INTEGRATIONS]: FEPagePaths.INTEGRATIONS,
};

const Navbar = () => {
  const navigate = useNavigate();
  const { instance } = useMsal();
  const [selectedTab, setSelectedTab] = useState(TabValues.HOME);

  const onIconClick = () => {
    navigate("/");
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    navigate(TabRoutes[newValue]);
  };

  const onLogoutClick = () => {
    instance.logoutRedirect();
  };

  return (
    <AppBar color="transparent" sx={{ boxShadow: 0 }}>
      <Container>
        <Toolbar
          sx={{
            width: "80%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <IconStyle onClick={onIconClick}>
            <Typography variant="h3" fontWeight="bold">
              R
            </Typography>
          </IconStyle>
          <NavBarRightSection>
            <Box mr={2}>
              <Tabs value={selectedTab} onChange={handleTabChange} centered>
                <TabLowerCase label={TabLabels.HOME} />
                <TabLowerCase label={TabLabels.INTEGRATIONS} />
              </Tabs>
            </Box>
            {/* <UserButton /> */}
            <Button onClick={onLogoutClick}>Logout</Button>
          </NavBarRightSection>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
