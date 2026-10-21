"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import AnimatedButton from "@/components/shared/AnimatedButton";
import ContentSurface from "@/components/shared/ContentSurface";
import { Link } from "@/i18n/navigation";
import type { ServiceId } from "@/lib/assessment/types";
import { getDiscoveryCallUrl } from "@/lib/cal";
import {
  containerVariants,
  itemVariants,
  navItemVariants,
} from "@/app/motionVariants";
import BuildItem, { type BuildContent } from "./BuildItem";
import CareerTimeline, { type TimelineItem } from "./CareerTimeline";
import CaseStudy, { type CaseEntry } from "./CaseStudy";
import Testimonials, { type TestimonialContent } from "./Testimonials";

const COMPANY_URLS = {
  churpy: "https://www.churpy.co/",
  productNotes: "https://www.product-notes.com/",
  apollo: "https://www.apolloapi.io/",
  twende: "https://www.linkedin.com/company/twendemobility/about/",
} as const;

type CompanyId = keyof typeof COMPANY_URLS;

const CASES: {
  id: CompanyId;
  items: { id: string; services: ServiceId[] }[];
}[] = [
  {
    id: "churpy",
    items: [
      { id: "recon", services: ["aiIntegration", "agenticOps"] },
      { id: "docsAi", services: ["secureAi"] },
      { id: "akountable", services: ["fractionalCto"] },
      { id: "infra", services: ["mlopsRescue"] },
    ],
  },
  { id: "productNotes", items: [{ id: "main", services: ["aiNative"] }] },
  { id: "apollo", items: [{ id: "main", services: ["aiIntegration"] }] },
  { id: "twende", items: [{ id: "main", services: ["fractionalCto"] }] },
];

const BUILDS: {
  id: string;
  status: BuildContent["status"];
  url?: string;
  hasTechLine?: boolean;
  services: ServiceId[];
}[] = [
  {
    id: "overture",
    status: "live",
    url: "https://get-overture.davidkinuthia.com/",
    hasTechLine: true,
    services: ["aiNative"],
  },
  { id: "privateRag", status: "inProgress", services: ["secureAi"] },
  { id: "pdfAgent", status: "inProgress", services: ["agenticOps"] },
  { id: "evalHarness", status: "inProgress", services: ["aiIntegration"] },
];

const CHURPY_ROLE_IDS = ["head", "lead", "fullstack"] as const;
const TIMELINE_SINGLE_IDS = ["productNotes", "apollo", "twende"] as const;

const TESTIMONIAL_IDS: readonly string[] = [];

export default function TrackRecord() {
  const t = useTranslations("work");
  const tServices = useTranslations("services.items");

  const toServiceTags = (ids: ServiceId[]) =>
    ids.map((id) => ({ id, name: tServices(`${id}.name`) }));

  const caseEntries: CaseEntry[] = CASES.map(({ id, items }) => ({
    id,
    company: t(`cases.${id}.company`),
    url: COMPANY_URLS[id],
    meta: t(`cases.${id}.meta`),
    dates: t(`timeline.${id}.dates`),
    context: t(`cases.${id}.context`),
    cases: items.map((item) => ({
      id: item.id,
      title: t(`cases.${id}.items.${item.id}.title`),
      problem: t(`cases.${id}.items.${item.id}.problem`),
      approach: t(`cases.${id}.items.${item.id}.approach`),
      result: t(`cases.${id}.items.${item.id}.result`),
      services: toServiceTags(item.services),
    })),
  }));

  const builds: BuildContent[] = BUILDS.map((build) => ({
    id: build.id,
    name: t(`builds.${build.id}.name`),
    context: t(`builds.${build.id}.context`),
    summary: t(`builds.${build.id}.summary`),
    techLine: build.hasTechLine ? t(`builds.${build.id}.techLine`) : undefined,
    url: build.url,
    status: build.status,
    statusLabel: t(build.status === "live" ? "statusLive" : "statusInProgress"),
    services: toServiceTags(build.services),
  }));

  const timeline: TimelineItem[] = [
    {
      id: "churpy",
      company: t("cases.churpy.company"),
      dates: t("timeline.churpy.dates"),
      url: COMPANY_URLS.churpy,
      roles: CHURPY_ROLE_IDS.map((role) => ({
        position: t(`timeline.churpy.roles.${role}.position`),
        dates: t(`timeline.churpy.roles.${role}.dates`),
      })),
    },
    ...TIMELINE_SINGLE_IDS.map((id) => ({
      id,
      company: t(`cases.${id}.company`),
      dates: t(`timeline.${id}.dates`),
      url: COMPANY_URLS[id],
      position: t(`timeline.${id}.position`),
    })),
  ];

  const testimonials: TestimonialContent[] = TESTIMONIAL_IDS.map((id) => ({
    id,
    quote: t(`testimonials.${id}.quote`),
    name: t(`testimonials.${id}.name`),
    title: t(`testimonials.${id}.title`),
    company: t(`testimonials.${id}.company`),
  }));

  const caseLabels = {
    problem: t("labels.problem"),
    approach: t("labels.approach"),
    result: t("labels.result"),
    services: t("labels.services"),
  };

  return (
    <ContentSurface className="w-full min-w-0 max-w-[min(100%,clamp(22rem,90vw,64rem))]">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex w-full flex-col gap-y-10 md:gap-y-14"
      >
        <motion.div
          variants={containerVariants}
          className="flex flex-col gap-y-4 sm:gap-y-5"
        >
          <motion.h1
            variants={itemVariants}
            className="text-balance font-semibold text-3xl leading-tight sm:text-4xl md:text-5xl"
          >
            {t("title")}
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="max-w-prose font-normal text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {t("intro")}
          </motion.p>
        </motion.div>

        <motion.section
          variants={containerVariants}
          className="flex flex-col gap-y-6"
        >
          <motion.h2
            variants={itemVariants}
            className="font-semibold text-xl leading-tight sm:text-2xl"
          >
            {t("casesHeading")}
          </motion.h2>
          <motion.div
            variants={containerVariants}
            className="flex flex-col gap-y-8"
          >
            {caseEntries.map((entry) => (
              <CaseStudy key={entry.id} entry={entry} labels={caseLabels} />
            ))}
          </motion.div>
        </motion.section>

        <motion.section
          variants={containerVariants}
          className="flex flex-col gap-y-6"
        >
          <motion.div
            variants={containerVariants}
            className="flex flex-col gap-y-2"
          >
            <motion.h2
              variants={itemVariants}
              className="font-semibold text-xl leading-tight sm:text-2xl"
            >
              {t("buildsHeading")}
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="max-w-prose font-normal text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              {t("buildsIntro")}
            </motion.p>
          </motion.div>
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5"
          >
            {builds.map((build) => (
              <BuildItem
                key={build.id}
                content={build}
                servicesLabel={caseLabels.services}
              />
            ))}
          </motion.div>
        </motion.section>

        <Testimonials heading={t("testimonialsHeading")} items={testimonials} />

        <motion.section
          variants={containerVariants}
          className="flex flex-col gap-y-6"
        >
          <motion.h2
            variants={itemVariants}
            className="font-semibold text-xl leading-tight sm:text-2xl"
          >
            {t("timelineHeading")}
          </motion.h2>
          <CareerTimeline items={timeline} />
        </motion.section>

        <motion.section
          variants={containerVariants}
          className="flex flex-col gap-y-5 border-t border-border pt-8 sm:pt-10"
        >
          <motion.h2
            variants={itemVariants}
            className="font-semibold text-xl leading-tight sm:text-2xl"
          >
            {t("cta.title")}
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="max-w-prose font-normal text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {t("cta.body")}
          </motion.p>
          <motion.div
            variants={containerVariants}
            className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-3"
          >
            <AnimatedButton
              motionVariants={navItemVariants}
              variant="default"
              className="w-full text-base font-medium py-5 sm:w-auto sm:min-w-[14rem] md:py-6"
              onClick={() => window.open(getDiscoveryCallUrl(), "_blank")}
            >
              {t("cta.discoveryButton")}
            </AnimatedButton>
            <motion.div variants={navItemVariants}>
              <Link
                href="/assessment"
                className="text-base font-medium text-primary underline underline-offset-4 hover:text-accent-foreground sm:text-lg"
              >
                {t("cta.assessmentLink")}
              </Link>
            </motion.div>
          </motion.div>
        </motion.section>
      </motion.div>
    </ContentSurface>
  );
}
