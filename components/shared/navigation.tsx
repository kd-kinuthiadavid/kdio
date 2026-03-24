"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { containerVariants, navItemVariants } from "@/app/motionVariants";

const linkBase =
  "rounded-md px-5 py-2 text-sm font-medium capitalize transition-colors outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const linkInactive =
  "text-accent-foreground hover:bg-foreground/5 hover:text-accent-foreground";

const linkActive = "bg-primary/90 text-background shadow-sm hover:bg-primary";

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
      className="hidden md:flex md:self-center flex-row items-center gap-1 rounded-md border border-primary bg-background p-2 shadow-sm"
    >
      <MotionLink
        variants={navItemVariants}
        prefetch={true}
        href="/about"
        className={itemClass("/about")}
      >
        about
      </MotionLink>
      <MotionLink
        variants={navItemVariants}
        prefetch={true}
        href="/method"
        className={itemClass("/method")}
      >
        method
      </MotionLink>
      <MotionLink
        variants={navItemVariants}
        prefetch={true}
        href="/work"
        className={itemClass("/work")}
      >
        work
      </MotionLink>
      <MotionLink
        variants={navItemVariants}
        prefetch={true}
        href="/contact"
        className={itemClass("/contact")}
      >
        contact
      </MotionLink>
    </motion.nav>
  );
}
