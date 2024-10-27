import * as motion from "framer-motion/client";

import { containerVariants, itemVariants } from "../motionVariants";
import AnimatedButton from "@/components/shared/AnimatedButton";

export default function About() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col gap-y-4 max-w-[70%] 2xl:max-w-[50%]"
    >
      <motion.h1
        variants={itemVariants}
        className="font-semibold text-5xl capitalize"
      >
        About
      </motion.h1>
      <motion.p variants={itemVariants} className={`font-normal text-lg`}>
        I’m a product software engineer with a passion for building solutions
        that balance technical excellence and human-centered design. My unique
        value lies in my ability to:
      </motion.p>
      <motion.ul
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="list-disc ml-8 text-lg space-y-2"
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
      <motion.p variants={itemVariants} className={`font-normal text-lg`}>
        I’m here to help you bridge the gap between engineering and user
        experience, ensuring your product doesn’t just work—but works
        beautifully for your users.
      </motion.p>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex gap-x-5"
      >
        <AnimatedButton
          motionVariants={itemVariants}
          variant={"default"}
          className="w-full text-base font-medium capitalize py-6"
        >
          Let&apos;s build together
        </AnimatedButton>
        <AnimatedButton
          motionVariants={itemVariants}
          variant={"outline"}
          className="w-full text-base font-medium capitalize py-6"
        >
          Explore my method
        </AnimatedButton>
      </motion.div>
    </motion.div>
  );
}
