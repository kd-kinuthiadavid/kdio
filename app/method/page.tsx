"use client";

import * as motion from "framer-motion/client";
import {
  containerVariants,
  itemVariants,
  navItemVariants,
} from "../motionVariants";
import MethodItemsList from "./_components/MethodItemsList";
import AnimatedButton from "@/components/shared/AnimatedButton";
import ContentSurface from "@/components/shared/ContentSurface";

const methodContent = [
  {
    title: "user-centric",
    subTitle: "Design for the user, build for the impact.",
    description:
      "I believe that truly impactful products solve real-world issues in ways that feel intuitive and natural. By embedding myself in the user’s journey, I ensure that my technical solutions translate into meaningful experiences. I seek to work with teams that prioritize empathy and care deeply about the people using their product.",
    idx: 0,
  },
  {
    title: "Quality",
    subTitle: "Yes, ship fast - but don't ship junk.",
    description:
      "While moving fast is important, I believe quality should never be sacrificed for speed. I aim for a level of craftsmanship that results in reliable, scalable, and elegant solutions. My goal is to create products that stand the test of time, not just meet deadlines. I want to collaborate with teams that share a passion for getting the details right.",
    idx: 1,
  },
  {
    title: "Collaboration",
    subTitle: "The best products come from diverse minds working together.",
    description:
      "I thrive in cross-functional environments where engineers, designers, and product teams come together to build something greater than the sum of its parts. I am seeking opportunities where collaborative problem-solving and shared-ownership are encouraged and prioritized.",
    idx: 2,
  },
  {
    title: "Iteration",
    subTitle: "Perfection is found in iteration, not in a single release.",
    description:
      "Great products are born through cycles of learning, iterating, and refining. I’m a strong advocate for building MVPs that allow for quick feedback and continuous improvement. I look for partners who value feedback, understand the importance of iteration, and embrace continuous learning.",
    idx: 3,
  },
  {
    title: "Simplicity",
    subTitle: "Simple is powerful.",
    description:
      "In both software architecture and user experience, simplicity is key. I believe that the most elegant solutions are often the simplest, and that complexity should only be introduced where it provides genuine value. I’m looking for teams that appreciate the value of simplicity and strive for clarity in both code and design.",
    idx: 4,
  },
  {
    title: "Human-Centered AI",
    subTitle: "Design intelligent systems that enhance the human experience.",
    description:
      "I believe that the role of AI should be to optimize the world for humans. I'm inspired by ethical leaders in technology like Tristan Harris and Aza Raskin. I’m looking for teams that prioritize human-centered design and development, and that are committed to using AI to enhance the user experience.",
    idx: 5,
  },
];

/* eslint-disable react/no-unescaped-entities */
export default function Method() {
  return (
    <ContentSurface className="w-full md:max-w-[60%]">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex flex-col gap-y-12 w-full"
      >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex flex-col gap-y-6"
      >
        <motion.h1
          variants={itemVariants}
          className="font-semibold text-4xl md:text-5xl capitalize"
        >
          Method
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="font-normal text-base md:text-lg"
        >
          I believe that software can still, and perhaps should still, feel
          magical. Therefore, my approach to product development is guided by a
          set of foundational principles rooted in craftsmanship, quality and
          design-thinking. These principles are:
        </motion.p>
      </motion.div>
      <MethodItemsList methodContent={methodContent} />

      <motion.p
        variants={itemVariants}
        className="font-normal text-base md:text-lg lg:max-w-[70%]"
      >
        If you share these values, then we're already on the same page and we
        should definitely connect and discuss how we can create something
        beautiful and impactful together.{" "}
      </motion.p>
      <AnimatedButton
        motionVariants={navItemVariants}
        variant={"default"}
        className="w-full text-base font-medium capitalize py-6"
        onClick={() =>
          window.open("https://cal.com/kinuthiadavid/15min", "_blank")
        }
      >
        Book a 15-min Intro
      </AnimatedButton>
      </motion.div>
    </ContentSurface>
  );
}
