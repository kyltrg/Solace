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

import { InactivityScheduler }
from "@/components/cron/InactivityScheduler";

import {
  PresenceProvider,
} from "@/components/presence/PresenceProvider";

import PresenceNotification
from "@/components/presence/PresenceNotification";
import NotificationPrompt
from "@/components/home/NotificationPrompt";
import PushSetup
from "@/components/home/PushSetup";

import {
  MusicProvider,
} from "@/components/music/MusicProvider";

import MusicPlayer
from "@/components/music/MusicPlayer";

import HiddenPlayer
from "@/components/music/HiddenPlayer";

import { ThemeProvider } from "@/context/ThemeContext";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Footer from "@/components/layout/Footer";

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
  manifest: "/manifest.json?v=4",
  icons: {
    icon: [
      { url: "/icon.svg?v=4", type: "image/svg+xml" },
      { url: "/icon-512.png?v=4", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.svg?v=4", type: "image/svg+xml" },
      { url: "/apple-icon.png?v=4", sizes: "180x180", type: "image/png" },
    ],
  },
  formatDetection: { telephone: false },
  appleWebApp: {
    title: "Solace",
    statusBarStyle: "black-translucent",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
  },
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
            <PresenceProvider>
            <PageTransition />
            <SolaceIsland />
            <InactivityTimer />
            <InactivityScheduler />
            {children}
            <Footer />
            <PresenceNotification />
            <NotificationPrompt />
            <PushSetup />
            </PresenceProvider>
            <HiddenPlayer />
            <MusicPlayer />
            <ThemeToggle />
          </MusicProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}