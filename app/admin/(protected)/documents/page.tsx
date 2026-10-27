import Link from "next/link";

import { DocumentsTable, payableIds, ReceivablesCards } from "@/components/admin/DocumentsTable";
import { ReminderRunNotice } from "@/components/admin/ReminderStatus";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { DocumentStatus } from "@/db/schema";
import { isoDateOf, todayIso } from "@/lib/documents/dates";
import { getPaymentSummaries, getReceivables } from "@/lib/documents/payments";
import { isDocumentType, listDocumentTypes } from "@/lib/documents/registry";
import { getReminderStates } from "@/lib/documents/reminders-data";
import { listDocuments } from "@/lib/documents/service";
import { INVOICE_REMINDERS_JOB, isStaleDailyRun, lastJobRun } from "@/lib/jobs";
import { cn } from "@/lib/utils";

const STATUSES: DocumentStatus[] = ["draft", "issued", "void"];

function filterHref(params: { type?: string; status?: string }) {
  const q = new URLSearchParams();
  if (params.type) q.set("type", params.type);
  if (params.status) q.set("status", params.status);
  const s = q.toString();
  return s ? `/admin/documents?${s}` : "/admin/documents";
}

function FilterLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-md px-2.5 py-1 text-xs transition-colors hover:bg-accent/60 hover:text-accent-foreground",
        active ? "bg-accent font-medium text-accent-foreground" : "text-muted-foreground"
      )}
    >
      {children}
    </Link>
  );
}

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const type = sp.type && isDocumentType(sp.type) ? sp.type : undefined;
  const status = STATUSES.find((s) => s === sp.status);
  const today = todayIso();
  const rows = await listDocuments({ type, status });
  const ids = payableIds(rows);
  const [payments, receivables, reminders, lastRun] = await Promise.all([
    getPaymentSummaries(ids),
    getReceivables(today),
    getReminderStates(ids, today),
    lastJobRun(INVOICE_REMINDERS_JOB),
  ]);
  const ranToday = lastRun ? isoDateOf(lastRun.ranAt) === today : false;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Documents</h1>
          <p className="text-sm text-muted-foreground">{rows.length} shown</p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/documents/new">New invoice</Link>
        </Button>
      </div>

      <div className="space-y-2">
        <ReceivablesCards receivables={receivables} />
        <ReminderRunNotice run={lastRun} stale={isStaleDailyRun(lastRun)} />
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex flex-wrap gap-1">
          <FilterLink href={filterHref({ status })} active={!type}>
            All types
          </FilterLink>
          {listDocumentTypes().map((d) => (
            <FilterLink
              key={d.type}
              href={filterHref({ type: d.type, status })}
              active={type === d.type}
            >
              {d.label}
            </FilterLink>
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          <FilterLink href={filterHref({ type })} active={!status}>
            Any status
          </FilterLink>
          {STATUSES.map((s) => (
            <FilterLink
              key={s}
              href={filterHref({ type, status: s })}
              active={status === s}
            >
              <span className="capitalize">{s}</span>
            </FilterLink>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="overflow-x-auto pt-6">
          {rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">No documents yet.</p>
          ) : (
            <DocumentsTable
              rows={rows}
              payments={payments}
              today={today}
              reminders={reminders}
              remindersRanToday={ranToday}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
