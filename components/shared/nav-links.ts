export type NavLinkItem = {
  href: string;
  label: string;
};

export const NAV_LINKS: NavLinkItem[] = [
  { href: "/", label: "home" },
  { href: "/method", label: "method" },
  { href: "/work", label: "work" },
  { href: "/contact", label: "contact" },
];
