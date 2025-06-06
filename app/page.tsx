"use client";
import { motion } from "framer-motion";

import AnimatedButton from "@/components/shared/AnimatedButton";
import {
  containerVariants,
  itemVariants,
  navItemVariants,
} from "./motionVariants";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col gap-y-6 md:max-w-[60%] 2xl:max-w-[40%]"
    >
      <motion.h1
        variants={itemVariants}
        className="font-semibold text-4xl md:text-5xl capitalize"
      >
        Crafting Scalable Solutions Where Engineering Meets Empathy.
      </motion.h1>
      <motion.p
        variants={navItemVariants}
        className={`font-normal text-lg md:text-xl md:max-w-[95%]`}
      >
        Hello, my name is David Kinuthia. I am a product software engineer based
        in Nairobi. I blend technical expertise and user empathy to build
        products that are reliable, intuitive, and meaningful— delivering
        exceptional experiences from backend to interface.
      </motion.p>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex flex-wrap md:flex-nowrap gap-x-5 gap-y-2.5"
      >
        <AnimatedButton
          motionVariants={navItemVariants}
          variant={"default"}
          className="w-full text-base font-medium capitalize py-6"
          onClick={() =>
            window.open("https://cal.com/kinuthiadavid/15min", "_blank")
          }
        >
          Let&apos;s build together
        </AnimatedButton>
        <AnimatedButton
          motionVariants={navItemVariants}
          variant={"outline"}
          className="w-full text-base font-medium capitalize py-6"
          onClick={() => router.push("/work")}
        >
          Explore my work
        </AnimatedButton>
      </motion.div>
    </motion.div>
  );
}
