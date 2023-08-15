import { UserButton } from "@clerk/clerk-react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
// import Container from "@mui/material/Container";

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const IconStyle = styled.div`
  cursor: pointer;
`;

const Navbar = () => {
  const navigate = useNavigate();

  const onIconClick = () => {
    navigate("/");
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
          <UserButton />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
