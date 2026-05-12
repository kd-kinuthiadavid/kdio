"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/** Baseline: follow OS until the user picks light/dark via the toggle (stored in localStorage). */
const DEFAULT_THEME_PROPS = {
  attribute: "class" as const,
  defaultTheme: "system",
  enableSystem: true,
  enableColorScheme: true,
  disableTransitionOnChange: true,
} satisfies Partial<React.ComponentProps<typeof NextThemesProvider>>;

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...DEFAULT_THEME_PROPS} {...props}>
      {children}
    </NextThemesProvider>
  );
}
