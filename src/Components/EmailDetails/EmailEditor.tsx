import { Box, Paper, TextField } from "@mui/material";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Block, BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";
import ThemedButton from "../../Shared/Button/ThemedButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardControlKeyIcon from "@mui/icons-material/KeyboardControlKey";
import ReplyIcon from "@mui/icons-material/Reply";
import SendIcon from "@mui/icons-material/Send";
import { styled } from "styled-components";
import { debounce } from "lodash";
import { useMsal } from "@azure/msal-react";
import { getToken } from "../../Shared/SharedApiHelper/SharedApiHelper";
import { saveDraftInOutlook } from "./ApiHelper";
import SingleEmailHeader from "./SingleEmailHeader";

const EmailHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const HeaderRightSection = styled.div`
  display: flex;
`;

interface EmailEditorProps {
  id: string;

  body: {
    contentType: string;
    content: string;
  };
  subject: string;
  isEditing?: boolean;

  receiverName: string;
  receiverEmail: string;
  senderName?: string;
  senderEmail: string; // TODO: change

  sendEmail: () => void;
  createFollowup?: () => void;
  disableSendButton?: boolean;
}

const EmailEditor = ({
  isEditing,
  receiverEmail,
  receiverName,
  senderEmail,
  subject,
  createFollowup,
  sendEmail,
  disableSendButton,
  body,
  id,
}: EmailEditorProps): React.ReactElement => {
  const editor: BlockNoteEditor = useBlockNote({
    editable: isEditing,
    onEditorContentChange: () => saveDraft(),
  });
  const [showDropdown, setDropdown] = useState(false);
  const { accounts, instance } = useMsal();
  const [subjectState, setSubjectState] = useState(subject);

  useEffect(() => {
    if (editor) {
      const getBlocks = async () => {
        let blocks: Block[] = [];
        if (body.contentType === "text") {
          blocks = await editor.markdownToBlocks(body.content);
          editor.replaceBlocks(editor.topLevelBlocks, blocks);
        } else {
          blocks = await editor.HTMLToBlocks(body.content);
          editor.replaceBlocks(editor.topLevelBlocks, blocks);
        }
      };
      getBlocks();
    }
  }, [body]);

  const handleSubjectChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setSubjectState(newValue);
    saveDraft();
  };

  const saveDraft = debounce(() => {
    // TODO: try sending in html content type
    const getEditorCont = async () => {
      const savedBody = await editor.blocksToMarkdown(editor.topLevelBlocks);
      const token = await getToken(accounts[0], instance);
      await saveDraftInOutlook(savedBody, token, id, subject);
    };
    getEditorCont();
  }, 1600);

  return (
    <Paper
      sx={{
        whiteSpace: "pre-wrap",
        width: "100%",
        marginTop: 4,
        borderRadius: 4,
      }}
      variant="outlined"
    >
      <Box px={2} py={2}>
        <EmailHeader>
          <SingleEmailHeader
            receiverEmail={receiverEmail}
            receiverName={receiverName}
            senderEmail={senderEmail}
          />
          <HeaderRightSection>
            {isEditing
              ? showDropdown && (
                  <Box mr={3}>
                    <ThemedButton
                      onClick={sendEmail}
                      startIcon={<SendIcon />}
                      disabled={disableSendButton}
                    >
                      Send
                    </ThemedButton>
                  </Box>
                )
              : showDropdown && (
                  <ThemedButton
                    onClick={() => console.log("")}
                    startIcon={<ReplyIcon />}
                  >
                    Generate Reply
                  </ThemedButton>
                )}
            <ThemedButton onClick={() => setDropdown(!showDropdown)}>
              {showDropdown ? (
                <KeyboardArrowDownIcon sx={{ fontSize: 30 }} />
              ) : (
                <KeyboardControlKeyIcon sx={{ fontSize: 30 }} />
              )}
            </ThemedButton>
          </HeaderRightSection>
        </EmailHeader>
      </Box>
      {showDropdown && (
        <>
          <Box mx={7.5}>
            <TextField
              variant="standard"
              sx={{
                display: "flex",
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "#000000",
                },
              }}
              value={subjectState}
              onChange={handleSubjectChange}
              disabled={!isEditing}
            />
          </Box>
          <Box px={1} py={2}>
            <BlockNoteView editor={editor} theme="light" />
          </Box>
        </>
      )}
    </Paper>
  );
};

export default EmailEditor;
