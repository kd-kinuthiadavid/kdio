"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { containerVariants, navItemVariants } from "@/app/motionVariants";

type Role = { position: string; dates: string };

export interface TimelineItem {
  id: string;
  company: string;
  dates: string;
  url: string;
  position?: string;
  roles?: Role[];
}

interface CareerTimelineProps {
  items: TimelineItem[];
}

export default function CareerTimeline({ items }: CareerTimelineProps) {
  return (
    <motion.div variants={containerVariants} className="flex flex-col gap-y-3">
      {items.map((item) => (
        <motion.div
          key={item.id}
          variants={navItemVariants}
          className="flex min-w-0 flex-wrap gap-x-4 gap-y-1 text-base sm:gap-x-6 md:flex-nowrap md:items-start"
        >
          <p className="w-full shrink-0 font-medium text-muted-foreground tabular-nums sm:w-auto sm:min-w-[11rem] md:min-w-[12rem]">
            {item.dates}
          </p>
          <div className="flex min-w-0 flex-col">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={item.url}
              className="flex min-w-0 items-start gap-x-1"
            >
              <p className="font-semibold">
                {item.roles ? item.company : item.position}
              </p>
              <ArrowUpRight
                size={20}
                className="shrink-0 text-muted-foreground"
                aria-hidden
              />
            </a>
            {!item.roles && (
              <p className="font-medium text-muted-foreground">
                {item.company}
              </p>
            )}
            {item.roles && (
              <ul className="mt-2 flex flex-col gap-y-1.5 border-l border-border pl-4">
                {item.roles.map((role) => (
                  <li
                    key={role.position}
                    className="flex min-w-0 flex-wrap items-baseline gap-x-4 text-sm sm:text-base"
                  >
                    <span className="shrink-0 font-medium text-muted-foreground tabular-nums sm:min-w-[11rem]">
                      {role.dates}
                    </span>
                    <span className="font-medium">{role.position}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
