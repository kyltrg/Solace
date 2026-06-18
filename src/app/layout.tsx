import type { Metadata, Viewport } from "next";

import "./globals.css";

import {
  Playfair_Display,
  Inter,
  Dancing_Script,
  Poppins,
} from "next/font/google";

import SolaceIsland
from "@/components/navigation/SolaceIsland";

import PageTransition
from "@/components/navigation/PageTransition";

import { InactivityTimer }
from "@/components/auth/InactivityTimer";

import {
  MusicProvider,
} from "@/components/music/MusicProvider";

import MusicPlayer
from "@/components/music/MusicPlayer";

import HiddenPlayer
from "@/components/music/HiddenPlayer";

import { ThemeProvider } from "@/context/ThemeContext";
import ThemeToggle from "@/components/ui/ThemeToggle";

const display =
Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  style: ["normal", "italic"],
});

const body =
Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
});

const handwritten =
Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-hand",
});

const poppins =
Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "SOLACE",
  description: "A digital home for Kyle & Angel",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({
  children,
}: RootLayoutProps)
: React.JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning data-theme="dark">
      <body
        className={`
          ${display.variable}
          ${body.variable}
          ${handwritten.variable}
          ${poppins.variable}
        `}
      >
        <ThemeProvider>
          <MusicProvider>
            <PageTransition />
            <SolaceIsland />
            <InactivityTimer />
            {children}
            <HiddenPlayer />
            <MusicPlayer />
            <ThemeToggle />
          </MusicProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}