import type { Metadata } from "next";
import type { ReactNode } from "react";

import { buildTranslatedPageMetadata } from "@/lib/seo";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildTranslatedPageMetadata(locale, "method", "/method");
}

export default function MethodLayout({ children }: { children: ReactNode }) {
  return children;
}
