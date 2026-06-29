import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "When Is Arsenal Playing Next?",
  description:
    "See Arsenal's next match, local kickoff time, live countdown, competition, venue, and upcoming fixtures.",
  openGraph: {
    title: "When Is Arsenal Playing Next?",
    description:
      "See Arsenal's next match, local kickoff time, live countdown, competition, venue, and upcoming fixtures.",
    type: "website",
    siteName: "Arsenal Countdown",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
