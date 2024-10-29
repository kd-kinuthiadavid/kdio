"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { containerVariants, itemVariants } from "../motionVariants";
import AnimatedButton from "@/components/shared/AnimatedButton";

export default function About() {
  const router = useRouter();
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col gap-y-4 md:max-w-[70%] 2xl:max-w-[50%]"
    >
      <motion.h1
        variants={itemVariants}
        className="font-semibold text-4xl md:text-5xl capitalize"
      >
        About
      </motion.h1>
      <motion.p
        variants={itemVariants}
        className={`font-normal text-base md:text-lg`}
      >
        I’m a product software engineer with a passion for building solutions
        that balance technical excellence and human-centered design. My unique
        value lies in my ability to:
      </motion.p>
      <motion.ul
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="list-disc ml-8 text-base md:text-lg space-y-2"
      >
        <motion.li variants={itemVariants}>
          Translate complex technical challenges into easy-to-use, user-driven
          solutions.
        </motion.li>
        <motion.li variants={itemVariants}>
          Ensure consistency between the product vision and the final user
          experience, from backend architecture to front-end design.
        </motion.li>
        <motion.li variants={itemVariants}>
          Collaborate effectively with product managers, designers, and
          cross-functional teams to deliver impactful, scalable products.
        </motion.li>
      </motion.ul>
      <motion.p
        variants={itemVariants}
        className={`font-normal text-base md:text-lg`}
      >
        I’m here to help you bridge the gap between engineering and user
        experience, ensuring your product doesn’t just work—but works
        beautifully for your users.
      </motion.p>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex flex-wrap md:flex-nowrap gap-x-5 gap-y-2.5"
      >
        <AnimatedButton
          motionVariants={itemVariants}
          variant={"default"}
          className="w-full text-base font-medium capitalize py-6"
          onClick={() =>
            window.open("https://cal.com/kinuthiadavid/15min", "_blank")
          }
        >
          Let&apos;s build together
        </AnimatedButton>
        <AnimatedButton
          motionVariants={itemVariants}
          variant={"outline"}
          className="w-full text-base font-medium capitalize py-6"
          onClick={() => router.push("/method")}
        >
          Explore my method
        </AnimatedButton>
      </motion.div>
    </motion.div>
  );
}
