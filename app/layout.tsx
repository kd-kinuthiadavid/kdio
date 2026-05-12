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

export const metadata: Metadata = {
  title: "David Kinuthia",
  description: "Design-led and user-centered product engineer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://cdn.seline.so/seline.js"
          data-token="27716046b4c7ce3"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${raleway.className} antialiased`}>
        <div className="flex flex-col justify-between h-screen">
          <div className="flex items-center justify-between p-5 md:px-14 md:py-16">
            <HeaderBrandNav />
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="md:hidden"
            >
              <MobileNav />
            </motion.div>
          </div>
          <div className="w-full p-5 md:px-14 md:py-16">
            <div className="flex w-full justify-center">{children}</div>
            <SpeedInsights />
            <Analytics />
          </div>
        </div>
      </body>
    </html>
  );
}
