export type NavItem = {
  href: "/" | "/about" | "/services" | "/work" | "/contact" | "/assessment";
  labelKey: "home" | "about" | "services" | "work" | "contact" | "assessment";
};

export const NAV_ITEMS: readonly NavItem[] = [
  { href: "/", labelKey: "home" },
  { href: "/about", labelKey: "about" },
  { href: "/services", labelKey: "services" },
  { href: "/assessment", labelKey: "assessment" },
  { href: "/work", labelKey: "work" },
  { href: "/contact", labelKey: "contact" },
] as const;
