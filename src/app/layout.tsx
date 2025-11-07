import type { Metadata, Viewport } from "next";
import { Comfortaa, Inter, Kalam } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const kalam = Kalam({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-kalam",
});

const comfortaa = Comfortaa({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-comfortaa",
});

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
      <body
        className={`${inter.variable} ${kalam.variable} ${comfortaa.variable} bg-base-bg text-base-text font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
