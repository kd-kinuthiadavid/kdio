"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { containerVariants, navItemVariants } from "@/app/motionVariants";
import { NAV_ITEMS } from "@/components/shared/nav-links";
import { Link, usePathname } from "@/i18n/navigation";

const linkBase =
  "rounded-md px-2 py-2 text-sm font-medium capitalize transition-colors outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:px-3 sm:text-base lg:px-5";

const linkInactive =
  "hover:text-accent-foreground hover:underline hover:underline-offset-4";

const linkActive =
  "text-accent-foreground underline underline-offset-4 font-bold";

export default function Navigation() {
  const pathname = usePathname();
  const tNav = useTranslations("nav");

  const MotionLink = motion.create(Link);

  const itemClass = (href: string) =>
    `${linkBase} ${pathname === href ? linkActive : linkInactive}`;

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="hidden min-w-0 flex-1 flex-row items-center justify-center gap-0.5 sm:gap-1 md:flex md:self-center"
    >
      {NAV_ITEMS.map(({ href, labelKey }) => (
        <MotionLink
          key={href}
          variants={navItemVariants}
          prefetch={true}
          href={href}
          className={itemClass(href)}
        >
          {tNav(labelKey)}
        </MotionLink>
      ))}
    </motion.nav>
  );
}
