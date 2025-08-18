"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import {
  containerVariants,
  itemVariants,
  navItemVariants,
} from "../motionVariants";
import AnimatedButton from "@/components/shared/AnimatedButton";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export default function About() {
  const router = useRouter();

  const MotionAccordionItem = motion.create(AccordionItem);
  const MotionAccordionTrigger = motion.create(AccordionTrigger);
  const MotionAccordionContent = motion.create(AccordionContent);
  const MotionBadge = motion.create(Badge);

  const expertiseList = [
    "Product & User Experience",
    "AI & Intelligent Systems",
    "UI.UX & Frontend Development",
    "Backend Development & APIs",
    "Systems Architecture & Scalability",
    "Product development & strategy",
    "agile & cross-functional leadership",
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col gap-y-4 w-full md:max-w-[50%]"
    >
      <motion.h1
        variants={itemVariants}
        className="font-semibold text-4xl md:text-5xl capitalize"
      >
        About
      </motion.h1>
      <Accordion
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        type="single"
        collapsible
        className="grid gap-6 grid-cols-1 w-full"
      >
        {/* who I am */}
        <MotionAccordionItem
          variants={navItemVariants}
          value={`about-david-kinuthia:who-i-am`}
          className={`px-4 border-b border-black/40`}
        >
          <MotionAccordionTrigger
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex items-start group data-[state=open]:visible"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="flex items-end gap-x-5"
            >
              <motion.p
                variants={itemVariants}
                className="text-base md:text-xl text-left font-normal capitalize text-accent-foreground"
              >
                01
              </motion.p>
              <motion.p
                variants={itemVariants}
                className="text-base md:text-lg text-left font-semibold capitalize"
              >
                Who I am
              </motion.p>
            </motion.div>
          </MotionAccordionTrigger>

          {/* content */}
          <MotionAccordionContent
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.p variants={itemVariants} className="text-lg mb-2">
              I’m a Product Software Engineer with 7+ years of full-stack
              experience, evolving from individual contributor to technical
              leader, driven by a passion for crafting elegant, scalable, and
              reliable systems that delight users
            </motion.p>
          </MotionAccordionContent>
        </MotionAccordionItem>

        {/* what I do */}
        <MotionAccordionItem
          variants={navItemVariants}
          value={`about-david-kinuthia:what-i-do`}
          className={`px-4 border-none`}
        >
          <MotionAccordionTrigger
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex items-start group data-[state=open]:visible"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="flex items-end gap-x-5"
            >
              <motion.p
                variants={itemVariants}
                className="text-base md:text-xl text-left font-normal capitalize text-accent-foreground"
              >
                02
              </motion.p>
              <motion.p
                variants={itemVariants}
                className="text-base md:text-lg text-left font-semibold capitalize"
              >
                What I do
              </motion.p>
            </motion.div>
          </MotionAccordionTrigger>

          {/* content */}
          <MotionAccordionContent
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-wrap gap-1.5"
          >
            {expertiseList.map((expertise, idx) => (
              <MotionBadge
                variants={navItemVariants}
                variant={"outline"}
                key={idx}
                className="rounded-2xl font-medium text-base capitalize"
              >
                {expertise}
              </MotionBadge>
            ))}
          </MotionAccordionContent>
        </MotionAccordionItem>
      </Accordion>
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
          Book a 15-min Intro
        </AnimatedButton>
        <AnimatedButton
          motionVariants={itemVariants}
          variant={"outline"}
          className="w-full text-base font-medium capitalize py-6"
          onClick={() => router.push("/method")}
        >
          See my approach
        </AnimatedButton>
      </motion.div>
    </motion.div>
  );
}
