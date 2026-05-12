"use client";

import { motion } from "framer-motion";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  containerVariants,
  itemVariants,
  navItemVariants,
} from "@/app/motionVariants";

export interface ServiceContent {
  id: string;
  name: string;
  persona: string;
  summary: string;
  included: string;
  includedLabel: string;
  upsells: string;
  tierMicro: string;
  tierMvp: string;
  tierEnterprise: string;
  idx: number;
  isLast: boolean;
}

interface ServiceItemProps {
  content: ServiceContent;
}

export default function ServiceItem({
  content: {
    id,
    name,
    persona,
    summary,
    included,
    includedLabel,
    upsells,
    tierMicro,
    tierMvp,
    tierEnterprise,
    idx,
    isLast,
  },
}: ServiceItemProps) {
  const MotionAccordionItem = motion.create(AccordionItem);
  const MotionAccordionTrigger = motion.create(AccordionTrigger);
  const MotionAccordionContent = motion.create(AccordionContent);

  return (
    <MotionAccordionItem
      variants={navItemVariants}
      value={id}
      className={`px-3 sm:px-4 ${isLast ? "border-none" : "border-b border-border"}`}
    >
      <MotionAccordionTrigger
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex w-full items-start group"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-1 items-start gap-x-5"
        >
          <motion.p
            variants={itemVariants}
            className="text-base md:text-xl text-left font-normal text-accent-foreground tabular-nums"
          >
            0{idx + 1}
          </motion.p>
          <motion.div
            variants={containerVariants}
            className="flex flex-col items-start gap-y-1"
          >
            <motion.p
              variants={itemVariants}
              className="text-base md:text-lg text-left font-semibold"
            >
              {name}
            </motion.p>
            <motion.p
              variants={itemVariants}
              className="text-sm md:text-base text-left font-normal text-muted-foreground group-data-[state=open]:hidden"
            >
              {persona}
            </motion.p>
          </motion.div>
        </motion.div>
      </MotionAccordionTrigger>
      <MotionAccordionContent
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          variants={containerVariants}
          className="flex flex-col gap-y-4 pl-0 sm:pl-9"
        >
          <motion.p
            variants={itemVariants}
            className="text-sm md:text-base font-medium text-muted-foreground"
          >
            {persona}
          </motion.p>
          <motion.p
            variants={itemVariants}
            className="text-base leading-relaxed"
          >
            {summary}
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-col gap-y-1">
            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {includedLabel}
            </p>
            <p className="text-base leading-relaxed">{included}</p>
          </motion.div>
          <motion.p
            variants={itemVariants}
            className="text-sm md:text-base italic text-muted-foreground leading-relaxed"
          >
            {upsells}
          </motion.p>
          <motion.div
            variants={containerVariants}
            className="flex flex-wrap items-center gap-2 pt-1"
          >
            <motion.div variants={navItemVariants}>
              <Badge variant="outline">{tierMicro}</Badge>
            </motion.div>
            <motion.div variants={navItemVariants}>
              <Badge variant="outline">{tierMvp}</Badge>
            </motion.div>
            <motion.div variants={navItemVariants}>
              <Badge variant="outline">{tierEnterprise}</Badge>
            </motion.div>
          </motion.div>
        </motion.div>
      </MotionAccordionContent>
    </MotionAccordionItem>
  );
}
