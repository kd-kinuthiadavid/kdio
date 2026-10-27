import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import JsonLd from "@/components/seo/JsonLd";
import { SERVICE_IDS } from "@/lib/assessment/types";
import { buildTranslatedPageMetadata } from "@/lib/seo";
import { serviceCatalog } from "@/lib/structured-data";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildTranslatedPageMetadata(locale, "services", "/services");
}

export default async function ServicesLayout({ children, params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  const tPages = await getTranslations({ locale, namespace: "metadata.pages" });

  return (
    <>
      <JsonLd
        data={serviceCatalog({
          locale,
          name: tPages("services.title"),
          services: SERVICE_IDS.map((id) => ({
            name: t(`items.${id}.name`),
            description: t(`items.${id}.summary`),
          })),
        })}
      />
      {children}
    </>
  );
}
