"use client";

import { motion } from "framer-motion";

import { Accordion } from "@/components/ui/accordion";
import MethodItem, { type Content } from "./MethodItem";
import { containerVariants } from "@/app/motionVariants";

interface MethodItemsListProps {
  methodContent: Content[];
}

export default function MethodItemsList({
  methodContent,
}: MethodItemsListProps) {
  const MotionAccordion = motion(Accordion);
  return (
    <MotionAccordion
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      type="single"
      collapsible
      className="grid gap-6 grid-cols-2"
    >
      {methodContent.map((content, idx) => (
        <MethodItem content={content} key={idx} />
      ))}
    </MotionAccordion>
  );
}
