"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import AnimatedButton from "@/components/shared/AnimatedButton";
import ContentSurface from "@/components/shared/ContentSurface";
import { TRACK_RECORD_ENABLED } from "@/components/shared/nav-links";
import { Link, useRouter } from "@/i18n/navigation";
import { getDiscoveryCallUrl } from "@/lib/cal";
import {
  containerVariants,
  itemVariants,
  navItemVariants,
} from "../motionVariants";

export default function Home() {
  const router = useRouter();
  const t = useTranslations("home");
  const tCommon = useTranslations("common");

  return (
    <ContentSurface className="w-full min-w-0 max-w-[min(100%,clamp(20rem,88vw,56rem))]">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex flex-col gap-y-5 sm:gap-y-6 md:gap-y-8"
      >
        <motion.h1
          variants={itemVariants}
          className="text-balance capitalize font-semibold text-3xl leading-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
        >
          {t("heroTitle")}
        </motion.h1>
        <motion.p
          variants={navItemVariants}
          className="max-w-prose font-normal text-base leading-relaxed sm:text-lg md:text-xl"
        >
          {t("heroBody")}
        </motion.p>
        <motion.p
          variants={navItemVariants}
          className="max-w-prose font-normal text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl"
        >
          {t("heroAvailability")}
        </motion.p>
        <motion.p variants={navItemVariants}>
          <Link
            href="/assessment"
            className="text-base font-medium text-primary underline underline-offset-4 hover:text-accent-foreground md:text-lg"
          >
            {t("assessmentLink")}
          </Link>
        </motion.p>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-4 sm:gap-y-3 md:flex-nowrap"
        >
          <AnimatedButton
            motionVariants={navItemVariants}
            variant={"default"}
            className="w-full text-base font-medium py-5 sm:min-w-[12rem] sm:flex-1 md:py-6"
            onClick={() => window.open(getDiscoveryCallUrl(), "_blank")}
          >
            {tCommon("scheduleIntro")}
          </AnimatedButton>
          <AnimatedButton
            motionVariants={navItemVariants}
            variant={"outline"}
            className="w-full text-base font-medium py-5 sm:min-w-[12rem] sm:flex-1 md:py-6"
            onClick={() => router.push("/services")}
          >
            {tCommon("seeServices")}
          </AnimatedButton>
        </motion.div>
        {TRACK_RECORD_ENABLED && (
          <motion.p variants={navItemVariants}>
            <Link
              href="/work"
              className="inline-flex items-center gap-x-1.5 text-sm font-medium text-muted-foreground underline underline-offset-4 transition-colors hover:text-accent-foreground sm:text-base"
            >
              {t("trackRecordLink")}
              <ArrowRight size={16} className="shrink-0" aria-hidden />
            </Link>
          </motion.p>
        )}
      </motion.div>
    </ContentSurface>
  );
}
