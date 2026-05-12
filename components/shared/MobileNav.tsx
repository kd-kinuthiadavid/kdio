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
        <Menu className="md:hidden" />
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
            className="grid grid-cols-3 gap-2 p-4"
          >
            {NAV_LINKS.map(({ href, label, Icon }) => (
              <MotionLink
                key={href}
                variants={navItemVariants}
                prefetch={true}
                href={href}
                className={mobileItemClass(href)}
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <Icon className="size-4 shrink-0 opacity-90" aria-hidden />
                  {label}
                </span>
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
