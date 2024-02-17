import type { Metadata } from "next";
import "../../globals.css";

export const metadata: Metadata = {
  title: "threadguy vibe",
  description: "vibe check",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
