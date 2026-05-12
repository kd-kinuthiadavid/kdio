"use client";

import * as motion from "framer-motion/client";
import { useTranslations } from "next-intl";

import AnimatedButton from "@/components/shared/AnimatedButton";
import ContentSurface from "@/components/shared/ContentSurface";
import { useRouter } from "@/i18n/navigation";
import {
  containerVariants,
  itemVariants,
  navItemVariants,
} from "../../motionVariants";

export default function About() {
  const router = useRouter();
  const t = useTranslations("about");
  const tCommon = useTranslations("common");

  return (
    <ContentSurface className="w-full min-w-0 max-w-[min(100%,clamp(22rem,90vw,48rem))]">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex w-full flex-col gap-y-8 md:gap-y-10"
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
          className="flex flex-col gap-y-5 sm:gap-y-6"
        >
          <motion.p
            variants={navItemVariants}
            className="font-normal text-base leading-relaxed sm:text-lg"
          >
            {t("identity")}
          </motion.p>
          <motion.p
            variants={navItemVariants}
            className="font-normal text-base leading-relaxed sm:text-lg"
          >
            {t("edge")}
          </motion.p>
          <motion.p
            variants={navItemVariants}
            className="font-normal text-base leading-relaxed sm:text-lg"
          >
            {t("personal")}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-4 sm:gap-y-3"
        >
          <AnimatedButton
            motionVariants={navItemVariants}
            variant="default"
            className="w-full text-base font-medium py-5 sm:min-w-[12rem] sm:flex-1 md:py-6"
            onClick={() =>
              window.open("https://cal.com/kinuthiadavid/15min", "_blank")
            }
          >
            {tCommon("scheduleIntro")}
          </AnimatedButton>
          <AnimatedButton
            motionVariants={navItemVariants}
            variant="outline"
            className="w-full text-base font-medium py-5 sm:min-w-[12rem] sm:flex-1 md:py-6"
            onClick={() => router.push("/contact")}
          >
            {t("ctaContact")}
          </AnimatedButton>
        </motion.div>
      </motion.div>
    </ContentSurface>
  );
}
