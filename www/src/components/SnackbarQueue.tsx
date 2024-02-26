import { FC, useCallback, useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";

export const SnackbarQueue: FC<{
  receivePush: (push: (message: string) => void) => void;
}> = ({ receivePush }) => {
  const [openSnackbar, setSnackbarOpen] = useState(false);
  const [toastQueue, setToastQueue] = useState<string[]>([]);
  const toast = useCallback(
    (message: string) => {
      if (message === undefined) return;
      setToastQueue([...toastQueue, message]);
      setSnackbarOpen(true);
    },
    [toastQueue]
  );
  const onClose = useCallback(() => {
    setSnackbarOpen(false);
    setToastQueue(toastQueue.slice(1));
  }, [toastQueue]);
  useEffect(() => {
    receivePush(toast);
  }, [receivePush, toast]);
  useEffect(() => {
    if (toastQueue.length > 0 && !openSnackbar) {
      setSnackbarOpen(true);
    }
  }, [toastQueue, openSnackbar]);

  return (
    <Snackbar
      open={openSnackbar}
      onClose={onClose}
      autoHideDuration={2000}
      message={toastQueue.length > 0 ? toastQueue[0] : undefined}
    />
  );
};
