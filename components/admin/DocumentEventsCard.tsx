import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DocumentEventRow } from "@/db/schema";
import { formatDateTime } from "@/lib/documents/dates";
import { formatMoney } from "@/lib/documents/money";

const LABELS: Record<string, string> = {
  created: "Draft created",
  updated: "Draft updated",
  issued: "Issued",
  voided: "Voided",
  pdf_stored: "PDF stored",
  payment_recorded: "Payment recorded",
  payment_removed: "Payment removed",
  sent: "Sent by email",
};

function detail(event: DocumentEventRow): string | null {
  const p = (event.payload ?? {}) as Record<string, unknown>;
  if (typeof p.amountMinor === "number" && typeof p.currency === "string") {
    return formatMoney(p.amountMinor, p.currency);
  }
  if (event.type === "issued" && typeof p.number === "string") return p.number;
  if (event.type === "voided" && typeof p.reason === "string") return p.reason;
  if (event.type === "sent" && Array.isArray(p.to)) {
    const cc = Array.isArray(p.cc) && p.cc.length ? ` (cc ${p.cc.join(", ")})` : "";
    return `${p.to.join(", ")}${cc}`;
  }
  if (event.type === "pdf_stored" && typeof p.sha256 === "string") {
    return `sha256 ${p.sha256.slice(0, 12)}…`;
  }
  return null;
}

export function DocumentEventsCard({ events }: { events: DocumentEventRow[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground">No activity yet.</p>
        ) : (
          <ol className="space-y-3 text-sm">
            {events.map((e) => {
              const extra = detail(e);
              return (
                <li key={e.id} className="flex flex-col gap-0.5 border-l-2 border-border pl-3">
                  <span className="font-medium">
                    {LABELS[e.type] ?? e.type}
                    {extra ? <span className="font-normal text-muted-foreground">: {extra}</span> : null}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDateTime(e.createdAt)} · {e.actor}
                  </span>
                </li>
              );
            })}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
