import * as motion from "framer-motion/client";

import AnimatedButton from "@/components/shared/AnimatedButton";

export default function Home() {
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
        variants={itemVariants}
        className={`font-normal text-xl max-w-[95%]`}
      >
        Hello, my name is David Kinuthia. I am a product software engineer based
        in Nairobi. I blend technical expertise and user empathy to build
        products that are reliable, intuitive, and meaningful— delivering
        exceptional experiences from backend to interface.
      </motion.p>
      <motion.div variants={containerVariants} className="flex gap-x-5">
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
          Explore my work
        </AnimatedButton>
      </motion.div>
    </motion.div>
  );
}
