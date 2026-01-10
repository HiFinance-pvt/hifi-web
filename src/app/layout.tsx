import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hi-Fi Financial Assistant",
  description: "Your AI-powered financial assistant for personal finance management",
  icons: {
    icon: "hifi_logo.png"
  },
  keywords: ["HiFi", "Financial", "Assistant", "AI", "Portfolio", "Personal Finance", "Multi-Agent"],
  openGraph: {
    title: "Hi-Fi Financial Assistant",
    description: "Your AI-powered financial assistant for personal finance management",
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
    description: "Your AI-powered financial assistant for personal finance management",
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
    <html lang="en" className="theme-dark" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('hifi-theme');
                  if (!theme) {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  document.documentElement.classList.remove('theme-dark', 'theme-light');
                  document.documentElement.classList.add('theme-' + theme);
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${plusJakarta.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
