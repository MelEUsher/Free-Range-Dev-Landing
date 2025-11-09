import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { comfortaa, inter, kalam } from "./fonts";

export const metadata: Metadata = {
  metadataBase: new URL("https://thefreerangedev.com"),
  title: "The Free Range Dev",
  description: "Portfolio and brand hub for The Free Range Dev project",
  openGraph: {
    title: "The Free Range Dev",
    description: "Portfolio and brand hub for The Free Range Dev project",
    url: "https://thefreerangedev.com",
    siteName: "The Free Range Dev",
    images: [
      {
        url: "https://thefreerangedev.com/assets/freerange-logo.png",
        width: 1200,
        height: 630,
        alt: "The Free Range Dev logomark",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Free Range Dev",
    description: "Portfolio and brand hub for The Free Range Dev project",
    images: ["https://thefreerangedev.com/assets/freerange-logo.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#f9f8f3",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body
        data-csp-nonce={nonce ?? undefined}
        className={`${inter.variable} ${kalam.variable} ${comfortaa.variable} bg-base-bg text-base-text font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
