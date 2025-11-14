import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hi-Fi Financial Assistant",
  description: "Your AI-powered financial assistant",
  icons: {
    icon: "hifi_logo.png"
  },
  keywords: ["HiFi", "Financial", "Assistant", "AI", "Portfolio"],
  openGraph: {
    title: "Hi-Fi Financial Assistant",
    description: "Your AI-powered financial assistant",
    url: "https://web.hifi.click",
    siteName: "Hi-Fi Financial Assistant",
    images: [
      {
        url: "hifi_logo.png",
        width: 1200,
        height: 630,
        alt: "Hi-Fi Financial Assistant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hi-Fi Financial Assistant",
    description: "Your AI-powered financial assistant",
    images: ["hifi_logo.png"],
  },
  metadataBase: new URL("https://web.hifi.click"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
