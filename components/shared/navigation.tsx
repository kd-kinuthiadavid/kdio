"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { containerVariants, navItemVariants } from "@/app/motionVariants";

export default function Navigation() {
  const pathname = usePathname();

  const MotionLink = motion.create(Link);

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="hidden md:flex flex-col gap-y-2"
    >
      <MotionLink
        variants={navItemVariants}
        prefetch={true}
        href="/"
        className={`capitalize font-medium hover:underline hover:underline-offset-4 hover:font-semibold active:underline active:underline-offset-4 active:font-semibold ${
          pathname === "/"
            ? "font-semibold underline underline-offset-4 text-accent-foreground decoration-accent-foreground"
            : ""
        }`}
      >
        intro
      </MotionLink>
      <MotionLink
        variants={navItemVariants}
        prefetch={true}
        href="/about"
        className={`capitalize font-medium hover:underline hover:underline-offset-4 hover:font-semibold active:underline active:underline-offset-4 active:font-semibold ${
          pathname === "/about"
            ? "font-semibold underline underline-offset-4 text-accent-foreground decoration-accent-foreground"
            : ""
        }`}
      >
        about
      </MotionLink>
      <MotionLink
        variants={navItemVariants}
        prefetch={true}
        href="/method"
        className={`capitalize font-medium hover:underline hover:underline-offset-4 hover:font-semibold active:underline active:underline-offset-4 active:font-semibold ${
          pathname === "/method"
            ? "font-semibold underline underline-offset-4 text-accent-foreground decoration-accent-foreground"
            : ""
        }`}
      >
        method
      </MotionLink>
      <MotionLink
        variants={navItemVariants}
        prefetch={true}
        href="/work"
        className={`capitalize font-medium hover:underline hover:underline-offset-4 hover:font-semibold active:underline active:underline-offset-4 active:font-semibold ${
          pathname === "/work"
            ? "font-semibold underline underline-offset-4 text-accent-foreground decoration-accent-foreground"
            : ""
        }`}
      >
        work
      </MotionLink>
      <MotionLink
        variants={navItemVariants}
        prefetch={true}
        href="/contact"
        className={`capitalize font-medium hover:underline hover:underline-offset-4 hover:font-semibold active:underline active:underline-offset-4 active:font-semibold ${
          pathname === "/contact"
            ? "font-semibold underline underline-offset-4 text-accent-foreground decoration-accent-foreground"
            : ""
        }`}
      >
        contact
      </MotionLink>
    </motion.nav>
  );
}
