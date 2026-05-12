export type NavItem = {
  href: "/" | "/about" | "/services" | "/work" | "/contact";
  labelKey: "home" | "about" | "services" | "work" | "contact";
};

export const NAV_ITEMS: readonly NavItem[] = [
  { href: "/", labelKey: "home" },
  { href: "/about", labelKey: "about" },
  { href: "/services", labelKey: "services" },
  { href: "/work", labelKey: "work" },
  { href: "/contact", labelKey: "contact" },
] as const;
