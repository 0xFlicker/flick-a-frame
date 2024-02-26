import { FC, ReactNode } from "react";
import Grid2 from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";

export const Field: FC<{
  label: ReactNode | string;
  value: ReactNode | string;
}> = ({ label, value }) => {
  return (
    <Grid2
      container
      width="100%"
      sx={{
        ml: 2,
      }}
      alignItems="center"
    >
      <Grid2 xs={12} md={2} alignItems="center">
        {typeof label === "string" ? (
          <Typography variant="body1" gutterBottom fontWeight="bold">
            {label}
          </Typography>
        ) : (
          label
        )}
      </Grid2>
      <Grid2
        xs={12}
        md={8}
        alignItems="center"
        sx={{
          ml: {
            xs: 2,
          },
        }}
      >
        {typeof value === "string" ? (
          <Typography variant="body1" gutterBottom>
            {value}
          </Typography>
        ) : (
          value
        )}
      </Grid2>
    </Grid2>
  );
};
