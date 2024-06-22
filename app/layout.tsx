import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Inter } from "next/font/google";

import "./globals.css";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import SessionProvider from "./(auth)/SessionProvider";
import Login from "./(auth)/Login";
import Home from "./page";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Parking Hub",
  description: "A Software Development 1 project by Team Wild Tech.",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light",
        url: "/logo.svg",
        href: "/logo.svg",
      },
      {
        media: "(prefers-color-scheme: dark",
        url: "/logo-dark.svg",
        href: "/logo-dark.svg",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          {!session ? <Login /> : <Home />}
        </SessionProvider>
      </body>
    </html>
  );
}
