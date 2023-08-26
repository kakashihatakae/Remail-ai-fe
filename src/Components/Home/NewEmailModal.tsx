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
import { BASE_URL } from "../../Shared/constants";

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
  const [formData, setFormData] = useState({
    title: "Software Developer",
    onsite_remote: "",
    contract_type: "",
    duration: "",
    rate: "",
    visa: "",
    experience: "",
    skills: "Java, Angular",
    location: "",
    userId: "user_2Tzg3Jq7QUhJfPoGhQasmQ3EX9u",
  });

  const disableSubmitButton = !formData.skills || !formData.title;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    handleIsLoading(true);
    handleCloseDialog();
    let newEmail = {};
    try {
      const response = await fetch(`${BASE_URL}/new_email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      newEmail = await response.json();
    } catch (error) {
      throw new Error(`[NewEmailModal]: ${error}`);
    }

    handleIsLoading(false);
    navigate("/email_details", { state: newEmail });
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
            name="title"
            label="Title"
            fullWidth
            error={!formData.title.length}
            value={formData.title}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            name="location"
            label="Location"
            fullWidth
            value={formData.location}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                name="onsite_remote"
                label="Onsite/Remote"
                fullWidth
                value={formData.onsite_remote}
                onChange={handleChange}
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="contract_type"
                label="Contract Type"
                fullWidth
                value={formData.contract_type}
                onChange={handleChange}
                margin="normal"
                required
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                name="duration"
                label="Duration"
                fullWidth
                value={formData.duration}
                onChange={handleChange}
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="rate"
                label="Rate"
                fullWidth
                value={formData.rate}
                onChange={handleChange}
                margin="normal"
                required
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                name="visa"
                label="Visa"
                fullWidth
                value={formData.visa}
                onChange={handleChange}
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="experience"
                label="Experience"
                fullWidth
                value={formData.experience}
                onChange={handleChange}
                margin="normal"
                required
              />
            </Grid>
          </Grid>
          <TextField
            name="skills"
            label="Skills"
            error={!formData.skills}
            multiline
            rows={3}
            fullWidth
            value={formData.skills}
            onChange={handleChange}
            margin="normal"
            required
          />
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
