import { Suspense } from "react";

import AssessmentClient from "./AssessmentClient";

export default function AssessmentPage() {
  return (
    <Suspense
      fallback={
        <div className="px-[clamp(1rem,0.65rem+2.5vw,2rem)] py-12 text-muted-foreground">
          Loading…
        </div>
      }
    >
      <AssessmentClient />
    </Suspense>
  );
}
