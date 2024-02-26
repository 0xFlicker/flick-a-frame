import { FC, useCallback, useState, MouseEvent } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Image from "next/image";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CircularProgress from "@mui/material/CircularProgress";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Typography from "@mui/material/Typography";
import CheckIcon from "@mui/icons-material/CheckCircle";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { decorateChainImageUrl, useWeb3 } from "../hooks";
import { Chain, useSwitchNetwork } from "wagmi";
import type { SxProps, TooltipProps } from "@mui/material";

export const ConnectedDropDownModal: FC<{
  anchorEl: Element | null;
  chains: Chain[];
  handleClose: () => void;
  handleSwitch: (chain: Chain) => void;
  currentChain?: Chain;
  assetPrefix?: string;
}> = ({
  anchorEl,
  assetPrefix,
  handleClose,
  handleSwitch,
  chains,
  currentChain,
}) => {
  const open = Boolean(anchorEl);
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      onClose={(event) => {
        (event as MouseEvent).stopPropagation();
        handleClose();
      }}
      keepMounted
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <Box sx={{ width: 320 }}>
        <MenuList disablePadding>
          {chains.map((chain) => (
            <MenuItem
              key={chain.id}
              onClick={(event) => {
                event.stopPropagation();
                handleSwitch(chain);
              }}
            >
              <ListItemIcon>
                {currentChain?.id === chain.id ? (
                  // large CheckIcon
                  <CheckIcon sx={{ fontSize: 40 }} />
                ) : (
                  <Image
                    src={`${assetPrefix ?? ""}${decorateChainImageUrl(chain)}`}
                    alt=""
                    width={40}
                    height={40}
                  />
                )}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography textAlign="right">{chain.name}</Typography>
                }
              />
            </MenuItem>
          ))}
        </MenuList>
      </Box>
    </Menu>
  );
};
export const ChainSelector: FC<{
  assetPrefix?: string;
  sx?: SxProps;
  tooltipProps?: Omit<TooltipProps, "title" | "children">;
}> = ({ assetPrefix, sx, tooltipProps }) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<Element | null>(null);

  const { currentChain: chain } = useWeb3();

  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();
  const handleMenu = useCallback((event: MouseEvent) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  }, []);
  const onMenuClose = useCallback(() => {
    setMenuAnchorEl(null);
  }, []);
  const handleSwitch = useCallback(
    (chain: Chain) => {
      onMenuClose();
      if (switchNetwork && chain?.id) {
        switchNetwork(chain.id);
      }
    },
    [onMenuClose, switchNetwork]
  );
  return (
    <>
      <Tooltip
        title={
          <>
            <Typography>switch networks</Typography>
            <Typography>{`current network: ${
              chain?.name ?? "unknown"
            }`}</Typography>
            {error && <Typography color="error">{error.message}</Typography>}
            {!chain && <Typography>try connecting first</Typography>}
          </>
        }
        {...tooltipProps}
      >
        <IconButton onClick={handleMenu} sx={{ ...sx }}>
          <Image
            src={`${assetPrefix ?? ""}${decorateChainImageUrl(chain)}`}
            alt=""
            width={40}
            height={40}
          />
          {isLoading && (
            <CircularProgress
              variant="indeterminate"
              sx={{
                width: 40,
                height: 40,
                position: "absolute",
              }}
            />
          )}
        </IconButton>
      </Tooltip>
      <ConnectedDropDownModal
        anchorEl={menuAnchorEl as any}
        assetPrefix={assetPrefix}
        handleClose={onMenuClose}
        handleSwitch={handleSwitch}
        chains={chains}
        currentChain={chain}
      />
    </>
  );
};
