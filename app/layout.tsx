import type { ReactNode } from "react";

// `<html>` lives in `app/[locale]/layout.tsx` and `app/admin/layout.tsx` (via HtmlShell),
// so each can set its own `lang` without reading request headers. This root layout
// exists only so `app/not-found.tsx` can serve URLs outside those segments.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
