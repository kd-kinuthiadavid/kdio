import { getTranslations } from "next-intl/server";
import { ImageResponse } from "next/og";

import { brand, brandColors } from "@/lib/brand";
import { getSiteUrl } from "@/lib/site-url";

export const alt = `${brand.name} — ${brand.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "brand" });
  const host = new URL(getSiteUrl()).host;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: brandColors.bg,
          color: brandColors.fg,
          borderBottom: `16px solid ${brandColors.accent}`,
        }}
      >
        <svg
          width="96"
          height="96"
          viewBox="0 0 24 24"
          fill="none"
          stroke={brandColors.primary}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {brand.logoPaths.map((d) => (
            <path key={d} d={d} />
          ))}
        </svg>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 88, fontWeight: 700, lineHeight: 1.05 }}>
            {brand.name}
          </div>
          <div
            style={{
              fontSize: 44,
              lineHeight: 1.25,
              color: brandColors.primary,
              maxWidth: 980,
            }}
          >
            {t("role")}
          </div>
        </div>
        <div style={{ fontSize: 28, color: brandColors.muted }}>{host}</div>
      </div>
    ),
    size,
  );
}
