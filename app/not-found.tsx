import type { Metadata } from "next";
import Link from "next/link";

import ContentSurface from "@/components/shared/ContentSurface";
import HtmlShell from "@/components/shared/HtmlShell";
import { routing } from "@/i18n/routing";

export const metadata: Metadata = {
  title: "404 - Page not found",
  description: "The page you are looking for does not exist.",
};

/** 404 for URLs outside `[locale]` and `admin`; localized 404s use `app/[locale]/not-found.tsx` */
export default function RootNotFound() {
  return (
    <HtmlShell lang={routing.defaultLocale}>
      <main className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <ContentSurface className="w-full min-w-0 max-w-[min(100%,clamp(20rem,88vw,40rem))]">
          <div className="flex flex-col gap-y-4 sm:gap-y-6">
            <h1 className="text-balance font-semibold text-4xl leading-tight sm:text-5xl">
              Page not found
            </h1>
            <p className="font-normal text-base leading-relaxed sm:text-lg">
              The page you are looking for does not exist.
            </p>
            <Link
              href={`/${routing.defaultLocale}`}
              className="w-fit text-base font-medium text-primary underline underline-offset-4 hover:text-accent-foreground"
            >
              Go to the homepage
            </Link>
          </div>
        </ContentSurface>
      </main>
    </HtmlShell>
  );
}
