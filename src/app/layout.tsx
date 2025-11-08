import type { Metadata, Viewport } from "next";
import "./globals.css";
import { comfortaa, inter, kalam } from "./fonts";

const PRELOAD_FONTS = [
  "/fonts/Inter-Regular.ttf",
  "/fonts/Inter-SemiBold.ttf",
  "/fonts/Inter-Bold.ttf",
  "/fonts/Kalam-Regular.ttf",
  "/fonts/Kalam-Bold.ttf",
  "/fonts/Comfortaa-Regular.ttf",
  "/fonts/Comfortaa-SemiBold.ttf",
  "/fonts/Comfortaa-Bold.ttf",
];

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {PRELOAD_FONTS.map((href) => (
          <link
            key={href}
            rel="preload"
            as="font"
            type="font/ttf"
            href={href}
            crossOrigin="anonymous"
          />
        ))}
      </head>
      <body
        className={`${inter.variable} ${kalam.variable} ${comfortaa.variable} bg-base-bg text-base-text font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
