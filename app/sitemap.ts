import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { localizedAlternates, localizedUrl, PUBLIC_PATHS } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return PUBLIC_PATHS.flatMap((path) => {
    const languages = localizedAlternates(path);
    return routing.locales.map((locale) => ({
      url: localizedUrl(locale, path),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : path === "/services" ? 0.9 : 0.7,
      alternates: { languages },
    }));
  });
}
