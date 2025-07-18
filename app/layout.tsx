import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { MainSidebar } from "./components/MainSidebar";
import Providers from "./Providers";

const geistRoboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dashboard",
  description: "A simple dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistRoboto.variable} antialiased bg-background`}
      >
        <Providers>
        <div className="flex">
          <MainSidebar />
          <main className="flex-1">{children}</main>
        </div>
        </Providers>
      </body>
    </html>
  );
}
