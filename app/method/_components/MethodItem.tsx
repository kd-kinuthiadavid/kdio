"use client";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Content {
  title: string;
  subTitle: string;
  description: string;
}

interface MethodItemProps {
  content: Content;
}

export default function MethodItem({
  content: { title, subTitle, description },
}: MethodItemProps) {
  return (
    <AccordionItem
      value={`${title}-${subTitle}`}
      className="border border-black/40 px-4 rounded-md hover:bg-foreground/5"
    >
      <AccordionTrigger
        showIcon={false}
        className="flex items-start group data-[state=open]:visible"
      >
        <div className="flex items-start flex-col">
          <p className="text-xl text-left font-semibold capitalize">{title}</p>
          <p className="text-base text-left font-normal capitalize group-data-[state=open]:hidden">
            {subTitle}
          </p>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <p className="text-base">
          <span className="font-semibold">{subTitle}</span> {description}
        </p>
      </AccordionContent>
    </AccordionItem>
  );
}
