import { HubHttpUrlOptions } from "frames.js";

export const baseUrl = process.env.NEXT_PUBLIC_HOST || "http://localhost:3000";
export const neynarApiKey = process.env.NEYNAR_API_KEY || "";
export const viewerFid = Number(process.env.NEXT_PUBLIC_VIEWER_FID || "6097");
export const hubOptions: HubHttpUrlOptions = {
  ...(neynarApiKey
    ? {
        hubHttpUrl: "https://hub-api.neynar.com",
        hubRequestOptions: {
          headers: {
            ["api_key"]: neynarApiKey,
          },
        },
      }
    : {}),
};
