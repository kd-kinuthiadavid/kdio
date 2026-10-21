import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";

export type NoticeTone = "error" | "warning" | "info" | "success";

const tones: Record<NoticeTone, { className: string; Icon: typeof Info }> = {
  error: { className: "border-danger-border bg-danger-muted text-danger", Icon: XCircle },
  warning: { className: "border-warning-border bg-warning-muted text-warning", Icon: AlertTriangle },
  info: { className: "border-info-border bg-info-muted text-info", Icon: Info },
  success: { className: "border-success-border bg-success-muted text-success", Icon: CheckCircle2 },
};

export function Notice({
  tone = "info",
  className,
  children,
}: {
  tone?: NoticeTone;
  className?: string;
  children: React.ReactNode;
}) {
  const { className: toneClass, Icon } = tones[tone];
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2 rounded-md border px-3 py-2 text-sm font-medium",
        toneClass,
        className
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <div>{children}</div>
    </div>
  );
}

/** Inline message under a field or button */
export function FieldMessage({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-xs font-medium text-danger", className)}>{children}</p>;
}
