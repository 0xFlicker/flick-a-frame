import { loadFont } from "@/fonts";
import { baseUrl } from "@/config";
import { ImageResponse } from "@vercel/og";
import { FC } from "react";
import { type NextRequest } from "next/server";
import { ImageContainer } from "@/frames/imageContainer";

enum FontSize {
  Small = 24,
  Medium = 32,
  Large = 48,
}

const NoVibe: FC<{
  message: string;
}> = ({ message }) => {
  return (
    <ImageContainer
      rootStyleProps={{
        backgroundColor: "slate-700",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",

          fontSize: "256px",
          fontFamily: "Roboto",
          fontWeight: 400,
        }}
      >
        {message}
      </div>
    </ImageContainer>
  );
};

const MessageText: FC<{
  backgroundSrc: string;
  message: string;
  textColor: string;
}> = ({ backgroundSrc, message, textColor }) => {
  return (
    <ImageContainer>
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: "slate-700",
          justifyContent: "center",
          backgroundImage: `url('${backgroundSrc}')`,
          backgroundSize: "100% 100%",
          color: textColor,
          fontSize: FontSize.Large,
          fontFamily: "Roboto",
          fontWeight: 400,
        }}
      >
        <p>{message}</p>
      </div>
    </ImageContainer>
  );
};

enum EType {
  NO_VIBES = "NO_VIBES",
  JACK = "JACK",
  MIKE = "MIKE",
}

function asType(typeStr: string | null): EType {
  switch (typeStr?.toUpperCase()) {
    case "NO_VIBES":
      return EType.NO_VIBES;
    case "JACK":
      return EType.JACK;
    case "MIKE":
      return EType.MIKE;
    default:
      return EType.NO_VIBES;
  }
}

function typeToImgSrc(type: EType): string | null {
  switch (type) {
    case EType.JACK:
      return `${baseUrl}/images/jack.png`;
    case EType.MIKE:
      return `${baseUrl}/images/mike.png`;
    default:
      return null;
  }
}

function typeToMessage(type: EType, name: string): string {
  switch (type) {
    case EType.JACK:
      return `${name} voted over`;
    case EType.MIKE:
      return `${name} voted under`;
    default:
      return "🫵😹";
  }
}

function typeToTextColor(type: EType): string | null {
  switch (type) {
    case EType.JACK:
      return "white";
    case EType.MIKE:
      return "black";
    default:
      return null;
  }
}

export async function GET(req: NextRequest) {
  // const [roboto] = await Promise.all([loadFont("Roboto-Regular.ttf")]);
  const searchParams = req.nextUrl.searchParams;
  const type = asType(searchParams.get("type"));
  const name = searchParams.get("name");
  const backgroundSrc = typeToImgSrc(type);
  const message = typeToMessage(type, name ?? "🫵😹");
  return new ImageResponse(
    backgroundSrc ? (
      <MessageText
        backgroundSrc={backgroundSrc}
        message={message}
        textColor={typeToTextColor(type) ?? "white"}
      />
    ) : (
      <NoVibe message={message} />
    ),
    {
      width: 1100,
      height: 1100,
      // fonts: [
      //   {
      //     name: "Roboto",
      //     data: roboto,
      //     weight: 400,
      //     style: "normal",
      //   },
      // ],
    }
  );
}

export const dynamic = "force-dynamic";
export const revalidate = 30;
