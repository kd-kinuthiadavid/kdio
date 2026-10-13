"use client";

import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";

export interface ServiceTag {
  id: string;
  name: string;
}

interface ServiceTagsProps {
  label: string;
  services: ServiceTag[];
}

export default function ServiceTags({ label, services }: ServiceTagsProps) {
  if (services.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {services.map((service) => (
        <Link
          key={service.id}
          href="/services"
          className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Badge
            variant="outline"
            className="font-medium transition-colors hover:bg-accent/40"
          >
            {service.name}
          </Badge>
        </Link>
      ))}
    </div>
  );
}
