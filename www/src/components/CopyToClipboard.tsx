import { FC, PropsWithChildren, useCallback } from "react";

import Box from "@mui/material/Box";
import CopyIcon from "@mui/icons-material/ContentCopy";
import Snackbar from "@mui/material/Snackbar";
import { useState } from "react";
import { SxProps, Theme } from "@mui/material/styles";

export const CopyToClipboard: FC<
  PropsWithChildren<{
    text: string;
    sx?: SxProps<Theme>;
  }>
> = ({ sx, text, children }) => {
  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false);
  const handleClick = useCallback(() => {
    setOpen(true);
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => setOpen(true))
        .catch((err) => {
          console.error("Clipboard write failed", err);
          setOpenError(true);
        });
    } else {
      setOpenError(true);
    }
  }, [text]);
  return (
    <>
      <Box
        onClick={handleClick}
        aria-label="Copy to clipboard"
        sx={{
          display: "flex",
          alignItems: "start",
          cursor: "pointer",
          justifyContent: "center",
          ...sx,
        }}
      >
        {children}
        <CopyIcon sx={{ ml: 1 }} />
      </Box>

      <Snackbar
        open={open}
        onClose={() => setOpen(false)}
        autoHideDuration={2000}
        message="Copied to clipboard"
      />
      <Snackbar
        open={openError}
        ContentProps={{ sx: { backgroundColor: "red" } }}
        onClose={() => setOpenError(false)}
        autoHideDuration={2000}
        message="Unable to copy to clipboard"
      />
    </>
  );
};
