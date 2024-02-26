import { type CSSProperties, type FC, type PropsWithChildren } from "react";

export const ImageContainer: FC<
  PropsWithChildren<{
    rootStyleProps?: CSSProperties;
    innerLayoutStyleProps?: CSSProperties;
  }>
> = ({ children, rootStyleProps, innerLayoutStyleProps }) => {
  return (
    <div
      style={{
        display: "flex", // Use flex layout
        flexDirection: "row", // Align items horizontally
        alignItems: "stretch", // Stretch items to fill the container height
        width: "100%",
        height: "100vh", // Full viewport height
        backgroundColor: "white",
        ...rootStyleProps,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          lineHeight: 1.2,
          fontSize: 36,
          color: "black",
          flex: 1,
          overflow: "hidden",
          ...innerLayoutStyleProps,
        }}
      >
        {children}
      </div>
    </div>
  );
};
