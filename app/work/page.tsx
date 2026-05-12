"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import ContentSurface from "@/components/shared/ContentSurface";
import { Badge } from "@/components/ui/badge";
import {
  containerVariants,
  itemVariants,
  navItemVariants,
} from "../motionVariants";

export default function Work() {
  const MotionLink = motion.create(Link);
  const MotionBadge = motion.create(Badge);
  const projects = [
    {
      name: "Invoicething",
      description:
        "Invoicing built for service professionals & businesses. Designed for simplicity.",
      techStack: [
        "Nextjs",
        "Tailwindcss",
        "Shadcn/ui",
        "NestJs",
        "Supabase",
        "Stripe",
        "Polar.sh",
        "Vercel",
        "Docker",
        "Sentry",
        "React Email",
        "React PDF",
        "Zustand",
      ],
      url: "https://invoicething.co/",
      year: "2024",
    },
  ];

  const experience = [
    {
      company: "Churpy Inc",
      position: "Lead Product Engineer",
      capacity: "Full-Time",
      timeStamp: "Aug, 2022 - Present",
      url: "https://www.churpy.co/",
    },
    {
      company: "ProductNotes",
      position: "Senior Fullstack Engineer",
      capacity: "Contract",
      timeStamp: "Oct, 2024 - Mar, 2025",
      url: "https://www.product-notes.com/",
    },
    {
      company: "Apollo API",
      position: "Senior Fullstack Engineer",
      capacity: "Part-Time",
      timeStamp: "Apr, 2023 - Mar, 2024",
      url: "https://www.apolloapi.io/",
    },
    {
      company: "Twende Mobility",
      position: "Frontend Engineer",
      capacity: "Full-Time",
      timeStamp: "Oct, 2018 - Jul, 2022",
      url: "https://www.linkedin.com/company/twendemobility/about/",
    },
  ];
  return (
    <ContentSurface className="w-full min-w-0 max-w-[min(100%,clamp(22rem,92vw,72rem))]">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex w-full flex-col gap-y-8 sm:gap-y-10 md:gap-y-12"
      >
      <motion.h1
        variants={itemVariants}
        className="text-balance font-semibold text-3xl capitalize leading-tight sm:text-4xl md:text-5xl"
      >
        Work
      </motion.h1>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex w-full flex-col flex-wrap gap-x-4 gap-y-12 sm:gap-x-6 sm:gap-y-14 md:flex-nowrap md:justify-between md:gap-x-8 lg:gap-x-16 xl:gap-x-24 2xl:gap-x-32"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col gap-y-3 w-full"
        >
          <motion.h2
            animate={navItemVariants}
            className="font-semibold text-xl capitalize sm:text-2xl"
          >
            projects
          </motion.h2>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col gap-y-3 w-full"
          >
            {projects.map((project, idx) => (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="flex min-w-0 flex-wrap md:flex-nowrap gap-x-4 gap-y-2 text-base sm:gap-x-6 md:items-start w-full"
                key={idx}
              >
                <motion.p
                  variants={navItemVariants}
                  className="text-gray-500 font-medium"
                >
                  {project.year}
                </motion.p>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                  className="flex flex-col gap-1"
                >
                  <MotionLink
                    variants={navItemVariants}
                    target="_blank"
                    href={project.url}
                    className="flex min-w-0 items-start gap-x-1"
                  >
                    <p className="font-semibold">{project.name}</p>
                    <ArrowUpRight size={20} className="text-gray-600" />
                  </MotionLink>
                  <motion.p
                    variants={navItemVariants}
                    className="font-medium text-gray-500 w-fit"
                  >
                    {project.description}
                  </motion.p>
                  <motion.div
                    animate={navItemVariants}
                    className="flex flex-wrap gap-1"
                  >
                    {project.techStack.map((tech, idx) => (
                      <MotionBadge
                        variants={navItemVariants}
                        variant={"outline"}
                        key={idx}
                        className="rounded-xl font-medium"
                      >
                        {tech}
                      </MotionBadge>
                    ))}
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col gap-y-6 w-full"
        >
          <motion.h2
            variants={navItemVariants}
            className="font-semibold text-xl capitalize sm:text-2xl"
          >
            experience
          </motion.h2>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col gap-y-3"
          >
            {experience.map((exp, idx) => (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="flex min-w-0 flex-wrap md:flex-nowrap gap-x-4 gap-y-2 text-base sm:gap-x-6 md:items-start"
                key={idx}
              >
                <motion.p
                  variants={navItemVariants}
                  className="w-full shrink-0 text-gray-500 font-medium sm:w-auto sm:min-w-[7.5rem] md:min-w-[110px]"
                >
                  {exp.timeStamp}
                </motion.p>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                  className="flex flex-col"
                >
                  <MotionLink
                    variants={navItemVariants}
                    target="_blank"
                    href={exp.url}
                    className="flex min-w-0 items-start gap-x-1"
                  >
                    <p className="font-semibold">{exp.position}</p>
                    <ArrowUpRight size={20} className="text-gray-600" />
                  </MotionLink>
                  <motion.p
                    variants={navItemVariants}
                    className="font-medium text-gray-500"
                  >
                    {`${exp.company} . ${exp.capacity}`}
                  </motion.p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
    </ContentSurface>
  );
}
