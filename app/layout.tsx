import type { Metadata } from "next";
import Script from "next/script";
import * as motion from "framer-motion/client";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";
import { raleway } from "./fonts";
import { containerVariants } from "./motionVariants";
import HeaderBrandNav from "@/components/shared/HeaderBrandNav";
import MobileNav from "@/components/shared/MobileNav";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "David Kinuthia",
  description: "Design-led and user-centered product engineer",
};

const gutterX = "px-[clamp(1rem,0.55rem+3.2vw,3.5rem)]";
const gutterY = "py-[clamp(1rem,0.65rem+2.2vh,4rem)]";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://cdn.seline.so/seline.js"
          data-token="27716046b4c7ce3"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${raleway.className} antialiased`}>
        <ThemeProvider>
          <div className="relative z-10 flex min-h-screen flex-col">
            <header
              className={`flex shrink-0 items-center justify-between gap-3 ${gutterX} ${gutterY}`}
            >
              <HeaderBrandNav />
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="shrink-0 md:hidden"
              >
                <MobileNav />
              </motion.div>
            </header>
            <main
              className={`flex flex-1 flex-col justify-end overflow-x-hidden overflow-y-auto ${gutterX} pb-[clamp(1.25rem,1rem+3vh,4rem)] pt-2 sm:pt-4 min-h-0`}
            >
              <div className="flex w-full min-w-0 justify-center">
                {children}
              </div>
              <SpeedInsights />
              <Analytics />
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
