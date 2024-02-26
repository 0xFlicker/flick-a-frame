"use client";
import { DefaultProvider } from "@/context/default";
import { AppBar } from "@/components/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import NextImage from "next/image";
import { FC } from "react";
import { AppLink } from "@/components/AppLink";
import React from "react";

export const Home: FC<{}> = () => {
  return (
    <DefaultProvider>
      <AppBar
        left={
          <AppLink href="/">
            <NextImage
              alt="thinking face"
              src="/images/flick.png"
              height={64}
              width={64}
            />
          </AppLink>
        }
      />
      <AppLink
        href="/start/7d33db3a-8d0f-4fe0-a781-74d314953aae"
        underline="none"
        sx={{ textDecoration: "none" }}
      >
        <Container maxWidth="lg"></Container>
      </AppLink>
    </DefaultProvider>
  );
};
