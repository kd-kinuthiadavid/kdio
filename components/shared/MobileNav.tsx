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

export default function MobileNav() {
  const pathname = usePathname();

  const MotionLink = motion(Link);

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
            <MotionLink
              variants={navItemVariants}
              prefetch={true}
              href="/"
              className={`capitalize font-medium hover:underline hover:underline-offset-4 hover:font-semibold active:underline active:underline-offset-4 active:font-semibold ${
                pathname === "/"
                  ? "font-semibold underline underline-offset-4 text-accent-foreground decoration-accent-foreground"
                  : ""
              }`}
            >
              intro
            </MotionLink>
            <MotionLink
              variants={navItemVariants}
              prefetch={true}
              href="/about"
              className={`capitalize font-medium hover:underline hover:underline-offset-4 hover:font-semibold active:underline active:underline-offset-4 active:font-semibold ${
                pathname === "/about"
                  ? "font-semibold underline underline-offset-4 text-accent-foreground decoration-accent-foreground"
                  : ""
              }`}
            >
              about
            </MotionLink>
            <MotionLink
              variants={navItemVariants}
              prefetch={true}
              href="/method"
              className={`capitalize font-medium hover:underline hover:underline-offset-4 hover:font-semibold active:underline active:underline-offset-4 active:font-semibold ${
                pathname === "/method"
                  ? "font-semibold underline underline-offset-4 text-accent-foreground decoration-accent-foreground"
                  : ""
              }`}
            >
              method
            </MotionLink>
            <MotionLink
              variants={navItemVariants}
              prefetch={true}
              href="/work"
              className={`capitalize font-medium hover:underline hover:underline-offset-4 hover:font-semibold active:underline active:underline-offset-4 active:font-semibold ${
                pathname === "/work"
                  ? "font-semibold underline underline-offset-4 text-accent-foreground decoration-accent-foreground"
                  : ""
              }`}
            >
              work
            </MotionLink>
            <MotionLink
              variants={navItemVariants}
              prefetch={true}
              href="/contact"
              className={`capitalize font-medium hover:underline hover:underline-offset-4 hover:font-semibold active:underline active:underline-offset-4 active:font-semibold ${
                pathname === "/contact"
                  ? "font-semibold underline underline-offset-4 text-accent-foreground decoration-accent-foreground"
                  : ""
              }`}
            >
              contact
            </MotionLink>
          </motion.nav>
          <DrawerFooter>
            <AnimatedButton
              motionVariants={navItemVariants}
              variant={"default"}
              className="w-full text-base font-medium capitalize py-6"
            >
              Let&apos;s build together
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
