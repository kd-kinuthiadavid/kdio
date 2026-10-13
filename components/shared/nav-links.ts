export type NavItem = {
  href: "/" | "/about" | "/services" | "/work" | "/contact" | "/assessment";
  labelKey: "home" | "about" | "services" | "work" | "contact" | "assessment";
};

/** When false, /work returns 404 and every link to it is hidden. */
export const TRACK_RECORD_ENABLED = false;

const ALL_NAV_ITEMS: readonly NavItem[] = [
  { href: "/", labelKey: "home" },
  { href: "/about", labelKey: "about" },
  { href: "/services", labelKey: "services" },
  { href: "/assessment", labelKey: "assessment" },
  { href: "/work", labelKey: "work" },
  { href: "/contact", labelKey: "contact" },
];

export const NAV_ITEMS: readonly NavItem[] = ALL_NAV_ITEMS.filter(
  (item) => item.href !== "/work" || TRACK_RECORD_ENABLED,
);
