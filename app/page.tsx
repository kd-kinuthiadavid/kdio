"use client";
import { motion } from "framer-motion";

import AnimatedButton from "@/components/shared/AnimatedButton";
import ContentSurface from "@/components/shared/ContentSurface";
import {
  containerVariants,
  itemVariants,
  navItemVariants,
} from "./motionVariants";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <ContentSurface className="w-full min-w-0 max-w-[min(100%,clamp(20rem,88vw,56rem))]">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex flex-col gap-y-5 sm:gap-y-6 md:gap-y-8"
      >
        <motion.h1
          variants={itemVariants}
          className="text-balance font-semibold text-3xl capitalize leading-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
        >
          Crafting Scalable Solutions Where Engineering Meets Empathy.
        </motion.h1>
        <motion.p
          variants={navItemVariants}
          className="max-w-prose font-normal text-base leading-relaxed sm:text-lg md:text-xl"
        >
          Hello, my name is David Kinuthia. I am a product software engineer
          based in Nairobi. I blend technical expertise and user empathy to
          build products that are reliable, intuitive, and meaningful—
          delivering exceptional experiences from backend to interface.
        </motion.p>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-4 sm:gap-y-3 md:flex-nowrap"
        >
          <AnimatedButton
            motionVariants={navItemVariants}
            variant={"default"}
            className="w-full text-base font-medium capitalize py-5 sm:min-w-[12rem] sm:flex-1 md:py-6"
            onClick={() =>
              window.open("https://cal.com/kinuthiadavid/15min", "_blank")
            }
          >
            Book a 15-min Intro
          </AnimatedButton>
          <AnimatedButton
            motionVariants={navItemVariants}
            variant={"outline"}
            className="w-full text-base font-medium capitalize py-5 sm:min-w-[12rem] sm:flex-1 md:py-6"
            onClick={() => router.push("/work")}
          >
            see selected work
          </AnimatedButton>
        </motion.div>
      </motion.div>
    </ContentSurface>
  );
}
