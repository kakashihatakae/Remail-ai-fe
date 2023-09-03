// ApiContext.js
import { useMsal } from "@azure/msal-react";
import React, { createContext, useContext, useEffect, useState } from "react";
import { MS_GRAPH_BASE_URL } from "../constants";
import { getToken } from "../SharedApiHelper/SharedApiHelper";

interface APIProviderProps {
  children: React.ReactNode;
}

interface dataReturnType {
  companyName?: "";
  mail: "";
  displayName: "";
}

const defaultMeValue: dataReturnType = {
  companyName: "",
  mail: "",
  displayName: "",
};
const USER_FIELDS = "mail,companyName,aboutMe,displayName";

const ApiContext = createContext<dataReturnType>(defaultMeValue);

export const MeInfoProfider: React.FC<APIProviderProps> = ({ children }) => {
  const [data, setData] = useState(defaultMeValue);
  const { instance, accounts } = useMsal();

  useEffect(() => {
    const fetchDataWithAuth = async () => {
      try {
        let token = await getToken(accounts[0], instance);

        const graphMeEndpoint = `${MS_GRAPH_BASE_URL}/me?$select=${USER_FIELDS}`;
        let response = await fetch(graphMeEndpoint, {
          headers: {
            Authorization: token,
          },
        });
        const meData = await response.json();
        setData(meData);

        // const graphOrganisationEndPoint = `${MS_GRAPH_BASE_URL}/organization`;
        // response = await fetch(graphOrganisationEndPoint, {
        //   headers: {
        //     Authorization: token,
        //   },
        // });
        // const organisationData = await response.json();
        // console.log({ organisationData });
      } catch (error) {
        console.log(
          `[Me Context]: Failed to get Me Information. Error: ${error}`
        );
      }
    };

    fetchDataWithAuth();
  }, [instance]);

  return <ApiContext.Provider value={data}>{children}</ApiContext.Provider>;
};

export const useMeInfo = () => {
  return useContext(ApiContext);
};
