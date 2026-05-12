"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, X } from "lucide-react";
import { useTranslations } from "next-intl";

import AnimatedButton from "@/components/shared/AnimatedButton";
import ContentSurface from "@/components/shared/ContentSurface";
import { Link } from "@/i18n/navigation";
import {
  containerVariants,
  itemVariants,
  navItemVariants,
} from "../../motionVariants";
import ServicesList from "./_components/ServicesList";
import type { ServiceContent } from "./_components/ServiceItem";

const SERVICE_IDS = [
  "aiIntegration",
  "secureAi",
  "aiNative",
  "agenticOps",
  "mlopsRescue",
  "fractionalCto",
] as const;

const TIER_IDS = ["micro", "mvp", "enterprise"] as const;

const FIT_FOR_KEYS = ["funded", "regulated", "legacy", "scale"] as const;
const FIT_NOT_FOR_KEYS = [
  "ideaGuy",
  "agencyMiddleman",
  "noTechBudget",
] as const;

const PROCESS_STEPS = ["discovery", "scope", "build"] as const;

// TODO: replace STRATEGY_CALL_URL with the dedicated strategy-call cal.com URL once configured.
const STRATEGY_CALL_URL = "https://cal.com/kinuthiadavid/15min";
const DISCOVERY_CALL_URL = "https://cal.com/kinuthiadavid/15min";

export default function Services() {
  const t = useTranslations("services");

  const services: ServiceContent[] = SERVICE_IDS.map((id, idx) => ({
    id,
    name: t(`items.${id}.name`),
    persona: t(`items.${id}.persona`),
    summary: t(`items.${id}.summary`),
    included: t(`items.${id}.included`),
    includedLabel: t("includedLabel"),
    upsells: t(`items.${id}.upsells`),
    tierMicro: t("tiers.micro"),
    tierMvp: t("tiers.mvp"),
    tierEnterprise: t("tiers.enterprise"),
    idx,
    isLast: idx === SERVICE_IDS.length - 1,
  }));

  return (
    <ContentSurface className="w-full min-w-0 max-w-[min(100%,clamp(22rem,90vw,64rem))]">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex w-full flex-col gap-y-10 md:gap-y-14"
      >
        {/* Hero */}
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
            {t("subtitle")}
          </motion.p>
        </motion.div>

        {/* Stats strip */}
        <motion.dl
          variants={containerVariants}
          className="grid grid-cols-1 gap-4 border-y border-border py-5 sm:grid-cols-3 sm:gap-6 sm:py-6"
        >
          {[
            { value: t("stats.tenureValue"), label: t("stats.tenureLabel") },
            {
              value: t("stats.engagementValue"),
              label: t("stats.engagementLabel"),
            },
            { value: t("stats.sectorsValue"), label: t("stats.sectorsLabel") },
          ].map(({ value, label }) => (
            <motion.div
              key={label}
              variants={itemVariants}
              className="flex flex-col gap-y-1"
            >
              <dt className="text-base font-semibold sm:text-lg">{value}</dt>
              <dd className="text-sm font-normal text-muted-foreground sm:text-base">
                {label}
              </dd>
            </motion.div>
          ))}
        </motion.dl>

        {/* Tier explainer */}
        <motion.div variants={containerVariants} className="flex flex-col gap-y-6">
          <motion.div
            variants={containerVariants}
            className="flex flex-col gap-y-2"
          >
            <motion.h2
              variants={itemVariants}
              className="font-semibold text-xl leading-tight sm:text-2xl"
            >
              {t("tiersHeading")}
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="max-w-prose font-normal text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              {t("tiersSubtitle")}
            </motion.p>
          </motion.div>
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5"
          >
            {TIER_IDS.map((tier) => (
              <motion.article
                key={tier}
                variants={itemVariants}
                className="flex flex-col gap-y-3 rounded-lg border border-border bg-background/40 p-5 sm:p-6"
              >
                <div className="flex items-baseline justify-between gap-x-2">
                  <h3 className="font-semibold text-lg sm:text-xl">
                    {t(`tiers.${tier}`)}
                  </h3>
                </div>
                <p className="font-medium text-base leading-snug text-accent-foreground">
                  {t(`tiersDetail.${tier}.tagline`)}
                </p>
                <dl className="flex flex-col gap-y-2.5 pt-1">
                  {(["scope", "outcome", "idealFor"] as const).map((field) => (
                    <div key={field} className="flex flex-col gap-y-0.5">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {t(`tierFieldLabels.${field}`)}
                      </dt>
                      <dd className="text-sm leading-relaxed sm:text-base">
                        {t(`tiersDetail.${tier}.${field}`)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </motion.article>
            ))}
          </motion.div>
        </motion.div>

        {/* Services list */}
        <motion.div variants={containerVariants} className="flex flex-col gap-y-6">
          <motion.h2
            variants={itemVariants}
            className="font-semibold text-xl leading-tight sm:text-2xl"
          >
            {t("servicesHeading")}
          </motion.h2>
          <ServicesList services={services} />
        </motion.div>

        {/* Fit filter */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10"
        >
          <motion.div
            variants={containerVariants}
            className="flex flex-col gap-y-4"
          >
            <motion.h2
              variants={itemVariants}
              className="font-semibold text-lg leading-tight sm:text-xl"
            >
              {t("fit.forTitle")}
            </motion.h2>
            <motion.ul
              variants={containerVariants}
              className="flex flex-col gap-y-3"
            >
              {FIT_FOR_KEYS.map((key) => (
                <motion.li
                  key={key}
                  variants={navItemVariants}
                  className="flex items-start gap-x-3"
                >
                  <Check
                    size={20}
                    className="mt-1 shrink-0 text-primary"
                    aria-hidden
                  />
                  <span className="text-base leading-relaxed">
                    {t(`fit.for.${key}`)}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="flex flex-col gap-y-4"
          >
            <motion.h2
              variants={itemVariants}
              className="font-semibold text-lg leading-tight text-muted-foreground sm:text-xl"
            >
              {t("fit.notForTitle")}
            </motion.h2>
            <motion.ul
              variants={containerVariants}
              className="flex flex-col gap-y-3"
            >
              {FIT_NOT_FOR_KEYS.map((key) => (
                <motion.li
                  key={key}
                  variants={navItemVariants}
                  className="flex items-start gap-x-3"
                >
                  <X
                    size={20}
                    className="mt-1 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                  <span className="text-base leading-relaxed text-muted-foreground">
                    {t(`fit.notFor.${key}`)}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </motion.div>

        {/* Process */}
        <motion.div
          variants={containerVariants}
          className="flex flex-col gap-y-6"
        >
          <motion.h2
            variants={itemVariants}
            className="font-semibold text-xl leading-tight sm:text-2xl"
          >
            {t("process.title")}
          </motion.h2>
          <motion.ol
            variants={containerVariants}
            className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8"
          >
            {PROCESS_STEPS.map((step) => (
              <motion.li
                key={step}
                variants={itemVariants}
                className="flex flex-col gap-y-2"
              >
                <p className="font-semibold text-base sm:text-lg">
                  {t(`process.${step}.title`)}
                </p>
                <p className="font-normal text-base leading-relaxed text-muted-foreground">
                  {t(`process.${step}.body`)}
                </p>
              </motion.li>
            ))}
          </motion.ol>
        </motion.div>

        {/* CTAs */}
        <motion.div
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
            className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-4 sm:gap-y-3"
          >
            <AnimatedButton
              motionVariants={navItemVariants}
              variant="default"
              className="w-full text-base font-medium py-5 sm:min-w-[14rem] sm:flex-1 md:py-6"
              onClick={() => window.open(STRATEGY_CALL_URL, "_blank")}
            >
              {t("cta.strategyButton")}
            </AnimatedButton>
            <AnimatedButton
              motionVariants={navItemVariants}
              variant="outline"
              className="w-full text-base font-medium py-5 sm:min-w-[14rem] sm:flex-1 md:py-6"
              onClick={() => window.open(DISCOVERY_CALL_URL, "_blank")}
            >
              {t("cta.discoveryButton")}
            </AnimatedButton>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Link
              href="/method"
              className="inline-flex items-center gap-x-1.5 text-sm font-medium text-muted-foreground underline underline-offset-4 transition-colors hover:text-accent-foreground sm:text-base"
            >
              {t("cta.principlesLink")}
              <ArrowRight size={16} className="shrink-0" aria-hidden />
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </ContentSurface>
  );
}
