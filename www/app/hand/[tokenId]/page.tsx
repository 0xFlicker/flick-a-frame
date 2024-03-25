import {
  FrameButton,
  FrameContainer,
  FrameImage,
  NextServerPageProps,
  getPreviousFrame,
  useFramesReducer,
  getFrameMessage,
} from "frames.js/next/server";
import {
  createPublicClient,
  http,
  erc20Abi,
  formatUnits,
  isAddress,
} from "viem";
import { base } from "viem/chains";
import { hubOptions } from "@/config";
import { getBuiltGraphSDK } from "@/graphclient";

enum EFlow {
  START,
  PAPER_HAND,
  DIAMOND_HAND,
  NO_TOKEN,
  ERROR,
}

type State = {
  error?: string;
  step: EFlow;
};

const initialState = { step: EFlow.START };
const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.BASE_RPC, {
    batch: true,
  }),
});

// This is a react server component only
export default async function Home({
  params,
  searchParams,
}: {
  params: { tokenId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const tokenId = params.tokenId;
  if (!isAddress(tokenId)) {
    throw new Error("Invalid token id");
  }
  const previousFrame = getPreviousFrame<State>(searchParams);

  const frameMessage = await getFrameMessage(previousFrame.postBody, {
    ...hubOptions,
  });
  console.log("info: frame message is:", frameMessage, previousFrame.prevState);
  if (frameMessage && !frameMessage?.isValid) {
    console.warn("Invalid frame payload");
    throw new Error("Invalid frame payload");
  }
  let tokenGain = 0;
  let tokenSold = 0n;
  let tokenName = "DEGEN";
  let tokenBalance = 0n;
  let tokenSymbol = "";
  let tokenGainIfHeld = 0;
  let tokenDecimals = 18;
  let isError = false;
  let currentPrice = 0;
  try {
    const sdk = getBuiltGraphSDK();
    const allAddresses = [
      frameMessage?.requesterCustodyAddress,
      ...(frameMessage?.requesterVerifiedAddresses ?? []),
    ].filter((address) => address && isAddress(address));
    const [tokenBalances, decimals, tokenDetails, ...responses] =
      await Promise.all([
        Promise.all(
          allAddresses.map((address) =>
            publicClient.readContract({
              abi: erc20Abi,
              address: tokenId,
              functionName: "balanceOf",
              args: [address as `0x${string}`],
            })
          ) ?? []
        ),
        publicClient.readContract({
          abi: erc20Abi,
          address: tokenId,
          functionName: "decimals",
        }),
        sdk.TokenPrice({
          token: tokenId,
        }),
        ...(allAddresses.map((address) =>
          sdk.Swaps({
            account: address!,
            token: tokenId,
          })
        ) ?? []),
      ]);
    // Tally up current pnl

    currentPrice = tokenDetails.token?.lastPriceUSD
      ? Number(tokenDetails.token?.lastPriceUSD)
      : 0;
    tokenName = tokenDetails.token?.name ?? "Token";
    tokenSymbol = tokenDetails.token?.symbol ?? "SYM";

    for (const response of responses) {
      for (const swapIn of response.swapsIn) {
        console.log("info: swap in is:", swapIn);
        tokenSold += BigInt(swapIn.amountIn.toString());
        tokenGain += Number(swapIn.amountInUSD.toString());
      }
    }
    tokenGainIfHeld += Number(formatUnits(tokenSold, decimals)) * currentPrice;
    tokenBalance = tokenBalances.reduce((acc, balance) => acc + balance, 0n);
    tokenDecimals = Number(decimals);
  } catch (e) {
    console.error("failed", e);
    isError = true;
  }

  const [state, dispatch] = useFramesReducer<State>(
    (state, action) => {
      console.log("info: previous state is:", state);
      if (state.step === EFlow.START) {
        if (isError) {
          return {
            error: "Failed to fetch token data. Please try again later.",
            step: EFlow.ERROR,
          };
        }

        if (tokenGainIfHeld > tokenGain) {
          return {
            step: EFlow.PAPER_HAND,
          };
        }
        if (tokenBalance > 0n) {
          return {
            step: EFlow.DIAMOND_HAND,
          };
        }
        return {
          step: EFlow.NO_TOKEN,
        };
      }
      return {
        step: EFlow.START,
      };
    },
    initialState,
    previousFrame
  );
  console.log("info: current state is:", state);
  // then, when done, return next frame
  return (
    <div className="p-4">
      nothing to see here
      {(async () => {
        switch (state.step) {
          case EFlow.START: {
            return (
              <FrameContainer
                pathname={`/hand/${tokenId}`}
                postUrl="/frames"
                state={state}
                previousFrame={previousFrame}
              >
                <FrameImage aspectRatio="1:1">
                  <div
                    tw="w-full h-full bg-slate-700 text-white justify-center items-center"
                    style={{
                      fontSize: "80",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <p>{tokenName}</p>
                    <p>paper hand</p>
                    <p>or</p>
                    <p>diamond hand?</p>
                  </div>
                </FrameImage>
                <FrameButton>SHOW ME</FrameButton>
              </FrameContainer>
            );
          }
          case EFlow.PAPER_HAND:
            return (
              <FrameContainer
                pathname={`/hand/${tokenId}`}
                postUrl="/frames"
                state={state}
                previousFrame={previousFrame}
              >
                <FrameImage aspectRatio="1:1">
                  <div
                    tw="w-full h-full bg-slate-700 text-white justify-center items-center"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      fontSize: "48",
                    }}
                  >
                    {tokenGainIfHeld > tokenGain && (
                      <p
                        style={{
                          fontSize: "220px",
                        }}
                      >
                        🫵😹
                      </p>
                    )}
                    <p>{`you sold ${Number(formatUnits(tokenSold, tokenDecimals)).toFixed(0)} $${tokenSymbol}`}</p>
                    <p>{`for $${tokenGain.toFixed(2)}`}</p>
                    <p>{`if held today would be worth $${Number(tokenGainIfHeld).toFixed(2)}`}</p>
                  </div>
                </FrameImage>
              </FrameContainer>
            );

          case EFlow.DIAMOND_HAND:
            const value =
              currentPrice * Number(formatUnits(tokenBalance, tokenDecimals));
            const [winningValue, worthNow] =
              tokenGain > tokenGainIfHeld
                ? [tokenGain, tokenGainIfHeld]
                : [null, null];
            return (
              <FrameContainer
                pathname={`/hand/${tokenId}`}
                postUrl="/frames"
                state={state}
                previousFrame={previousFrame}
              >
                <FrameImage aspectRatio="1:1">
                  <div
                    tw="w-full h-full bg-slate-700 text-white justify-center items-center"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      fontSize: "48",
                    }}
                  >
                    {!(winningValue && worthNow) && (
                      <p
                        style={{
                          fontSize: "220px",
                        }}
                      >
                        💎🙌
                      </p>
                    )}
                    {winningValue && worthNow && (
                      <>
                        <p
                          style={{
                            fontSize: "220px",
                          }}
                        >
                          👑
                        </p>
                        <p>{`you sold ${Number(formatUnits(tokenSold, tokenDecimals)).toFixed(0)} $${tokenSymbol}`}</p>
                        <p>{`for $${winningValue.toFixed(2)}`}</p>
                        <p>{`if held today would be worth $${tokenGainIfHeld.toFixed(2)}`}</p>
                      </>
                    )}
                    <p>{`you have ${Number(formatUnits(tokenBalance, tokenDecimals)).toFixed(0)} $${tokenSymbol}`}</p>
                    <p>{`worth $${value.toFixed(2)}`}</p>
                  </div>
                </FrameImage>
              </FrameContainer>
            );

          case EFlow.NO_TOKEN:
            return (
              <FrameContainer
                pathname={`/hand/${tokenId}`}
                postUrl="/frames"
                state={state}
                previousFrame={previousFrame}
              >
                <FrameImage aspectRatio="1:1">
                  <div
                    tw="w-full h-full bg-slate-700 text-white justify-center items-center"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      fontSize: "48",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "220px",
                      }}
                    >
                      🦧🤲
                    </p>
                    <p>{`You have no $${tokenSymbol}`}</p>
                  </div>
                </FrameImage>
              </FrameContainer>
            );
          default:
            return null;
        }
      })()}
    </div>
  );
}
