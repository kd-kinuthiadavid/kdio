"use client";

import { motion } from "framer-motion";
import { Layers } from "lucide-react";
import { useTranslations } from "next-intl";

import { containerVariants, navItemVariants } from "@/app/motionVariants";
import AnimatedButton from "@/components/shared/AnimatedButton";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import MobileNav from "@/components/shared/MobileNav";
import Navigation from "@/components/shared/navigation";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { Link } from "@/i18n/navigation";
import { getDiscoveryCallUrl } from "@/lib/cal";

const MotionLink = motion.create(Link);

/*
 * Breakpoints are sized for the longest locale (sw): the inline nav fits from
 * lg (1024px) and the nav plus the header CTA from xl (1280px), with ~36px to spare.
 * Re-check both when changing nav labels or the CTA copy.
 */
export default function HeaderBrandNav() {
  const tBrand = useTranslations("brand");
  const tCommon = useTranslations("common");

  return (
    <div className="flex min-w-0 flex-1 flex-row items-center justify-between gap-2 sm:gap-4 lg:gap-6 xl:gap-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-w-0 shrink"
      >
        <MotionLink
          variants={navItemVariants}
          prefetch={true}
          href="/"
          className="flex min-w-0 max-w-full items-center gap-1.5 text-base font-semibold sm:gap-2 sm:text-xl"
        >
          <Layers
            className="size-5 shrink-0 text-primary sm:size-7"
            strokeWidth={2}
            aria-hidden
          />
          <span className="truncate">{tBrand("name")}</span>
        </MotionLink>
      </motion.div>
      <Navigation />
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
        <AnimatedButton
          motionVariants={navItemVariants}
          variant="default"
          className="hidden shrink-0 whitespace-nowrap text-base font-medium capitalize xl:inline-flex xl:py-6"
          onClick={() => window.open(getDiscoveryCallUrl(), "_blank")}
        >
          {tCommon("scheduleIntro")}
        </AnimatedButton>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="lg:hidden"
        >
          <MobileNav />
        </motion.div>
      </div>
    </div>
  );
}
