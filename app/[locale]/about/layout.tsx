import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import JsonLd from "@/components/seo/JsonLd";
import { buildTranslatedPageMetadata } from "@/lib/seo";
import { profilePage } from "@/lib/structured-data";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildTranslatedPageMetadata(locale, "about", "/about");
}

export default async function AboutLayout({ children, params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.pages" });

  return (
    <>
      <JsonLd data={profilePage({ locale, name: t("about.title") })} />
      {children}
    </>
  );
}
