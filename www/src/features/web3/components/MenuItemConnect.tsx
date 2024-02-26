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
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import { EthereumIcon } from "@/components/EthereumIcon";
import ListItemText from "@mui/material/ListItemText";
import { ListItemSecondaryAction } from "@mui/material";
import { ChainSelector } from "./ChainSelector";

const CHAIN_SELECTOR_TOOLTIP_PROPS = {
  enterDelay: 5000,
  enterNextDelay: 5000,
};

export const MenuItemConnect: FC<{
  assetPrefix?: string;
}> = ({ assetPrefix }) => {
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const {
    isAuthenticated,
    isAnonymous,
    signIn,
    signOut,
    ensName,
    ensNameIsLoading,
  } = useAuth();
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
        <MenuItem
          // startIcon={isAuthenticated ? <CheckCircleIcon /> : null}
          // variant="outlined"
          onClick={handleMenu}
        >
          <ListItemIcon>
            <EthereumIcon />
          </ListItemIcon>
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
            <ListItemText
              primary={
                <Typography textAlign="right" noWrap>
                  {ensName ? ensName : address}
                </Typography>
              }
            />
          )}
          <Tooltip
            title={
              <>
                {isAuthenticated ? (
                  <Typography>address signature verified</Typography>
                ) : (
                  <>
                    <Typography>unverified address</Typography>
                    <Typography>complete sign in with ethereum</Typography>
                    <Typography>(SIWE) login to verify address</Typography>
                  </>
                )}
              </>
            }
          >
            <CheckCircleIcon
              color={isAuthenticated ? "success" : "secondary"}
              sx={{
                ml: 2,
              }}
            />
          </Tooltip>
          <ChainSelector
            sx={{ ml: 1 }}
            tooltipProps={CHAIN_SELECTOR_TOOLTIP_PROPS}
          />
        </MenuItem>
      ) : (
        <MenuItem onClick={onClick}>
          <ListItemIcon>
            <EthereumIcon />
          </ListItemIcon>
          <ListItemText
            primary={<Typography textAlign="right">connect</Typography>}
          />
          <Tooltip
            title={
              <>
                <Typography>not connected</Typography>
              </>
            }
          >
            <CheckCircleIcon
              color="disabled"
              sx={{
                ml: 2,
              }}
            />
          </Tooltip>
          <ChainSelector
            sx={{
              ml: 1,
            }}
            tooltipProps={CHAIN_SELECTOR_TOOLTIP_PROPS}
          />
        </MenuItem>
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
