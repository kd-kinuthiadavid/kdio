"use client";

import { motion } from "framer-motion";

import { containerVariants, itemVariants } from "@/app/motionVariants";

export interface TestimonialContent {
  id: string;
  quote: string;
  name: string;
  title: string;
  company: string;
}

interface TestimonialsProps {
  heading: string;
  items: TestimonialContent[];
}

export default function Testimonials({ heading, items }: TestimonialsProps) {
  if (items.length === 0) return null;

  return (
    <motion.section
      variants={containerVariants}
      className="flex flex-col gap-y-6"
    >
      <motion.h2
        variants={itemVariants}
        className="font-semibold text-xl leading-tight sm:text-2xl"
      >
        {heading}
      </motion.h2>
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5"
      >
        {items.map((item) => (
          <motion.figure
            key={item.id}
            variants={itemVariants}
            className="flex flex-col gap-y-4 rounded-lg border border-border bg-background/40 p-5 sm:p-6"
          >
            <blockquote className="leading-relaxed text-foreground/85">
              “{item.quote}”
            </blockquote>
            <figcaption className="text-sm">
              <span className="font-semibold">{item.name}</span>
              <span className="text-muted-foreground">
                {" "}
                · {item.title}, {item.company}
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </motion.div>
    </motion.section>
  );
}
