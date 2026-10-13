import { notFound } from "next/navigation";

import { TRACK_RECORD_ENABLED } from "@/components/shared/nav-links";
import TrackRecord from "./_components/TrackRecord";

export default function Work() {
  if (!TRACK_RECORD_ENABLED) notFound();

  return <TrackRecord />;
}
