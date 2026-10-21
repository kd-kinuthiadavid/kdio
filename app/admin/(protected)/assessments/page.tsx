import { desc } from "drizzle-orm";

import SubmissionsTierChart from "@/components/admin/SubmissionsTierChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { assessmentSubmissions } from "@/db/schema";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminAssessmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id: highlightId } = await searchParams;
  let rows: (typeof assessmentSubmissions.$inferSelect)[] = [];
  try {
    rows = await getDb()
      .select()
      .from(assessmentSubmissions)
      .orderBy(desc(assessmentSubmissions.createdAt))
      .limit(150);
  } catch (e) {
    console.error("admin assessments db", e);
  }

  const byTier: Record<string, number> = {};
  for (const r of rows) {
    if (r.status === "completed" && r.tier) {
      byTier[r.tier] = (byTier[r.tier] || 0) + 1;
    }
  }
  const chartData = Object.entries(byTier).map(([tier, count]) => ({
    tier,
    count,
  }));

  const completed = rows.filter((r) => r.status === "completed").length;
  const drafts = rows.filter((r) => r.status === "draft").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Assessments</h1>
        <p className="text-sm text-muted-foreground">
          {completed} completed · {drafts} drafts (last {rows.length} rows)
        </p>
      </div>

      {chartData.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Completed by tier</CardTitle>
            <CardDescription>Distribution of tier bands for completed submissions.</CardDescription>
          </CardHeader>
          <CardContent>
            <SubmissionsTierChart data={chartData} />
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Recent submissions</CardTitle>
          <CardDescription>Includes drafts and completed rows.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Created</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Service</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow
                  key={r.id}
                  className={highlightId === r.id ? "bg-accent/60" : undefined}
                >
                  <TableCell className="whitespace-nowrap text-xs sm:text-sm">
                    {r.createdAt instanceof Date
                      ? r.createdAt.toISOString().slice(0, 16)
                      : String(r.createdAt).slice(0, 16)}
                  </TableCell>
                  <TableCell className="max-w-[180px] truncate text-sm">{r.email ?? "—"}</TableCell>
                  <TableCell>{r.status}</TableCell>
                  <TableCell>{r.totalScore ?? "—"}</TableCell>
                  <TableCell>{r.tier ?? "—"}</TableCell>
                  <TableCell className="max-w-[140px] truncate text-sm">
                    {r.serviceId ?? "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
