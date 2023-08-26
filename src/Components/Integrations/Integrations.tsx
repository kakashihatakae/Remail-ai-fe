import React, { useState } from "react";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider, useMsal } from "@azure/msal-react";
import { Button } from "@mui/material";

const Integrations = () => {
  const { instance, inProgress, accounts } = useMsal();
  const [data, setData] = useState(null);
  const accessTokenRequest = {
    scopes: ["user.read", "mail.read"],
    account: accounts[0],
  };

  const handleClick = async () => {
    try {
      let token = "";
      try {
        token = (await instance.acquireTokenSilent(accessTokenRequest))
          .accessToken;
      } catch (error) {
        token = (await instance.acquireTokenPopup(accessTokenRequest))
          .accessToken;
      }

      var options = {
        method: "GET",
        headers: {
          Authorization: token,
        },
      };
      var graphEndpoint = "https://graph.microsoft.com/v1.0/me";

      const response = await fetch(graphEndpoint, options);
      const meData = await response.json();
      console.log(meData);
      setData(meData);
    } catch (error) {
      console.log(error);
    }
  };

  return <Button onClick={handleClick}>Click</Button>;
};

export default Integrations;
