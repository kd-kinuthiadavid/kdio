import type { Metadata } from "next";
import * as motion from "framer-motion/client";

import "./globals.css";
import { raleway } from "./fonts";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/shared/navigation";

export const metadata: Metadata = {
  title: "David Kinuthia",
  description: "Design-led and user-centered product engineer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

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
