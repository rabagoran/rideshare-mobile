import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RideShare",
  description: "RideShare për AAB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sq">
      <body>{children}</body>
    </html>
  );
}