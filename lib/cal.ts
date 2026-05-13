/** Public Cal links — override with env for production */
export function getStrategyCallUrl(): string {
  return (
    process.env.NEXT_PUBLIC_CAL_STRATEGY_URL ||
    "https://cal.com/kinuthiadavid/15min"
  );
}

export function getDiscoveryCallUrl(): string {
  return (
    process.env.NEXT_PUBLIC_CAL_DISCOVERY_URL ||
    "https://cal.com/kinuthiadavid/15min"
  );
}

export function getNurtureGuideUrl(): string {
  return (
    process.env.NEXT_PUBLIC_NURTURE_GUIDE_URL ||
    "https://cal.com/kinuthiadavid/15min"
  );
}

export function calUrlWithPrefill(
  baseUrl: string,
  args: { email: string; name?: string; notes: string }
): string {
  const u = new URL(baseUrl);
  u.searchParams.set("email", args.email);
  if (args.name) u.searchParams.set("name", args.name);
  u.searchParams.set("notes", args.notes.slice(0, 2000));
  return u.toString();
}
