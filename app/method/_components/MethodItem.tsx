"use client";

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
    <div className="flex flex-col gap-2">
      <p className="text-xl font-semibold capitalize">{title}</p>
      <p className="text-base">
        <span className="font-semibold">{subTitle}</span> {description}
      </p>
    </div>
  );
}
