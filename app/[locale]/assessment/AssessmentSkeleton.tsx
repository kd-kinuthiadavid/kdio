import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Staggered fade-up; CSS-only because it renders before hydration */
const reveal =
  "animate-in fade-in slide-in-from-bottom-1 fill-mode-both duration-500 motion-reduce:animate-none";

const introLines = [
  { width: "w-full", delay: "delay-0" },
  { width: "w-11/12", delay: "delay-[80ms]" },
  { width: "w-4/5", delay: "delay-[160ms]" },
] as const;

const footerLines = [
  { width: "w-full", delay: "delay-[440ms]" },
  { width: "w-5/6", delay: "delay-[500ms]" },
] as const;

type AssessmentSkeletonProps = {
  label: string;
};

/** Placeholder shaped like the intro step, shown until AssessmentClient hydrates */
export default function AssessmentSkeleton({ label }: AssessmentSkeletonProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      className="flex w-full flex-col gap-y-8 sm:gap-y-10"
    >
      <span className="sr-only">{label}</span>

      <div className="flex flex-col gap-y-6">
        <div className="flex flex-col gap-y-2.5 py-1">
          {introLines.map(({ width, delay }) => (
            <div key={width} className={cn(reveal, delay, width)}>
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
        <div className={cn(reveal, "delay-[280ms]")}>
          <Skeleton className="h-12 w-full" />
        </div>
      </div>

      <div className="flex flex-col gap-y-3 border-t border-border pt-8">
        <div className={cn(reveal, "delay-[380ms] w-1/3")}>
          <Skeleton className="h-3.5 w-full" />
        </div>
        {footerLines.map(({ width, delay }) => (
          <div key={width} className={cn(reveal, delay, width)}>
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
