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

export default function HeaderBrandNav() {
  const tBrand = useTranslations("brand");
  const tCommon = useTranslations("common");

  const MotionLink = motion.create(Link);
  return (
    <div className="flex min-w-0 flex-1 flex-row items-center justify-start gap-3 sm:gap-4 md:justify-between md:gap-6 lg:gap-10">
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
          className="flex min-w-0 max-w-full items-center gap-2 text-lg font-semibold sm:text-xl"
        >
          <Layers
            className="size-6 shrink-0 text-primary sm:size-7"
            strokeWidth={2}
            aria-hidden
          />
          <span className="truncate">{tBrand("name")}</span>
        </MotionLink>
      </motion.div>
      <Navigation />
      <div className="flex shrink-0 items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
        <AnimatedButton
          motionVariants={navItemVariants}
          variant="default"
          className="hidden shrink-0 text-sm font-medium capitalize sm:text-base md:inline-flex md:py-5 lg:py-6"
          onClick={() =>
            window.open("https://cal.com/kinuthiadavid/15min", "_blank")
          }
        >
          {tCommon("scheduleIntro")}
        </AnimatedButton>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="md:hidden"
        >
          <MobileNav />
        </motion.div>
      </div>
    </div>
  );
}
