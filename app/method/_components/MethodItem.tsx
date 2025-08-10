"use client";

import { motion } from "framer-motion";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  containerVariants,
  itemVariants,
  navItemVariants,
} from "@/app/motionVariants";

export interface Content {
  title: string;
  subTitle: string;
  description: string;
  idx: number;
}

interface MethodItemProps {
  content: Content;
}

export default function MethodItem({
  content: { title, subTitle, description, idx },
}: MethodItemProps) {
  const MotionAccordionItem = motion.create(AccordionItem);
  const MotionAccordionTrigger = motion.create(AccordionTrigger);
  const MotionAccordionContent = motion.create(AccordionContent);
  return (
    <MotionAccordionItem
      variants={navItemVariants}
      value={`${title}-${subTitle}`}
      className={`px-4 ${idx === 5 ? "border-none" : "border-b border-black/40"}`}
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
          className="flex items-start flex-col"
        >
          <motion.div
            variants={containerVariants}
            className="flex items-end gap-x-5"
          >
            <motion.p
              variants={itemVariants}
              className="text-base md:text-xl text-left font-normal capitalize text-accent-foreground"
            >
              0{idx + 1}
            </motion.p>
            {/* title and subtitle */}
            <motion.div
              variants={containerVariants}
              className="flex flex-col items-start"
            >
              <motion.p
                variants={itemVariants}
                className="text-base md:text-lg text-left font-semibold capitalize"
              >
                {title}
              </motion.p>
              <motion.p
                variants={itemVariants}
                className="text-base text-left font-normal capitalize group-data-[state=open]:hidden"
              >
                {subTitle}
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>
      </MotionAccordionTrigger>
      <MotionAccordionContent
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.p variants={itemVariants} className="text-base mb-2">
          <motion.span variants={navItemVariants} className="font-semibold">
            {subTitle}
          </motion.span>{" "}
          {description}
        </motion.p>
      </MotionAccordionContent>
    </MotionAccordionItem>
  );
}
