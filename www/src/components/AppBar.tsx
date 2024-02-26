import { FC, ReactNode } from "react";
import { AppBar as MuiAppBar, Toolbar, Box } from "@mui/material";

export const AppBar: FC<{
  left?: ReactNode;
  right?: ReactNode;
}> = ({ left, right }) => {
  return (
    <>
      <MuiAppBar color="default">
        <Toolbar>
          {left}
          <Box sx={{ flexGrow: 1 }} component="span" />
          {right}
        </Toolbar>
      </MuiAppBar>
    </>
  );
};
