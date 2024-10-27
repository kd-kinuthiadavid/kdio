import type { Metadata } from "next";
import * as motion from "framer-motion/client";

import "./globals.css";
import { raleway } from "./fonts";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/shared/navigation";
import { containerVariants, itemVariants } from "./motionVariants";

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
      <body className={`${raleway.className} antialiased`}>
        <div className="flex flex-col justify-between h-screen px-14 py-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className={`flex flex-col`}
          >
            <motion.h2
              variants={itemVariants}
              className="text-2xl font-semibold"
            >
              David Kinuthia.
            </motion.h2>
            <Separator className="my-2 w-[3%] !h-[1.5px]" />
          </motion.div>
          <div className="flex items-center justify-between">
            {children}

            <Navigation />
          </div>
        </div>
      </body>
    </html>
  );
}
