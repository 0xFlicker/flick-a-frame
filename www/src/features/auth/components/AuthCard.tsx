import { FC } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import { useAuth } from "../hooks";


export const AuthCard: FC = () => {
  const { signIn, signOut, isAuthenticated, isAnonymous } = useAuth();
  return (
    <Card>
      <CardHeader
        title="User"
        subheader={isAuthenticated ? "logged in" : "logged out"}
      ></CardHeader>
      <CardContent>
        <Typography variant="body1">
          {isAuthenticated
            ? "Address verified"
            : "Address not verified, please login"}
        </Typography>
      </CardContent>
      <CardActions>
        {isAnonymous && (
          <Button variant="contained" color="primary" onClick={signIn}>
            login
          </Button>
        )}
        {isAuthenticated && (
          <>
            <Button variant="contained" color="primary" onClick={signOut}>
              logout
            </Button>
          </>
        )}
      </CardActions>
    </Card>
  );
};
