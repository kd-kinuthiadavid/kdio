"use client";

import { Menu, Layers } from "lucide-react";
import { usePathname } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

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
import { NAV_ITEMS } from "@/components/shared/nav-links";
import { Link as LocalizedLink } from "@/i18n/navigation";

const mobileLinkBase =
  "capitalize font-medium hover:underline hover:underline-offset-4 hover:font-semibold active:underline active:underline-offset-4 active:font-semibold";

const mobileLinkActive =
  "font-semibold underline underline-offset-4 text-accent-foreground decoration-accent-foreground";

export default function MobileNav() {
  const pathname = usePathname();
  const tNav = useTranslations("nav");
  const tBrand = useTranslations("brand");
  const tCommon = useTranslations("common");

  const MotionLink = motion.create(LocalizedLink);

  const mobileItemClass = (href: string) =>
    `${mobileLinkBase} ${pathname === href ? mobileLinkActive : ""}`;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button
          type="button"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-foreground outline-none ring-offset-background hover:bg-accent/15 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:hidden"
          aria-label={tCommon("openMenu")}
        >
          <Menu className="size-6" strokeWidth={2} aria-hidden />
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="flex items-center justify-center gap-2 text-left sm:justify-start">
              <Layers
                className="size-6 shrink-0 text-primary"
                strokeWidth={2}
                aria-hidden
              />
              <span>{tBrand("name")}</span>
            </DrawerTitle>
            <DrawerDescription>{tBrand("role")}</DrawerDescription>
          </DrawerHeader>
          <motion.nav
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-4 sm:gap-3 sm:p-4"
          >
            {NAV_ITEMS.map(({ href, labelKey }) => (
              <MotionLink
                key={href}
                variants={navItemVariants}
                prefetch={true}
                href={href}
                className={mobileItemClass(href)}
              >
                {tNav(labelKey)}
              </MotionLink>
            ))}
          </motion.nav>
          <DrawerFooter className="gap-3">
            <AnimatedButton
              motionVariants={navItemVariants}
              variant={"default"}
              className="w-full text-base font-medium capitalize py-6"
              onClick={() =>
                window.open("https://cal.com/kinuthiadavid/15min", "_blank")
              }
            >
              {tCommon("scheduleIntro")}
            </AnimatedButton>
            <DrawerClose asChild>
              <Button variant="outline">{tCommon("cancel")}</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
