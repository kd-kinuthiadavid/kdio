export type NavItem = {
  href: "/" | "/about" | "/method" | "/work" | "/contact";
  labelKey: "home" | "about" | "method" | "work" | "contact";
};

export const NAV_ITEMS: readonly NavItem[] = [
  { href: "/", labelKey: "home" },
  { href: "/about", labelKey: "about" },
  { href: "/method", labelKey: "method" },
  { href: "/work", labelKey: "work" },
  { href: "/contact", labelKey: "contact" },
] as const;
