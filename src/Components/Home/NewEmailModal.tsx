import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
// import { BASE_URL } from "../../Shared/constants";
import { getGeneratedIntro, saveConversationId } from "./ApiHelper";
import { useMsal } from "@azure/msal-react";
import { useMeInfo } from "../../Shared/MeContext/MeContext";
import { FEPagePaths } from "../../Shared/constants";
import {
  createDraftMessage,
  getToken,
} from "../../Shared/SharedApiHelper/SharedApiHelper";

const NewEmailButton = styled(Button)`
  && {
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

const Headline = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

interface NewEmailModalProps {
  showDialog: boolean;
  handleCloseDialog: () => void;
  handleIsLoading: (isLoading: boolean) => void;
}

const NewEmailModal = ({
  showDialog,
  handleCloseDialog,
  handleIsLoading,
}: NewEmailModalProps): React.ReactElement => {
  const navigate = useNavigate();
  const { accounts, instance } = useMsal();
  const { mail, companyName } = useMeInfo();
  const [formData, setFormData] = useState({
    vendorEmail: "",
    vendorName: "",
    vendorCompany: "",
  });

  const disableSubmitButton =
    !formData.vendorCompany || !formData.vendorEmail || !formData.vendorName;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    handleIsLoading(true);
    handleCloseDialog();

    try {
      const aiEmail = await getGeneratedIntro({
        ...formData,
        senderName: accounts[0].name,
        senderCompany: companyName,
        senderEmail: mail,
      });

      const token = await getToken(accounts[0], instance);
      const draftInfo = await createDraftMessage({
        ...aiEmail,
        vendorEmail: formData.vendorEmail,
        token,
      });

      saveConversationId(
        draftInfo?.conversationId,
        accounts[0].localAccountId,
        formData
      );
      navigate(FEPagePaths.EMAIL_DETAILS, {
        state: draftInfo?.conversationId,
      });
    } catch (error) {
      throw new Error(`[NewEmailModal]: ${error}`);
    }

    handleIsLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <Dialog open={showDialog} onClose={handleCloseDialog}>
        <DialogContent>
          <Headline>
            <Typography variant="h5" fontWeight="bold">
              New Email Form
            </Typography>
            <HighlightOffIcon
              sx={{ color: "gray" }}
              onClick={handleCloseDialog}
            />
          </Headline>
          <TextField
            name="vendorEmail"
            label="Receiver Email"
            error={!formData.vendorEmail}
            fullWidth
            value={formData.vendorEmail}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                name="vendorCompany"
                label="Vendor Company"
                fullWidth
                error={!formData.vendorCompany}
                value={formData.vendorCompany}
                onChange={handleChange}
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="vendorName"
                label="Name"
                fullWidth
                value={formData.vendorName}
                error={!formData.vendorName}
                onChange={handleChange}
                margin="normal"
                required
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2 }}>
            <NewEmailButton
              fullWidth
              variant="outlined"
              onClick={handleSubmit}
              disabled={disableSubmitButton}
            >
              Submit
            </NewEmailButton>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default NewEmailModal;
