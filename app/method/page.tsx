import * as motion from "framer-motion/client";
import Link from "next/link";
import { containerVariants, itemVariants } from "../motionVariants";

const methodContent = [
  {
    title: "user-centric",
    subTitle: "Design for the user, build for the impact.",
    description:
      "I believe that truly impactful products solve real-world issues in ways that feel intuitive and natural. By embedding myself in the user’s journey, I ensure that my technical solutions translate into meaningful experiences. I seek to work with teams that prioritize empathy and care deeply about the people using their product.",
  },
  {
    title: "Quality",
    subTitle: "Yes, ship fast - but don't ship junk.",
    description:
      "While moving fast is important, I believe quality should never be sacrificed for speed. I aim for a level of craftsmanship that results in reliable, scalable, and elegant solutions. My goal is to create products that stand the test of time, not just meet deadlines. I want to collaborate with teams that share a passion for getting the details right.",
  },
  {
    title: "Collaboration",
    subTitle: "The best products come from diverse minds working together.",
    description:
      "I thrive in cross-functional environments where engineers, designers, and product teams come together to build something greater than the sum of its parts. I am seeking opportunities where collaborative problem-solving and shared-ownership are encouraged and prioritized.",
  },
  {
    title: "Iteration",
    subTitle: "Perfection is found in iteration, not in a single release.",
    description:
      "Great products are born through cycles of learning, iterating, and refining. I’m a strong advocate for building MVPs that allow for quick feedback and continuous improvement. I look for partners who value feedback, understand the importance of iteration, and embrace continuous learning.",
  },
  {
    title: "Simplicity",
    subTitle: "Simple is powerful.",
    description:
      "In both software architecture and user experience, simplicity is key. I believe that the most elegant solutions are often the simplest, and that complexity should only be introduced where it provides genuine value. I’m looking for teams that appreciate the value of simplicity and strive for clarity in both code and design.",
  },
  {
    title: "Human-Centered Intelligent Systems",
    subTitle:
      "Design intelligent systems that enhance the human experience - not exploit it.",
    description:
      "I believe that the role of AI should be to optimize the world for humans. I'm inspired by ethical leaders in technology like Tristan Harris and Aza Raskin. I’m looking for teams that prioritize human-centered design and development, and that are committed to using AI to enhance the user experience.",
  },
];

/* eslint-disable react/no-unescaped-entities */
export default function Method() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col gap-y-12 w-full max-w-[80%]"
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex flex-col gap-y-6"
      >
        <motion.h1
          variants={itemVariants}
          className="font-semibold text-5xl capitalize"
        >
          Method
        </motion.h1>
        <motion.p variants={itemVariants} className="font-normal text-lg">
          I believe that software can still, and perhaps should, feel magical.
          Therefore, in an attempt to achieve this, my approach to product
          development is guided by a set of foundational principles rooted in
          craftsmanship, quality and design-thinking:
        </motion.p>
      </motion.div>
      <div className="grid gap-6 grid-cols-3 grid-rows-2">
        {methodContent.map((content, idx) => (
          <div className="flex flex-col gap-2" key={idx}>
            <p className="text-xl font-semibold capitalize">{content.title}</p>
            <p className="text-base">
              <span className="font-semibold">{content.subTitle}</span>{" "}
              {content.description}
            </p>
          </div>
        ))}
      </div>

      <motion.p variants={itemVariants} className="font-normal text-lg">
        If you share these values, then we're already on the same page.{" "}
        <span className="font-medium">
          Let's create something beautifull and impactful together.
        </span>{" "}
        <Link
          href="/contact"
          className="underline underline-offset-4 cursor:pointer hover:font-semibold"
        >
          Let's connect.
        </Link>
      </motion.p>
    </motion.div>
  );
}
