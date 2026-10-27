import Script from "next/script";
import type { ReactNode } from "react";

import "@/app/globals.css";
import { raleway } from "@/app/fonts";
import { ThemeProvider } from "@/components/theme-provider";

type HtmlShellProps = {
  lang: string;
  children: ReactNode;
};

/** Document shell shared by the root layouts (`app/[locale]` and `app/admin`). */
export default function HtmlShell({ lang, children }: HtmlShellProps) {
  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={`${raleway.className} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
        <Script
          src="https://cdn.seline.so/seline.js"
          data-token="27716046b4c7ce3"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
