"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { containerVariants, navItemVariants } from "@/app/motionVariants";
import { NAV_LINKS } from "@/components/shared/nav-links";

const linkBase =
  "rounded-md px-5 py-2 text-base font-medium capitalize transition-colors outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const linkInactive =
  "hover:text-accent-foreground hover:underline hover:underline-offset-4";

const linkActive = "text-accent-foreground underline underline-offset-4 font-bold";

export default function Navigation() {
  const pathname = usePathname();

  const MotionLink = motion.create(Link);

  const itemClass = (href: string) =>
    `${linkBase} ${pathname === href ? linkActive : linkInactive}`;

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="hidden md:flex md:self-center flex-row items-center gap-1"
    >
      {NAV_LINKS.map(({ href, label, Icon }) => (
        <MotionLink
          key={href}
          variants={navItemVariants}
          prefetch={true}
          href={href}
          className={itemClass(href)}
        >
          <span className="inline-flex items-center gap-2">
            <Icon className="size-4 shrink-0 opacity-90" aria-hidden />
            {label}
          </span>
        </MotionLink>
      ))}
    </motion.nav>
  );
}
