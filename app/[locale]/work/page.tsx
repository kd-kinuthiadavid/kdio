import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TRACK_RECORD_ENABLED } from "@/components/shared/nav-links";
import { buildTranslatedPageMetadata } from "@/lib/seo";
import TrackRecord from "./_components/TrackRecord";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildTranslatedPageMetadata(locale, "work", "/work");
}

export default function Work() {
  if (!TRACK_RECORD_ENABLED) notFound();

  return <TrackRecord />;
}
