import { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";

const inter = Inter({
  subsets: ["latin"],
});

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="parking-hub-theme"
        >
          <Toaster
            position="bottom-left"
            toastOptions={{
              unstyled: false,
              classNames: {
                closeButton: "bg-lime-400",
                loading: "bg-secondary text-primary border border-primary",
                success: "bg-secondary text-green-500 border border-green-500",
                error: "bg-secondary text-red-500 border border-red-500",
                warning:
                  "bg-secondary text-yellow-500 border border-yellow-500",
              },
            }}
          />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
