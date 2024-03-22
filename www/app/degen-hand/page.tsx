import {
  FrameButton,
  FrameContainer,
  FrameImage,
  NextServerPageProps,
  getPreviousFrame,
  useFramesReducer,
  getFrameMessage,
} from "frames.js/next/server";
import { createPublicClient, http, erc20Abi, formatUnits } from "viem";
import { base } from "viem/chains";
import { hubOptions } from "@/config";
import { getBuiltGraphSDK } from "@/graphclient";

enum EFlow {
  START,
  TOKEN_CHECK,
  PAPER_HAND,
  DIAMOND_HAND,
  NO_TOKEN,
  ERROR,
}

type State = {
  error?: string;
  step: EFlow;
};

const DEGEN = "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed";
const initialState = { step: EFlow.START };
const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

// This is a react server component only
export default async function Home({
  params,
  searchParams,
}: NextServerPageProps) {
  const previousFrame = getPreviousFrame<State>(searchParams);

  const frameMessage = await getFrameMessage(previousFrame.postBody, {
    ...hubOptions,
  });
  console.log("info: frame message is:", frameMessage, previousFrame.prevState);
  if (frameMessage && !frameMessage?.isValid) {
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
  if (previousFrame.prevState?.step === EFlow.TOKEN_CHECK) {
    try {
      const sdk = getBuiltGraphSDK();
      const [tokenBalances, decimals, tokenDetails, ...responses] =
        await Promise.all([
          Promise.all(
            frameMessage?.requesterVerifiedAddresses.map((address) =>
              publicClient.readContract({
                abi: erc20Abi,
                address: DEGEN,
                functionName: "balanceOf",
                args: [address as `0x${string}`],
              })
            ) ?? []
          ),
          publicClient.readContract({
            abi: erc20Abi,
            address: DEGEN,
            functionName: "decimals",
          }),
          sdk.TokenPrice({
            token: DEGEN,
          }),
          ...(frameMessage?.requesterVerifiedAddresses.map((address) =>
            sdk.Swaps({
              account: address,
              token: DEGEN,
            })
          ) ?? []),
        ]);

      // Tally up current pnl

      const currentPrice = tokenDetails.token?.lastPriceUSD ?? 0;
      tokenName = tokenDetails.token?.name ?? "DEGEN";
      tokenSymbol = tokenDetails.token?.symbol ?? "DEGEN";
      for (const response of responses) {
        for (const swapIn of response.swapsIn) {
          tokenSold += BigInt(swapIn.amountIn.toString());
          tokenGain += Number(swapIn.amountInUSD.toString());
        }
      }
      tokenGainIfHeld +=
        Number(formatUnits(tokenSold, decimals)) * Number(currentPrice);
      tokenBalance = tokenBalances.reduce((acc, balance) => acc + balance, 0n);
      tokenDecimals = Number(decimals);
    } catch (e) {
      console.error(e);
      isError = true;
    }
  }

  const [state, dispatch] = useFramesReducer<State>(
    (state, action) => {
      console.log("info: previous state is:", state);
      if (state.step === EFlow.START) {
        return {
          step: EFlow.TOKEN_CHECK,
        };
      }
      if (state.step === EFlow.TOKEN_CHECK) {
        if (isError) {
          return {
            error: "Failed to fetch token data. Please try again later.",
            step: EFlow.ERROR,
          };
        }

        if (tokenGain > 0n) {
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
                pathname="/degen-hand"
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
                pathname="/degen-hand"
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
                    {tokenGainIfHeld > tokenSold && (
                      <p
                        style={{
                          fontSize: "220px",
                        }}
                      >
                        🫵😹
                      </p>
                    )}
                    <p>{`You sold ${Number(tokenSold)} $${tokenSymbol}`}</p>
                    <p>{`for $${tokenGain.toFixed(2)}}`}</p>
                    <p>{`if held today would be worth $${Number(tokenGainIfHeld).toFixed(2)}`}</p>
                  </div>
                </FrameImage>
              </FrameContainer>
            );

          case EFlow.DIAMOND_HAND:
            return (
              <FrameContainer
                pathname="/degen-hand"
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
                      💎🙌
                    </p>
                    <p>{`You have ${formatUnits(tokenBalance, tokenDecimals)} $${tokenSymbol}`}</p>
                    <p>{`worth $${Number(tokenGainIfHeld).toFixed(2)}`}</p>
                  </div>
                </FrameImage>
              </FrameContainer>
            );

          case EFlow.NO_TOKEN:
            return (
              <FrameContainer
                pathname="/degen-hand"
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
