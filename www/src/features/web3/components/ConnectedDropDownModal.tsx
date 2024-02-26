import { FC, useCallback, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Typography from "@mui/material/Typography";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import ProfileIcon from "@mui/icons-material/AccountCircle";
import CopyIcon from "@mui/icons-material/FileCopyOutlined";
import { AppLink } from "@/components/AppLink";
import { useAuth } from "@/features/auth";

interface IProps {
  anchorEl: Element | null;
  handleClose: () => void;
  handleDisconnect: () => void;
  handleLogin: () => void;
  handleLogout: () => void;
  isLoggedIn: boolean;
}

export const ConnectedDropDownModal: FC<IProps> = ({
  anchorEl,
  handleClose,
  handleDisconnect,
  handleLogin,
  handleLogout,
  isLoggedIn,
}) => {
  const { token } = useAuth();
  const [tokenCopied, setTokenCopied] = useState(false);
  const handleClick = useCallback(() => {
    if (token) {
      setTokenCopied(true);
      window.navigator.clipboard.writeText(token);
      setTimeout(() => {
        setTokenCopied(false);
      }, 2000);
    }
  }, [token]);
  const open = Boolean(anchorEl);
  return (
    <>
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
            {isLoggedIn ? (
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography textAlign="right">logout</Typography>}
                />
              </MenuItem>
            ) : (
              <MenuItem onClick={handleLogin}>
                <ListItemIcon>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography textAlign="right">login</Typography>}
                />
              </MenuItem>
            )}
            {isLoggedIn && (
              <MenuItem onClick={handleClick}>
                <ListItemIcon>
                  <CopyIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography textAlign="right">
                      {tokenCopied ? "token copied" : "copy token"}
                    </Typography>
                  }
                />
              </MenuItem>
            )}
            {!isLoggedIn && (
              <MenuItem onClick={handleDisconnect}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography textAlign="right">disconnect</Typography>
                  }
                />
              </MenuItem>
            )}
            {isLoggedIn && (
              <MenuItem component={AppLink} href="/profile">
                <ListItemIcon>
                  <ProfileIcon />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography textAlign="right">profile</Typography>}
                />
              </MenuItem>
            )}
          </MenuList>
        </Box>
      </Menu>
    </>
  );
};
