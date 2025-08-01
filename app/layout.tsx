/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata, Viewport } from "next";
import { Inter, PT_Sans } from "next/font/google";
import { cookies } from "next/headers";

import TanstackProvider from "@/components/providers/tanstack-query-provider";
import "@/assets/globals.css";
import { Toaster } from "@/components/ui/sonner";
import MY_TOKEN_KEY from "@/lib/get-cookie-name";
import { apiServer } from "@/lib/api";
import AppContext from "@/components/contexts/app-context";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

const ptSans = PT_Sans({
  variable: "--font-ptSans-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Bond Media Studio | Build with AI ✨",
  description:
    "Bond Media Studio is a web development tool that helps you build websites with AI, no code required. Let's deploy your website with Bond Media Studio and enjoy the magic of AI.",
  openGraph: {
    title: "Bond Media Studio | Build with AI ✨",
    description:
      "Bond Media Studio is a web development tool that helps you build websites with AI, no code required. Let's deploy your website with Bond Media Studio and enjoy the magic of AI.",
    url: "https://bondmediastudio.com",
    siteName: "Bond Media Studio",
    images: [
      {
        url: "https://bondmediastudio.com/banner.png",
        width: 1200,
        height: 630,
        alt: "Bond Media Studio Open Graph Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bond Media Studio | Build with AI ✨",
    description:
      "Bond Media Studio is a web development tool that helps you build websites with AI, no code required. Let's deploy your website with Bond Media Studio and enjoy the magic of AI.",
    images: ["https://bondmediastudio.com/banner.png"],
  },
  appleWebApp: {
    capable: true,
    title: "Bond Media Studio",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};

async function getMe() {
  const cookieStore = await cookies();
  const token = cookieStore.get(MY_TOKEN_KEY())?.value;
  if (!token) return { user: null, errCode: null };
  try {
    const res = await apiServer.get("/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { user: res.data.user, errCode: null };
  } catch (err: any) {
    return { user: null, errCode: err.status };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await getMe();
  return (
    <html lang="en">
      <Script
        defer
        data-domain="bondmediastudio.com"
        src="https://plausible.io/js/script.js"
      ></Script>
      <body
        className={`${inter.variable} ${ptSans.variable} antialiased bg-black dark h-[100dvh] overflow-hidden`}
      >
        <Toaster richColors position="bottom-center" />
        <TanstackProvider>
          <AppContext me={data}>{children}</AppContext>
        </TanstackProvider>
      </body>
    </html>
  );
}
