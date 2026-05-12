"use client";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { containerVariants, navItemVariants } from "@/app/motionVariants";
import AnimatedButton from "./AnimatedButton";
import { NAV_LINKS } from "@/components/shared/nav-links";

const mobileLinkBase =
  "capitalize font-medium hover:underline hover:underline-offset-4 hover:font-semibold active:underline active:underline-offset-4 active:font-semibold";

const mobileLinkActive =
  "font-semibold underline underline-offset-4 text-accent-foreground decoration-accent-foreground";

export default function MobileNav() {
  const pathname = usePathname();

  const MotionLink = motion.create(Link);

  const mobileItemClass = (href: string) =>
    `${mobileLinkBase} ${pathname === href ? mobileLinkActive : ""}`;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button
          type="button"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-foreground outline-none ring-offset-background hover:bg-accent/15 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-6" strokeWidth={2} aria-hidden />
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>David Kinuthia</DrawerTitle>
            <DrawerDescription>Product Software Engineer</DrawerDescription>
          </DrawerHeader>
          <motion.nav
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-4 sm:gap-3 sm:p-4"
          >
            {NAV_LINKS.map(({ href, label }) => (
              <MotionLink
                key={href}
                variants={navItemVariants}
                prefetch={true}
                href={href}
                className={mobileItemClass(href)}
              >
                {label}
              </MotionLink>
            ))}
          </motion.nav>
          <DrawerFooter>
            <AnimatedButton
              motionVariants={navItemVariants}
              variant={"default"}
              className="w-full text-base font-medium capitalize py-6"
              onClick={() =>
                window.open("https://cal.com/kinuthiadavid/15min", "_blank")
              }
            >
              Book a 15-min Intro
            </AnimatedButton>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
