import { Button } from "@mui/material";
import React, { ReactNode } from "react";
import { styled } from "styled-components";

const ModifiedButton = styled(Button)`
  && {
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 8px;
    padding-bottom: 8px;
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

interface ThemedButtonProps {
  variant?: "text" | "outlined" | "contained";
  color?:
    | "inherit"
    | "error"
    | "primary"
    | "secondary"
    | "success"
    | "info"
    | "warning";
  startIcon?: React.ReactNode;
  onClick: () => void;
  children: ReactNode;
}

const ThemedButton: React.FC<ThemedButtonProps> = ({
  variant,
  color,
  startIcon,
  onClick,
  children,
}) => {
  return (
    <ModifiedButton
      variant={variant}
      color={color}
      startIcon={startIcon}
      onClick={onClick}
    >
      {children}
    </ModifiedButton>
  );
};

export default ThemedButton;
