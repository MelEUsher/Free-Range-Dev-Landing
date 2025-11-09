import localFont from "next/font/local";

export const inter = localFont({
  src: [
    {
      path: "../../public/fonts/Inter-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Inter-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Inter-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

export const kalam = localFont({
  src: [
    {
      path: "../../public/fonts/Kalam-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Kalam-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-kalam",
  display: "swap",
  preload: true,
});

export const comfortaa = localFont({
  src: [
    {
      path: "../../public/fonts/Comfortaa-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Comfortaa-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Comfortaa-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-comfortaa",
  display: "swap",
  preload: true,
});
