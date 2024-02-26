import React from "react";
import { FC, PropsWithChildren } from "react";
import CssBaseline from "@mui/material/CssBaseline";
// import { Provider as ApolloProvider } from "@/graphql/Provider";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/theme";

export const DefaultProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    // <ApolloProvider>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
    // </ApolloProvider>
  );
};
