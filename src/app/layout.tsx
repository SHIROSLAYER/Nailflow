import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import PwaRegister from "./pwa-register";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  applicationName: "Nailflow",
  title: "Nailflow · Estúdio de Unhas",
  description:
    "Alongamento, gel e nail art com hora marcada. Reserve seu horário online em segundos.",
  appleWebApp: {
    capable: true,
    title: "Nailflow",
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#c16e7c",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // usa a área do notch/safe-area no iPhone
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${playfair.variable} ${inter.variable} antialiased`}
    >
      <body className="min-h-dvh bg-cream font-sans text-ink">
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
