"use client";

import { useEffect, useState } from "react";
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
import { cn } from "@/lib/utils";

const mobileLinkBase =
  "rounded-lg text-base font-medium outline-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const mobileLinkInactive =
  "text-foreground hover:bg-accent/40 active:bg-accent/55";

const mobileLinkActive =
  "bg-accent/60 font-semibold text-accent-foreground ring-1 ring-border/80";

export default function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const tNav = useTranslations("nav");
  const tBrand = useTranslations("brand");
  const tCommon = useTranslations("common");

  const MotionLink = motion.create(LocalizedLink);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const mobileItemClass = (href: string) =>
    cn(
      mobileLinkBase,
      pathname === href ? mobileLinkActive : mobileLinkInactive
    );

  return (
    <Drawer open={open} onOpenChange={setOpen} shouldScaleBackground={false}>
      <DrawerTrigger asChild>
        <button
          type="button"
          className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-md text-foreground outline-none ring-offset-background hover:bg-accent/15 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-navigation-drawer"
          aria-haspopup="dialog"
          aria-label={tCommon("openMenu")}
        >
          <Menu className="size-6 shrink-0" strokeWidth={2} aria-hidden />
        </button>
      </DrawerTrigger>
      <DrawerContent id="mobile-navigation-drawer">
        <div className="mx-auto flex min-h-0 w-full max-w-sm flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain [-webkit-overflow-scrolling:touch]">
            <DrawerHeader className="text-center sm:text-center">
              <DrawerTitle
                id="mobile-nav-dialog-title"
                className="flex items-center justify-center gap-2 text-lg font-semibold tracking-tight"
              >
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
              id="mobile-primary-nav"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              aria-label={tCommon("mainNavigation")}
              className="flex flex-col gap-1 px-3 pb-4 pt-1"
            >
              {NAV_ITEMS.map(({ href, labelKey }) => (
                <MotionLink
                  key={href}
                  variants={navItemVariants}
                  prefetch
                  href={href}
                  aria-current={pathname === href ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    mobileItemClass(href),
                    "flex min-h-[44px] w-full items-center px-4 py-3 capitalize"
                  )}
                >
                  {tNav(labelKey)}
                </MotionLink>
              ))}
            </motion.nav>
          </div>
          <DrawerFooter className="gap-3 bg-background/95 backdrop-blur-sm">
            <AnimatedButton
              motionVariants={navItemVariants}
              variant="default"
              className="min-h-[48px] w-full text-base font-medium"
              onClick={() => {
                setOpen(false);
                window.open("https://cal.com/kinuthiadavid/15min", "_blank");
              }}
            >
              {tCommon("scheduleIntro")}
            </AnimatedButton>
            <DrawerClose asChild>
              <Button
                type="button"
                variant="outline"
                className="min-h-[48px] w-full text-base font-medium"
              >
                {tCommon("closeMenu")}
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
