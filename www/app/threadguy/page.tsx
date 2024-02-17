import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameReducer,
  NextServerPageProps,
  getPreviousFrame,
  useFramesReducer,
  getFrameMessage,
} from "frames.js/next/server";
import Link from "next/link";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { tge1Abi, tge1Address } from "@/wagmi/generated";
import { hubOptions } from "@/config";

enum EFlow {
  START,
  VIBE_CHECK,
}

type State = {
  step: EFlow;
};

const initialState = { step: EFlow.START };

const reducer: FrameReducer<State> = (state, action) => {
  console.log("info: previous state is:", state);
  if (state.step === EFlow.START) {
    return {
      step: EFlow.VIBE_CHECK,
    };
  }
  return {
    step: EFlow.START,
  };
};

// This is a react server component only
export default async function Home({
  params,
  searchParams,
}: NextServerPageProps) {
  const previousFrame = getPreviousFrame<State>(searchParams);

  const frameMessage = await getFrameMessage(previousFrame.postBody, {
    ...hubOptions,
  });

  if (frameMessage && !frameMessage?.isValid) {
    throw new Error("Invalid frame payload");
  }

  const [state, dispatch] = useFramesReducer<State>(
    reducer,
    initialState,
    previousFrame
  );

  const baseUrl = process.env.NEXT_PUBLIC_HOST || "http://localhost:3000";

  // then, when done, return next frame
  return (
    <div className="p-4">
      look at this on farcaster silly
      {(async () => {
        switch (state.step) {
          case EFlow.START: {
            return (
              <FrameContainer
                pathname="/threadguy/vibe"
                postUrl="/frames"
                state={state}
                previousFrame={previousFrame}
              >
                <FrameImage aspectRatio="1:1">
                  <div
                    tw="w-full h-full bg-slate-700 text-white justify-center items-center"
                    style={{
                      fontSize: "80",
                    }}
                  >
                    Threadguy vibecheck
                  </div>
                </FrameImage>
                <FrameButton>VIBE CHECK ME</FrameButton>
              </FrameContainer>
            );
          }
          case EFlow.VIBE_CHECK:
            const publicClient = createPublicClient({
              chain: base,
              transport: http(),
            });
            const balances = frameMessage
              ? await Promise.all(
                  frameMessage?.requesterVerifiedAddresses.map((address) =>
                    publicClient.readContract({
                      address: tge1Address,
                      abi: tge1Abi,
                      functionName: "balanceOf",
                      args: [address as `0x${string}`],
                    })
                  )
                )
              : [];

            const isOwned = balances.some((balance) => balance > 0);
            console.log("Balances", balances);
            console.log("postBody", previousFrame.postBody);
            if (isOwned) {
              return (
                <FrameContainer
                  pathname="/threadguy"
                  postUrl="/frames"
                  state={state}
                  previousFrame={previousFrame}
                >
                  <FrameImage>
                    <div tw="w-full h-full bg-slate-700 text-white justify-center items-center">
                      Passed the vibe check (you own a TGE1 token)
                    </div>
                  </FrameImage>
                  <FrameButton>VIBE CHECK ME</FrameButton>
                </FrameContainer>
              );
            }
            return (
              <FrameContainer
                pathname="/threadguy"
                postUrl="/frames"
                state={state}
                previousFrame={previousFrame}
              >
                <FrameImage aspectRatio="1:1">
                  <div
                    tw="w-full h-full bg-slate-700 text-white justify-center items-center"
                    style={{
                      fontSize: "350px",
                    }}
                  >
                    🫵😹
                  </div>
                </FrameImage>
                <FrameButton>VIBE CHECK ME</FrameButton>
              </FrameContainer>
            );
          default:
            return null;
        }
      })()}
    </div>
  );
}
