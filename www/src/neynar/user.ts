import { neynarApiKey, viewerFid } from "@/config";
import { HttpResult, UserResult } from "./types";

export async function fetchUserInfoByName(
  username: string
): Promise<HttpResult<UserResult>> {
  const params = new URLSearchParams();
  params.append("username", username);
  params.append("viewerFid", viewerFid.toString());

  const response = await fetch(
    `https://api.neynar.com/v1/farcaster/user-by-username?${params.toString()}`,
    {
      headers: {
        api_key: neynarApiKey,
      },
    }
  );
  return response.json();
}
