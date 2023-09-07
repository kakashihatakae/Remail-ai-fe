import { Box, Paper, TextField } from "@mui/material";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Block, BlockNoteEditor } from "@blocknote/core";
import {
  BlockNoteView,
  lightDefaultTheme,
  useBlockNote,
} from "@blocknote/react";
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
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
`;

const HeaderRightSection = styled.div`
  display: flex;
  align-items: center;
`;

const DropDownArrow = styled.div`
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
`;

const EditorStyle = styled.div`
  p {
    margin: 0px;
    padding: 0px;
    display: flex;
  }

  div._blockContent_7sok8_22 {
    display: flex;
  }
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
  senderName: string;
  senderEmail: string; // TODO: change

  sendEmail: () => void;
  createFollowup?: () => void;
  disableSendButton?: boolean;
}

const EmailEditor = ({
  isEditing,
  receiverEmail,
  senderName,
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
    onEditorContentChange: () => (isEditing ? saveDraft(subjectState) : null),
    defaultStyles: false,
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

  const saveDraft = useMemo(
    () =>
      debounce((subjectDeb: string) => {
        const getEditorCont = async () => {
          const savedBody = await editor.blocksToMarkdown(
            editor.topLevelBlocks
          );
          const token = await getToken(accounts[0], instance);
          await saveDraftInOutlook(
            savedBody,
            token,
            id,
            subjectDeb ?? subjectState
          );
          console.log({ subjectDeb });
        };
        // TODO: try sending in html content type

        getEditorCont();
      }, 1500),
    []
  );

  const handleSubjectChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setSubjectState(newValue);
    if (isEditing) {
      saveDraft(event.target.value);
    }
  };

  return (
    <Paper
      sx={{
        whiteSpace: "pre-wrap",
        width: "100%",
        marginTop: 1,
        borderRadius: 4,
      }}
      variant="outlined"
    >
      <EmailHeader>
        <div onClick={() => setDropdown(!showDropdown)}>
          <SingleEmailHeader
            receiverEmail={receiverEmail}
            receiverName={senderName}
            senderEmail={senderEmail}
          />
        </div>
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
          <DropDownArrow onClick={() => setDropdown(!showDropdown)}>
            {showDropdown ? (
              <KeyboardControlKeyIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </DropDownArrow>
        </HeaderRightSection>
      </EmailHeader>
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
              inputProps={{ style: { fontSize: "0.875rem" } }}
            />
          </Box>
          <Box px={1} py={2}>
            <EditorStyle>
              <BlockNoteView
                editor={editor}
                theme={{
                  ...lightDefaultTheme,
                  componentStyles(theme) {
                    return {
                      Editor: {
                        fontSize: "0.875rem",
                        color: "blue",
                        margin: 0,
                        padding: 0,
                        marginBlock: 0,
                        marginTop: 0,
                      },
                    };
                  },
                }}
              />
            </EditorStyle>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default EmailEditor;
