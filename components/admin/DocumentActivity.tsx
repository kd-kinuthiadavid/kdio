import { ChevronRight } from "lucide-react";

import type { DocumentEventRow } from "@/db/schema";
import { formatDateTime } from "@/lib/documents/dates";
import { formatMoney } from "@/lib/documents/money";
import { stageLabel } from "@/lib/documents/reminders";

const LABELS: Record<string, string> = {
  created: "Draft created",
  updated: "Draft updated",
  issued: "Issued",
  voided: "Voided",
  pdf_stored: "PDF stored",
  payment_recorded: "Payment recorded",
  payment_removed: "Payment removed",
  sent: "Sent by email",
  reminder_sent: "Reminder sent",
  reminders_paused: "Reminders paused",
  reminders_resumed: "Reminders resumed",
};

function detail(event: DocumentEventRow): string | null {
  const p = (event.payload ?? {}) as Record<string, unknown>;
  if (typeof p.amountMinor === "number" && typeof p.currency === "string") {
    return formatMoney(p.amountMinor, p.currency);
  }
  if (event.type === "issued" && typeof p.number === "string") return p.number;
  if (event.type === "voided" && typeof p.reason === "string") return p.reason;
  if (
    (event.type === "sent" || event.type === "reminder_sent") &&
    Array.isArray(p.to)
  ) {
    const cc =
      Array.isArray(p.cc) && p.cc.length ? ` (cc ${p.cc.join(", ")})` : "";
    const to = `${p.to.join(", ")}${cc}`;
    if (event.type === "sent") return to;
    const stage = typeof p.stage === "string" ? stageLabel(p.stage) : "Manual";
    return `${stage} · ${p.trigger === "auto" ? "automatic" : "manual"} · to ${to}`;
  }
  if (event.type === "pdf_stored" && typeof p.sha256 === "string") {
    return `sha256 ${p.sha256.slice(0, 12)}…`;
  }
  return null;
}

/** The audit trail, collapsed by default. */
export function DocumentActivity({ events }: { events: DocumentEventRow[] }) {
  const latest = events[0];
  return (
    <details className="group border-t border-border pt-6">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-sm text-base font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
        <ChevronRight
          aria-hidden
          className="size-4 shrink-0 transition-transform group-open:rotate-90"
        />
        Activity
        <span className="text-sm font-normal text-muted-foreground">
          {latest
            ? `${events.length} event${events.length === 1 ? "" : "s"}, latest ${formatDateTime(latest.createdAt)}`
            : "none yet"}
        </span>
      </summary>
      {events.length ? (
        <ol className="mt-4 space-y-2 text-sm">
          {events.map((e) => {
            const extra = detail(e);
            return (
              <li
                key={e.id}
                className="grid gap-x-4 border-l-2 border-border pl-3 sm:grid-cols-[11rem_1fr]"
              >
                <span className="text-muted-foreground tabular-nums">
                  {formatDateTime(e.createdAt)} · {e.actor}
                </span>
                <span className="font-medium">
                  {LABELS[e.type] ?? e.type}
                  {extra ? <span className="font-normal text-muted-foreground">: {extra}</span> : null}
                </span>
              </li>
            );
          })}
        </ol>
      ) : null}
    </details>
  );
}
