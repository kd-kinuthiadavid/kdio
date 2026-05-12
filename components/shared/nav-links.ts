import type { LucideIcon } from "lucide-react";
import { Briefcase, Compass, Home, Mail } from "lucide-react";

export type NavLinkItem = {
  href: string;
  label: string;
  Icon: LucideIcon;
};

export const NAV_LINKS: NavLinkItem[] = [
  { href: "/", label: "home", Icon: Home },
  { href: "/method", label: "method", Icon: Compass },
  { href: "/work", label: "work", Icon: Briefcase },
  { href: "/contact", label: "contact", Icon: Mail },
];
