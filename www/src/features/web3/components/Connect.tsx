import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Button, { ButtonProps } from "@mui/material/Button";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { FC, useCallback, useState, MouseEvent } from "react";
import { WalletModal } from "./WalletModal";
import { ConnectedDropDownModal } from "./ConnectedDropDownModal";
import { useAuth } from "@/features/auth";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useWeb3 } from "../hooks";

const Connect: FC<{
  assetPrefix?: string;
  size?: ButtonProps["size"];
}> = ({ assetPrefix, size }) => {
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const { isAuthenticated, signIn, signOut, ensName, ensNameIsLoading } =
    useAuth();
  const [menuAnchorEl, setMenuAnchorEl] = useState<Element | null>(null);
  const { selectedAddress: address, reset } = useWeb3();
  const onClick = useCallback(() => {
    setIsConnectOpen(true);
  }, []);

  const handleDisconnect = useCallback(() => {
    signOut();
    reset();
    setMenuAnchorEl(null);
  }, [reset, signOut]);

  const onMenuClose = useCallback(() => {
    setMenuAnchorEl(null);
  }, []);
  const handleMenu = useCallback((event: MouseEvent) => {
    setMenuAnchorEl(event.currentTarget);
  }, []);

  const handleLogin = useCallback(() => {
    setMenuAnchorEl(null);
    signIn();
  }, [signIn]);
  const handleLogout = useCallback(() => {
    setMenuAnchorEl(null);
    signOut();
    reset();
  }, [signOut, reset]);
  const handleModalClose = useCallback(() => {
    setIsConnectOpen(false);
  }, []);

  return (
    <>
      {address ? (
        <Tooltip title={ensName ? ensName : address}>
          <Button
            startIcon={isAuthenticated ? <CheckCircleIcon /> : null}
            variant="outlined"
            size={size}
            sx={{
              m: "0.5rem",
            }}
            onClick={handleMenu}
          >
            {ensNameIsLoading ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "12rem",
                }}
              >
                <CircularProgress size={30} />
              </Box>
            ) : (
              <Typography
                component="span"
                sx={{
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  textTransform: "none",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  px: "1rem",
                  py: "0.5rem",
                  maxWidth: "12rem",
                }}
              >
                {ensName ? ensName : address}
              </Typography>
            )}
          </Button>
        </Tooltip>
      ) : (
        <Button onClick={onClick}>connect</Button>
      )}
      <WalletModal
        assetPrefix={assetPrefix}
        open={isConnectOpen}
        handleClose={handleModalClose}
      />
      <ConnectedDropDownModal
        anchorEl={menuAnchorEl}
        handleClose={onMenuClose}
        handleDisconnect={handleDisconnect}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
        isLoggedIn={isAuthenticated}
      />
    </>
  );
};

export { Connect };
