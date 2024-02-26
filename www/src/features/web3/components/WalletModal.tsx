import { FC, useCallback } from "react";
import { Box, Button, Grid, Modal, Typography } from "@mui/material";
import Image from "next/image";
import { Fade } from "../transitions/Fade";
import { useConnect } from "wagmi";
import {
  isCoinbaseWalletConnector,
  isInjectedConnector,
  isMetamaskConnector,
  isWalletConnector,
  TAppConnectors,
} from "../wagmi";

interface IProps {
  assetPrefix?: string;
  open: boolean;
  handleClose: () => void;
}

export const WalletModal: FC<IProps> = ({ assetPrefix, open, handleClose }) => {
  const { connect, error, isLoading, connectors } = useConnect({
    onSettled: handleClose,
  });
  const handleMetamask = useCallback(() => {
    const connector = connectors.find((c) => {
      return isMetamaskConnector(c as TAppConnectors);
    });
    if (connector) {
      handleClose();
      connect({
        connector,
      });
    }
  }, [connect, connectors, handleClose]);

  const handleWalletConnect = useCallback(() => {
    const connector = connectors.find((c) => {
      return isWalletConnector(c as TAppConnectors);
    });
    if (connector) {
      handleClose();
      connect({
        connector,
      });
    }
  }, [connect, connectors, handleClose]);

  const handleCoinbaseConnect = useCallback(() => {
    const connector = connectors.find((c) => {
      return isCoinbaseWalletConnector(c as TAppConnectors);
    });
    if (connector) {
      handleClose();
      connect({
        connector,
      });
    }
  }, [connect, connectors, handleClose]);

  const handleFrameConnect = useCallback(() => {
    const connector = connectors.find((c) => {
      return isInjectedConnector(c as TAppConnectors);
    });
    if (connector) {
      handleClose();
      connect({
        connector,
      });
    }
  }, [connect, connectors, handleClose]);
  return (
    <Modal
      keepMounted
      aria-labelledby="modal-wallet-title"
      aria-describedby="modal-wallet-description"
      open={open}
      onClose={handleClose}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            id="modal-wallet-title"
            variant="h6"
            component="h2"
            color="text.primary"
          >
            Connect your wallet
          </Typography>
          <Typography
            id="modal-wallet-description"
            sx={{ mt: 2 }}
            color="text.secondary"
          >
            Pick from the following web wallets
          </Typography>
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ marginTop: "2rem" }}
          >
            <Grid item style={{ marginTop: "1rem", width: "100%" }}>
              <Button
                onClick={handleMetamask}
                variant="outlined"
                style={{
                  paddingTop: "16px",
                  paddingBottom: "16px",
                }}
                fullWidth
                startIcon={
                  <Image
                    alt=""
                    src={`${assetPrefix ?? ""}/images/wallets/metamask-fox.svg`}
                    width={25}
                    height={25}
                  />
                }
              >
                MetaMask
              </Button>
            </Grid>
            <Grid
              item
              style={{
                marginTop: "1rem",
                width: "100%",
              }}
            >
              <Button
                onClick={handleWalletConnect}
                variant="outlined"
                fullWidth
                style={{
                  paddingTop: "16px",
                  paddingBottom: "16px",
                }}
                startIcon={
                  <Image
                    alt=""
                    src={`${
                      assetPrefix ?? ""
                    }/images/wallets/walletconnect.svg`}
                    width={25}
                    height={25}
                  />
                }
              >
                WalletConnect
              </Button>
            </Grid>
            <Grid item style={{ marginTop: "1rem", width: "100%" }}>
              <Button
                onClick={handleCoinbaseConnect}
                variant="outlined"
                fullWidth
                style={{
                  paddingTop: "16px",
                  paddingBottom: "16px",
                }}
                startIcon={
                  <Image
                    alt=""
                    src={`${
                      assetPrefix ?? ""
                    }/images/wallets/coinbase_wallet.png`}
                    width={25}
                    height={25}
                  />
                }
              >
                Coinbase Wallet
              </Button>
            </Grid>
            <Grid item style={{ marginTop: "1rem", width: "100%" }}>
              <Button
                onClick={handleFrameConnect}
                variant="outlined"
                fullWidth
                style={{
                  paddingTop: "16px",
                  paddingBottom: "16px",
                }}
                startIcon={
                  <Image
                    alt=""
                    src={`${assetPrefix ?? ""}/images/wallets/FrameLogo512.png`}
                    width={25}
                    height={25}
                  />
                }
              >
                Injected
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Modal>
  );
};
