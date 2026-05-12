"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import {
  containerVariants,
  navItemVariants,
} from "@/app/motionVariants";
import AnimatedButton from "@/components/shared/AnimatedButton";
import Navigation from "@/components/shared/navigation";

export default function HeaderBrandNav() {
  const MotionLink = motion.create(Link);
  return (
    <div className="flex min-w-0 flex-1 flex-row items-center justify-start gap-3 sm:gap-4 md:justify-between md:gap-6 lg:gap-10">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-w-0 shrink"
      >
        <MotionLink
          variants={navItemVariants}
          prefetch={true}
          href="/"
          className="block truncate text-lg font-semibold sm:text-xl"
        >
          David Kinuthia
        </MotionLink>
      </motion.div>
      <Navigation />
      <AnimatedButton
        motionVariants={navItemVariants}
        variant="default"
        className="hidden shrink-0 text-sm font-medium capitalize sm:text-base md:inline-flex md:py-5 lg:py-6"
        onClick={() =>
          window.open("https://cal.com/kinuthiadavid/15min", "_blank")
        }
      >
        Book a 15-min Intro
      </AnimatedButton>
    </div>
  );
}
