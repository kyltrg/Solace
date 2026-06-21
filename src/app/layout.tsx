import type { Metadata, Viewport } from "next";

import "./globals.css";

import {
  Playfair_Display,
  Inter,
  Dancing_Script,
  Poppins,
} from "next/font/google";

import ClientShell from "@/components/layout/ClientShell";

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
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/layout/SmoothScroll";

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
  manifest: "/manifest.json?t=4",
  icons: {
    icon: "/assets/logo/icon.png",
    apple: "/assets/logo/icon.png",
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
        <link rel="preload" href="/assets/logo/icon-splashed.webp" as="image" />
        <ThemeProvider>
          <MusicProvider>
            <PresenceProvider>
            <SmoothScroll>
            <PageTransition />
            <ClientShell />
            <InactivityTimer />
            <InactivityScheduler />
            {children}
            <Footer />
            </SmoothScroll>
            <PresenceNotification />
            <NotificationPrompt />
            <PushSetup />
            </PresenceProvider>
            <HiddenPlayer />
            <MusicPlayer />
          </MusicProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
