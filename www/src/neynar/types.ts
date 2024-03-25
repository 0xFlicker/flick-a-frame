export interface HttpResult<T> {
  result: T;
}

type Result<N extends string | number | symbol, T> = {
  [key in N]: T;
};

export interface UserInfo {
  fid: number;
  custodyAddress: string;
  username: string;
  displayName: string;
  pfp: {
    url: string;
  };
  profile: {
    bio: {
      text: string;
      mentionedProfiles: string[];
    };
  };
  followerCount: number;
  followingCount: number;
  verifications: string[];
  verifiedAddresses: {
    eth_addresses: `0x${string}`[];
    sol_addresses: string[];
  };
  activeStatus: boolean;
  viewerContext: {
    following: boolean;
    follower: boolean;
  };
}
export type UserResult = Result<"user", UserInfo>;
