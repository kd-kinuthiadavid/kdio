import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

import ContentSurface from "@/components/shared/ContentSurface";
import AssessmentClient from "./AssessmentClient";
import AssessmentSkeleton from "./AssessmentSkeleton";

type Props = {
  params: Promise<{ locale: string }>;
};

/** CSS-only so the heading is visible before hydration */
const reveal =
  "animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700 motion-reduce:animate-none";

export default async function AssessmentPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("assessment");

  return (
    <ContentSurface className="w-full min-w-0 max-w-[min(100%,clamp(22rem,92vw,40rem))]">
      <div className="flex w-full flex-col gap-y-8 sm:gap-y-10">
        <div className="flex flex-col gap-y-3">
          <h1
            className={`${reveal} text-balance font-semibold text-3xl leading-tight sm:text-4xl`}
          >
            {t("title")}
          </h1>
          <p
            className={`${reveal} delay-100 max-w-prose text-base leading-relaxed text-muted-foreground sm:text-lg`}
          >
            {t("subtitle")}
          </p>
        </div>
        <Suspense fallback={<AssessmentSkeleton label={t("loadingLabel")} />}>
          <AssessmentClient />
        </Suspense>
      </div>
    </ContentSurface>
  );
}
