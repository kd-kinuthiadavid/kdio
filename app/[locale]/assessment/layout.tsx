import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { buildPageMetadata } from "@/lib/seo";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "assessment" });
  return buildPageMetadata({
    locale,
    path: "/assessment",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default function AssessmentLayout({ children }: { children: ReactNode }) {
  return children;
}
