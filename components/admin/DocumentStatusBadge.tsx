import { cn } from "@/lib/utils";

const tones: Record<string, string> = {
  draft: "border-border bg-transparent text-muted-foreground",
  issued: "border-transparent bg-primary text-primary-foreground",
  void: "border-danger-border bg-danger-muted text-danger",
};

export function DocumentStatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium capitalize",
        tones[status] ?? tones.draft,
        className
      )}
    >
      {status.replace("_", " ")}
    </span>
  );
}
