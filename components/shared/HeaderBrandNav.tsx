"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import {
  containerVariants,
  itemVariants,
  navItemVariants,
} from "@/app/motionVariants";
import AnimatedButton from "@/components/shared/AnimatedButton";
import Navigation from "@/components/shared/navigation";

export default function HeaderBrandNav() {
  const MotionLink = motion.create(Link);
  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex flex-row items-center gap-x-1"
      >
        <MotionLink
          variants={navItemVariants}
          prefetch={true}
          href="/"
          className="text-xl md:text-xl font-semibold"
        >
          David Kinuthia
        </MotionLink>
      </motion.div>
      <Navigation />
      <AnimatedButton
        motionVariants={navItemVariants}
        variant="default"
        className="text-base font-medium capitalize py-6"
        onClick={() =>
          window.open("https://cal.com/kinuthiadavid/15min", "_blank")
        }
      >
        Book a 15-min Intro
      </AnimatedButton>
    </>
  );
}
