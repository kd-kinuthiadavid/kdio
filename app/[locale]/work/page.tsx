"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useId, useRef, useState } from "react";

import ContentSurface from "@/components/shared/ContentSurface";
import {
  containerVariants,
  itemVariants,
  navItemVariants,
} from "../../motionVariants";

const PROJECT_IDS = ["invoicething"] as const;

const PROJECT_META: Record<
  (typeof PROJECT_IDS)[number],
  { url: string; year: string }
> = {
  invoicething: {
    url: "https://invoicething.co/",
    year: "2024",
  },
};

type WorkTab = "projects" | "experience";

const tabTriggerBase =
  "rounded-md px-3 py-2 text-base font-medium capitalize transition-colors outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:text-lg";

const tabTriggerInactive =
  "text-muted-foreground hover:text-accent-foreground hover:underline hover:underline-offset-4";

const tabTriggerActive =
  "text-accent-foreground underline underline-offset-4 font-semibold";

export default function Work() {
  const t = useTranslations("work");
  const tp = useTranslations("work.projects");
  const [tab, setTab] = useState<WorkTab>("projects");
  const baseId = useId();
  const projectsTabId = `${baseId}-tab-projects`;
  const experienceTabId = `${baseId}-tab-experience`;
  const projectsPanelId = `${baseId}-panel-projects`;
  const experiencePanelId = `${baseId}-panel-experience`;
  const projectsTabRef = useRef<HTMLButtonElement>(null);
  const experienceTabRef = useRef<HTMLButtonElement>(null);

  const MotionA = motion.create("a");

  const experience = [
    {
      company: "Churpy Inc",
      position: t("expChurpyPosition"),
      capacity: t("capacityFullTime"),
      timeStamp: t("expChurpyDates"),
      url: "https://www.churpy.co/",
    },
    {
      company: "ProductNotes",
      position: t("expProductNotesPosition"),
      capacity: t("capacityContract"),
      timeStamp: t("expProductNotesDates"),
      url: "https://www.product-notes.com/",
    },
    {
      company: "Apollo API",
      position: t("expApolloPosition"),
      capacity: t("capacityPartTime"),
      timeStamp: t("expApolloDates"),
      url: "https://www.apolloapi.io/",
    },
    {
      company: "Twende Mobility",
      position: t("expTwendePosition"),
      capacity: t("capacityFullTime"),
      timeStamp: t("expTwendeDates"),
      url: "https://www.linkedin.com/company/twendemobility/about/",
    },
  ];

  return (
    <ContentSurface className="w-full min-w-0 max-w-[min(100%,clamp(22rem,92vw,72rem))]">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex w-full flex-col gap-y-8 sm:gap-y-10 md:gap-y-12"
      >
        <motion.h1
          variants={itemVariants}
          className="text-balance font-semibold text-3xl leading-tight sm:text-4xl md:text-5xl"
        >
          {t("title")}
        </motion.h1>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex w-full flex-col gap-y-8 sm:gap-y-10"
        >
          <motion.div
            variants={itemVariants}
            role="tablist"
            aria-label={t("title")}
            className="flex flex-wrap gap-1 border-b border-border pb-px sm:gap-2"
          >
            <motion.button
              ref={projectsTabRef}
              type="button"
              role="tab"
              id={projectsTabId}
              aria-selected={tab === "projects"}
              aria-controls={projectsPanelId}
              tabIndex={tab === "projects" ? 0 : -1}
              variants={navItemVariants}
              className={`${tabTriggerBase} ${tab === "projects" ? tabTriggerActive : tabTriggerInactive}`}
              onClick={() => setTab("projects")}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                  e.preventDefault();
                  setTab("experience");
                  experienceTabRef.current?.focus();
                }
              }}
            >
              {tp("title")}
            </motion.button>
            <motion.button
              ref={experienceTabRef}
              type="button"
              role="tab"
              id={experienceTabId}
              aria-selected={tab === "experience"}
              aria-controls={experiencePanelId}
              tabIndex={tab === "experience" ? 0 : -1}
              variants={navItemVariants}
              className={`${tabTriggerBase} ${tab === "experience" ? tabTriggerActive : tabTriggerInactive}`}
              onClick={() => setTab("experience")}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                  e.preventDefault();
                  setTab("projects");
                  projectsTabRef.current?.focus();
                }
              }}
            >
              {t("experience")}
            </motion.button>
          </motion.div>

          <div
            id={projectsPanelId}
            role="tabpanel"
            aria-labelledby={projectsTabId}
            hidden={tab !== "projects"}
            className="min-w-0"
          >
            {tab === "projects" && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="flex w-full flex-col gap-y-3"
              >
                {PROJECT_IDS.map((id) => {
                  const meta = PROJECT_META[id];
                  const story = [
                    tp(`${id}.problem`),
                    tp(`${id}.solution`),
                    tp(`${id}.result`),
                  ].join(" ");

                  return (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={containerVariants}
                      className="flex min-w-0 flex-wrap gap-x-4 gap-y-2 text-base sm:gap-x-6 md:flex-nowrap md:items-start w-full"
                      key={id}
                    >
                      <motion.p
                        variants={navItemVariants}
                        className="font-medium text-muted-foreground"
                      >
                        {meta.year}
                      </motion.p>
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="flex min-w-0 flex-col gap-2"
                      >
                        <MotionA
                          variants={navItemVariants}
                          target="_blank"
                          rel="noopener noreferrer"
                          href={meta.url}
                          className="flex min-w-0 flex-wrap items-baseline gap-x-1 gap-y-0.5"
                        >
                          <span className="font-semibold">{tp(`${id}.name`)}</span>
                          <span className="font-medium text-muted-foreground">
                            — <span className="italic">{tp(`${id}.context`)}</span>
                          </span>
                          <ArrowUpRight
                            size={20}
                            className="shrink-0 text-muted-foreground"
                            aria-hidden
                          />
                        </MotionA>
                        <motion.p
                          variants={navItemVariants}
                          className="max-w-prose font-normal leading-relaxed text-foreground/85"
                        >
                          {story}
                        </motion.p>
                        <motion.p
                          variants={navItemVariants}
                          className="font-medium text-muted-foreground"
                        >
                          {tp(`${id}.techLine`)}
                        </motion.p>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>

          <div
            id={experiencePanelId}
            role="tabpanel"
            aria-labelledby={experienceTabId}
            hidden={tab !== "experience"}
            className="min-w-0"
          >
            {tab === "experience" && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="flex flex-col gap-y-3"
              >
                {experience.map((exp, idx) => (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="flex min-w-0 flex-wrap gap-x-4 gap-y-2 text-base sm:gap-x-6 md:flex-nowrap md:items-start"
                    key={idx}
                  >
                    <motion.p
                      variants={navItemVariants}
                      className="w-full shrink-0 font-medium text-muted-foreground sm:w-auto sm:min-w-[7.5rem] md:min-w-[110px]"
                    >
                      {exp.timeStamp}
                    </motion.p>
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={containerVariants}
                      className="flex flex-col"
                    >
                      <MotionA
                        variants={navItemVariants}
                        target="_blank"
                        rel="noopener noreferrer"
                        href={exp.url}
                        className="flex min-w-0 items-start gap-x-1"
                      >
                        <p className="font-semibold">{exp.position}</p>
                        <ArrowUpRight size={20} className="text-muted-foreground" />
                      </MotionA>
                      <motion.p
                        variants={navItemVariants}
                        className="font-medium text-muted-foreground"
                      >
                        {`${exp.company} . ${exp.capacity}`}
                      </motion.p>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </ContentSurface>
  );
}
