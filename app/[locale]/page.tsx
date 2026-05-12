"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import AnimatedButton from "@/components/shared/AnimatedButton";
import ContentSurface from "@/components/shared/ContentSurface";
import { useRouter } from "@/i18n/navigation";
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
            onClick={() =>
              window.open("https://cal.com/kinuthiadavid/15min", "_blank")
            }
          >
            {tCommon("scheduleIntro")}
          </AnimatedButton>
          <AnimatedButton
            motionVariants={navItemVariants}
            variant={"outline"}
            className="w-full text-base font-medium py-5 sm:min-w-[12rem] sm:flex-1 md:py-6"
            onClick={() => router.push("/work")}
          >
            {tCommon("seeSelectedWork")}
          </AnimatedButton>
        </motion.div>
      </motion.div>
    </ContentSurface>
  );
}
