"use client";

import * as motion from "framer-motion/client";
import { useTranslations } from "next-intl";

import {
  containerVariants,
  itemVariants,
  navItemVariants,
} from "../../motionVariants";
import MethodItemsList from "./_components/MethodItemsList";
import AnimatedButton from "@/components/shared/AnimatedButton";
import ContentSurface from "@/components/shared/ContentSurface";

const METHOD_KEYS = [
  "userCentric",
  "quality",
  "collaboration",
  "iteration",
  "simplicity",
  "humanCenteredAi",
] as const;

export default function Method() {
  const t = useTranslations("method");
  const tCommon = useTranslations("common");

  const methodContent = METHOD_KEYS.map((key, idx) => ({
    title: t(`${key}.title`),
    subTitle: t(`${key}.subTitle`),
    description: t(`${key}.description`),
    idx,
  }));

  return (
    <ContentSurface className="w-full min-w-0 max-w-[min(100%,clamp(22rem,90vw,48rem))]">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex w-full flex-col gap-y-8 md:gap-y-12"
      >
        <motion.div
          initial="hidden"
          animate="visible"
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
            className="font-normal text-base leading-relaxed sm:text-lg"
          >
            {t("howToWorkParagraph1")}
          </motion.p>
          <motion.p
            variants={itemVariants}
            className="font-normal text-base leading-relaxed sm:text-lg"
          >
            {t("howToWorkParagraph2")}
          </motion.p>
          <motion.p
            variants={itemVariants}
            className="font-normal text-base leading-relaxed sm:text-lg"
          >
            {t("howToWorkParagraph3")}
          </motion.p>
        </motion.div>

        <motion.h2
          variants={itemVariants}
          className="font-semibold text-xl leading-tight sm:text-2xl"
        >
          {t("principlesHeading")}
        </motion.h2>
        <MethodItemsList methodContent={methodContent} />

        <motion.p
          variants={itemVariants}
          className="font-normal text-base leading-relaxed sm:text-lg lg:max-w-[min(100%,42rem)]"
        >
          {t("outro")}
        </motion.p>
        <AnimatedButton
          motionVariants={navItemVariants}
          variant={"default"}
          className="w-full text-base font-medium py-5 md:py-6"
          onClick={() =>
            window.open("https://cal.com/kinuthiadavid/15min", "_blank")
          }
        >
          {tCommon("scheduleIntro")}
        </AnimatedButton>
      </motion.div>
    </ContentSurface>
  );
}
