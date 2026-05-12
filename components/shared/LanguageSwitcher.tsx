"use client";

import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { routing } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const localeCodes: Record<(typeof routing.locales)[number], string> = {
  en: "EN",
  es: "ES",
  fr: "FR",
  de: "DE",
  pt: "PT",
  sw: "SW",
};

export default function LanguageSwitcher({
  className,
  align = "end",
}: {
  className?: string;
  align?: "start" | "center" | "end";
}) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("language");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex h-10 items-center justify-center gap-1.5 rounded-md border border-border/60 bg-background/80 px-2.5 text-sm font-medium text-foreground shadow-sm outline-none ring-offset-background backdrop-blur-sm transition-colors hover:bg-accent/15 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            className,
          )}
          aria-label={t("label")}
        >
          <Globe className="size-4 shrink-0 opacity-80" aria-hidden />
          <span className="tabular-nums tracking-wide">
            {localeCodes[locale as keyof typeof localeCodes] ?? locale.toUpperCase()}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="min-w-[10.5rem]">
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          {t("label")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {routing.locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            className={cn(
              "cursor-pointer gap-2",
              loc === locale && "bg-accent/40 focus:bg-accent/50",
            )}
            onClick={() => router.replace(pathname, { locale: loc })}
          >
            <span className="flex-1">{t(loc)}</span>
            {loc === locale ? (
              <span className="text-xs text-muted-foreground" aria-hidden>
                ✓
              </span>
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
