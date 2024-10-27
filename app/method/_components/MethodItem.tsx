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
}

interface MethodItemProps {
  content: Content;
}

export default function MethodItem({
  content: { title, subTitle, description },
}: MethodItemProps) {
  const MotionAccordionItem = motion(AccordionItem);
  const MotionAccordionTrigger = motion(AccordionTrigger);
  const MotionAccordionContent = motion(AccordionContent);
  return (
    <MotionAccordionItem
      variants={navItemVariants}
      value={`${title}-${subTitle}`}
      className="border border-black/40 px-4 rounded-md hover:bg-foreground/5"
    >
      <MotionAccordionTrigger
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        showIcon={false}
        className="flex items-start group data-[state=open]:visible"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex items-start flex-col"
        >
          <motion.p
            variants={itemVariants}
            className="text-xl text-left font-semibold capitalize"
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
      </MotionAccordionTrigger>
      <MotionAccordionContent
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.p variants={itemVariants} className="text-base">
          <motion.span variants={navItemVariants} className="font-semibold">
            {subTitle}
          </motion.span>{" "}
          {description}
        </motion.p>
      </MotionAccordionContent>
    </MotionAccordionItem>
  );
}
