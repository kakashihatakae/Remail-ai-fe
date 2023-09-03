import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import AppMs from "./AppMs";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const pca = new PublicClientApplication({
  auth: {
    clientId: process.env.REACT_APP_CLIENT_ID || "",
    authority: "https://login.microsoftonline.com/organizations",
    redirectUri: "/",
  },
});

root.render(
  // <React.StrictMode>
  // <App />
  <MsalProvider instance={pca}>
    <AppMs />
  </MsalProvider>
  // </React.StrictMode>
);
