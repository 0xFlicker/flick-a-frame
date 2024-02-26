import { FC } from "react";
import { FormControlLabel, Switch } from "@mui/material";

export const DarkModeSwitch: FC<{
  isDarkMode: boolean;
}> = ({ isDarkMode }) => {
  return (
    <FormControlLabel
      onClick={(event) => event.preventDefault()}
      control={<Switch checked={isDarkMode} />}
      label={isDarkMode ? "Dark" : "Light"}
    />
  );
};
