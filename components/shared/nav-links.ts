export type NavItem = {
  href: "/" | "/method" | "/work" | "/contact";
  labelKey: "home" | "method" | "work" | "contact";
};

export const NAV_ITEMS: readonly NavItem[] = [
  { href: "/", labelKey: "home" },
  { href: "/method", labelKey: "method" },
  { href: "/work", labelKey: "work" },
  { href: "/contact", labelKey: "contact" },
] as const;
