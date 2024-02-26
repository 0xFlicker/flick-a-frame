import { FC, forwardRef } from "react";
import {
  Backdrop,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  Typography,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import Fade from "@mui/material/Fade";

interface IProps {
  open: boolean;
  chainName: string;
  handleClose: () => void;
  handleChangeNetwork: () => void;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Fade in={props.appear} ref={ref} {...props} />;
});

export const WrongChainModal: FC<IProps> = ({
  open,
  chainName,
  handleClose,
  handleChangeNetwork,
}) => {
  return (
    <Dialog
      aria-labelledby="modal-wrong-chain-title"
      aria-describedby="modal-wrong-chain-description"
      open={open}
      TransitionComponent={Transition}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <DialogTitle id="modal-wrong-chain-title">Wrong chain</DialogTitle>
      <DialogContent>
        <Box sx={{ textAlign: "center" }}>
          <Typography id="modal-wrong-chain-description">
            {`Please connect your wallet to the ${chainName} network.`}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={handleClose}>
          cancel
        </Button>
        <Button color="primary" onClick={handleChangeNetwork}>
          switch network
        </Button>
      </DialogActions>
    </Dialog>
  );
};
