import { HubHttpUrlOptions } from "frames.js";

export const baseUrl = process.env.NEXT_PUBLIC_HOST || "http://localhost:3000";
export const neynarApiKey = process.env.NEYNAR_API_KEY || "";
export const hubOptions: HubHttpUrlOptions = {
  hubHttpUrl: "https://hub-api.neynar.com",
  hubRequestOptions: {
    headers: {
      ["api_key"]: neynarApiKey,
    },
  },
};
