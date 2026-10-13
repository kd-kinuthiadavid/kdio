"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import {
  containerVariants,
  itemVariants,
  navItemVariants,
} from "@/app/motionVariants";
import ServiceTags, { type ServiceTag } from "./ServiceTags";

export interface CaseBody {
  id: string;
  title: string;
  problem: string;
  approach: string;
  result: string;
  services: ServiceTag[];
}

export interface CaseEntry {
  id: string;
  company: string;
  url: string;
  meta: string;
  dates: string;
  context: string;
  cases: CaseBody[];
}

export interface CaseLabels {
  problem: string;
  approach: string;
  result: string;
  services: string;
}

interface CaseStudyProps {
  entry: CaseEntry;
  labels: CaseLabels;
}

export default function CaseStudy({ entry, labels }: CaseStudyProps) {
  const isGroup = entry.cases.length > 1;

  return (
    <motion.article
      variants={itemVariants}
      className="flex flex-col gap-y-5 border-t border-border pt-6 sm:pt-8"
    >
      <motion.header
        variants={containerVariants}
        className="flex flex-col gap-y-1.5"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={entry.url}
            className="flex min-w-0 items-start gap-x-1 text-lg font-semibold sm:text-xl"
          >
            {entry.company}
            <ArrowUpRight
              size={20}
              className="shrink-0 text-muted-foreground"
              aria-hidden
            />
          </a>
          <p className="text-sm font-medium text-muted-foreground tabular-nums sm:text-base">
            {entry.dates}
          </p>
        </div>
        <p className="font-medium text-accent-foreground">{entry.meta}</p>
        <p className="max-w-prose leading-relaxed text-muted-foreground">
          {entry.context}
        </p>
      </motion.header>

      <motion.div
        variants={containerVariants}
        className={`flex flex-col gap-y-6 ${isGroup ? "border-l border-border pl-4 sm:pl-6" : ""}`}
      >
        {entry.cases.map((body) => (
          <motion.div
            key={body.id}
            variants={navItemVariants}
            className="flex flex-col gap-y-3"
          >
            <h3 className="font-semibold text-base sm:text-lg">{body.title}</h3>
            <dl className="flex flex-col gap-y-2.5">
              {(
                [
                  ["problem", body.problem],
                  ["approach", body.approach],
                  ["result", body.result],
                ] as const
              ).map(([field, value]) => (
                <div key={field} className="flex flex-col gap-y-0.5">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {labels[field]}
                  </dt>
                  <dd className="max-w-prose leading-relaxed text-foreground/85">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
            <ServiceTags label={labels.services} services={body.services} />
          </motion.div>
        ))}
      </motion.div>
    </motion.article>
  );
}
