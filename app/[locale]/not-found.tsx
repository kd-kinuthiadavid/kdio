import { getTranslations } from "next-intl/server";

import ContentSurface from "@/components/shared/ContentSurface";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <ContentSurface className="w-full min-w-0 max-w-[min(100%,clamp(20rem,88vw,40rem))]">
      <div className="flex flex-col gap-y-4 sm:gap-y-6">
        <h1 className="text-balance font-semibold text-4xl capitalize leading-tight sm:text-5xl">
          {t("title")}
        </h1>
        <p className="font-normal text-base leading-relaxed sm:text-lg">
          {t("body")}
        </p>
      </div>
    </ContentSurface>
  );
}
