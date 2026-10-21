import { cn } from "@/lib/utils";

/** A full-width page section separated from the one above by a rule. */
export function Section({
  title,
  actions,
  children,
  className,
}: {
  title: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-4 border-t border-border pt-6", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-semibold">{title}</h2>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}

/** Key figures laid out side by side, wrapping on narrow screens. */
export function StatStrip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <dl
      className={cn(
        "grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-x-6 gap-y-4 border-t border-border pt-6 text-sm",
        className
      )}
    >
      {children}
    </dl>
  );
}

export function Stat({
  label,
  children,
  hint,
  emphasis,
  className,
}: {
  label: string;
  children: React.ReactNode;
  hint?: React.ReactNode;
  emphasis?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <dt className="text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "mt-0.5 break-words tabular-nums",
          emphasis ? "text-lg font-semibold" : "font-medium"
        )}
      >
        {children ?? <span className="font-normal text-muted-foreground">—</span>}
      </dd>
      {hint ? <dd className="mt-0.5 text-xs text-muted-foreground">{hint}</dd> : null}
    </div>
  );
}
