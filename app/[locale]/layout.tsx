import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import HeaderBrandNav from "@/components/shared/HeaderBrandNav";
import { routing } from "@/i18n/routing";

const gutterX = "px-[clamp(1rem,0.55rem+3.2vw,3.5rem)]";
const gutterY = "py-[clamp(1rem,0.65rem+2.2vh,4rem)]";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (
    !routing.locales.includes(locale as (typeof routing.locales)[number])
  ) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="relative z-10 flex min-h-screen flex-col">
        <header
          className={`flex shrink-0 items-center justify-between gap-3 ${gutterX} ${gutterY}`}
        >
          <HeaderBrandNav />
        </header>
        <main
          className={`flex flex-1 flex-col justify-end overflow-x-hidden overflow-y-auto ${gutterX} pb-[clamp(1.25rem,1rem+3vh,4rem)] pt-2 sm:pt-4 min-h-0`}
        >
          <div className="flex w-full min-w-0 justify-center">{children}</div>
          <SpeedInsights />
          <Analytics />
        </main>
      </div>
    </NextIntlClientProvider>
  );
}
