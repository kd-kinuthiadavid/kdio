import Script from "next/script";
import { headers } from "next/headers";

import "./globals.css";
import { raleway } from "./fonts";
import { ThemeProvider } from "@/components/theme-provider";
import { routing } from "@/i18n/routing";

function resolveHtmlLang(headerLocale: string | null): string {
  if (
    headerLocale &&
    routing.locales.includes(
      headerLocale as (typeof routing.locales)[number],
    )
  ) {
    return headerLocale;
  }
  return routing.defaultLocale;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const lang = resolveHtmlLang(headerList.get("x-next-intl-locale"));

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <Script
          src="https://cdn.seline.so/seline.js"
          data-token="27716046b4c7ce3"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${raleway.className} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
