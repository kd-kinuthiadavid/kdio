import * as motion from "framer-motion/client";

import AnimatedButton from "@/components/shared/AnimatedButton";
import {
  containerVariants,
  itemVariants,
  navItemVariants,
} from "./motionVariants";

export default function Home() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col gap-y-6  max-w-[60%] 2xl:max-w-[40%]"
    >
      <motion.h1
        variants={itemVariants}
        className="font-semibold text-5xl capitalize"
      >
        Crafting Scalable Solutions Where Engineering Meets Empathy.
      </motion.h1>
      <motion.p
        variants={navItemVariants}
        className={`font-normal text-xl max-w-[95%]`}
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
        className="flex gap-x-5"
      >
        <AnimatedButton
          motionVariants={navItemVariants}
          variant={"default"}
          className="w-full text-base font-medium capitalize py-6"
        >
          Let&apos;s build together
        </AnimatedButton>
        <AnimatedButton
          motionVariants={navItemVariants}
          variant={"outline"}
          className="w-full text-base font-medium capitalize py-6"
        >
          Explore my work
        </AnimatedButton>
      </motion.div>
    </motion.div>
  );
}
