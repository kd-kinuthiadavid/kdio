"use client";

import { Accordion } from "@/components/ui/accordion";
import { containerVariants } from "@/app/motionVariants";
import ServiceItem, { type ServiceContent } from "./ServiceItem";

interface ServicesListProps {
  services: ServiceContent[];
}

export default function ServicesList({ services }: ServicesListProps) {
  return (
    <Accordion
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      type="single"
      collapsible
      className="grid gap-4 md:grid-cols-1"
    >
      {services.map((service) => (
        <ServiceItem key={service.id} content={service} />
      ))}
    </Accordion>
  );
}
