"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { itemVariants } from "@/app/motionVariants";
import { Badge } from "@/components/ui/badge";
import ServiceTags, { type ServiceTag } from "./ServiceTags";

export interface BuildContent {
  id: string;
  name: string;
  context: string;
  summary: string;
  techLine?: string;
  url?: string;
  status: "live" | "inProgress";
  statusLabel: string;
  services: ServiceTag[];
}

interface BuildItemProps {
  content: BuildContent;
  servicesLabel: string;
}

export default function BuildItem({ content, servicesLabel }: BuildItemProps) {
  const title = (
    <>
      <span className="font-semibold">{content.name}</span>
      <span className="font-medium text-muted-foreground">
        — <span className="italic">{content.context}</span>
      </span>
    </>
  );

  return (
    <motion.article
      variants={itemVariants}
      className="flex flex-col gap-y-3 rounded-lg border border-border bg-background/40 p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
        {content.url ? (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={content.url}
            className="flex min-w-0 flex-wrap items-baseline gap-x-1 gap-y-0.5"
          >
            {title}
            <ArrowUpRight
              size={18}
              className="shrink-0 self-center text-muted-foreground"
              aria-hidden
            />
          </a>
        ) : (
          <p className="flex min-w-0 flex-wrap items-baseline gap-x-1 gap-y-0.5">
            {title}
          </p>
        )}
        <Badge variant={content.status === "live" ? "default" : "secondary"}>
          {content.statusLabel}
        </Badge>
      </div>
      <p className="leading-relaxed text-foreground/85">{content.summary}</p>
      {content.techLine && (
        <p className="text-sm font-medium text-muted-foreground">
          {content.techLine}
        </p>
      )}
      <ServiceTags label={servicesLabel} services={content.services} />
    </motion.article>
  );
}
