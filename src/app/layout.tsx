import type { Metadata, Viewport } from "next";
import "./globals.css";
import {
  comfortaa,
  cormorantGaramond,
  inter,
  jost,
  kalam,
} from "./fonts";

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
        url: "/assets/free-range-dev-logo-no-background.png",
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
    images: ["/assets/free-range-dev-logo-no-background.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#f9f8f3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${kalam.variable} ${comfortaa.variable} ${cormorantGaramond.variable} ${jost.variable} bg-base-bg text-base-text font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
