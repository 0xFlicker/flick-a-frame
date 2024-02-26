/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
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

type State = {};

const initialState = { active: "1", total_button_presses: 0 };

const reducer: FrameReducer<State> = (state, action) => {
  return {};
};

export default async function Home({
  params,
  searchParams,
}: NextServerPageProps) {
  const publicClient = createPublicClient({
    chain: base,
    transport: http(),
  });
  const baseUrl = process.env.NEXT_PUBLIC_HOST || "http://localhost:3000";
  const previousFrame = getPreviousFrame<{}>(searchParams);

  const frameMessage = await getFrameMessage(previousFrame.postBody, {
    ...hubOptions,
  });

  if (frameMessage && !frameMessage?.isValid) {
    console.log({
      ...hubOptions,
    });
    throw new Error("Invalid frame payload");
  }
  const [state, dispatch] = useFramesReducer<{}>(
    reducer,
    initialState,
    previousFrame
  );
  try {
    const tokens = frameMessage
      ? (
          await Promise.all(
            frameMessage?.requesterVerifiedAddresses.map((address) =>
              publicClient.readContract({
                address: tge1Address,
                abi: tge1Abi,
                functionName: "tokensOfOwner",
                args: [address as `0x${string}`],
              })
            )
          )
        ).flat()
      : [];

    const votedNo = await Promise.all(
      tokens.map((token) =>
        publicClient.readContract({
          address: tge1Address,
          abi: tge1Abi,
          functionName: "votedNo",
          args: [token],
        })
      )
    );
    const isOwned = tokens.length > 0;
    const isSad = votedNo.some((voted) => voted === true);

    // then, when done, return next frame
    return (
      <div className="p-4">
        look at this on farcaster silly
        {isOwned && !isSad ? (
          <FrameContainer
            pathname="/threadguy"
            postUrl="/frames"
            state={state}
            previousFrame={previousFrame}
          >
            <FrameImage
              aspectRatio="1:1"
              src={`${baseUrl}/frames/image/threadguy/experimint?name=${encodeURIComponent(frameMessage?.requesterUserData?.displayName ?? "")}&type=JACK`}
            />
            <FrameButton
              target="https://opensea.io/collection/tg-experimints"
              action="link"
            >
              IT&apos;S A VIBE
            </FrameButton>
          </FrameContainer>
        ) : undefined}
        {isOwned && isSad ? (
          <FrameContainer
            pathname="/threadguy"
            postUrl="/frames"
            state={state}
            previousFrame={previousFrame}
          >
            <FrameImage
              aspectRatio="1:1"
              src={`${baseUrl}/frames/image/threadguy/experimint?name=${encodeURIComponent(frameMessage?.requesterUserData?.displayName ?? "")}&type=MIKE`}
            />
            <FrameButton
              target="https://opensea.io/collection/tg-experimints"
              action="link"
            >
              IT&apos;S A VIBE
            </FrameButton>
          </FrameContainer>
        ) : undefined}
        {!isOwned ? (
          <FrameContainer
            pathname="/threadguy"
            postUrl="/frames"
            state={state}
            previousFrame={previousFrame}
          >
            <FrameImage
              aspectRatio="1:1"
              src={`${baseUrl}/frames/image/threadguy/experimint?type=NO_VIBES`}
            />
            <FrameButton
              target="https://opensea.io/collection/tg-experimints"
              action="link"
            >
              GET A VIBE
            </FrameButton>
          </FrameContainer>
        ) : undefined}
      </div>
    );
  } catch (e) {
    console.error(e);
    return (
      <FrameContainer
        postUrl="/threadguy"
        state={state}
        previousFrame={previousFrame}
      >
        <FrameImage>
          <div tw="w-full h-full bg-slate-700 text-white justify-center items-center">
            error
          </div>
        </FrameImage>
        <FrameButton>VIBE CHECK ME</FrameButton>
      </FrameContainer>
    );
  }
}
