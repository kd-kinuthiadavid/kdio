"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

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
        "Intuitive invoicing for freelancers, solopreneurs & small businesses.",
      techStack: [
        "Nextjs",
        "Tailwindcss",
        "Shadcn/ui",
        "NestJs",
        "Supabase",
        "Stripe",
        "Vercel",
        "Docker",
        "Sentry",
        "React Email",
        "React PDF",
        "Trigger.dev",
        "Zustand",
      ],
      url: "https://invoicething.vercel.app/",
      year: "2024",
    },
    {
      name: "Sndscape",
      description: "On-demand Spotify highlights. Discover how you listen.",
      techStack: [
        "Nextjs",
        "Tailwindcss",
        "Shadcn/ui",
        "Spotify API",
        "Vercel",
        "Framer Motion",
      ],
      url: "https://sndscp.vercel.app/",
      year: "2024",
    },
    {
      name: "Waitlist.io",
      description: "Manage your waitlists with ease.",
      techStack: ["Nextjs", "Tailwindcss", "Shadcn/ui", "Supabase", "Vercel"],
      url: "https://waitlist.thing",
      year: "2024",
    },
  ];

  const experience = [
    {
      company: "Churpy Inc",
      position: "Senior Fullstack Engineer",
      capacity: "Full-Time",
      timeStamp: "2022 - Present",
      url: "https://www.churpy.co/",
    },
    {
      company: "ProductNotes",
      position: "Senior Frontend Engineer",
      capacity: "Contract",
      timeStamp: "2024 - Present",
      url: "https://www.product-notes.com/",
    },
    {
      company: "Apollo API",
      position: "Senior Frontend Engineer",
      capacity: "Part-Time",
      timeStamp: "2023 - 2024",
      url: "https://www.apolloapi.io/",
    },
    {
      company: "Twende Mobility",
      position: "Frontend Engineer",
      capacity: "Full-Time",
      timeStamp: "2018 - 2022",
      url: "https://www.linkedin.com/company/twendemobility/about/",
    },
  ];
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col gap-y-12 w-full md:max-w-[70%]"
    >
      <motion.h1
        variants={itemVariants}
        className="font-semibold text-4xl md:text-5xl capitalize"
      >
        Work
      </motion.h1>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex flex-wrap md:flex-nowrap justify-between gap-x-32 gap-y-16 w-full"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col gap-y-3 w-full"
        >
          <motion.h2
            animate={navItemVariants}
            className="font-semibold text-2xl capitalize"
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
                className="flex flex-wrap md:flex-nowrap gap-x-6 items-start text-base w-full"
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
                    className="flex items-start gap-x-1"
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
            className="font-semibold text-2xl capitalize"
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
                className="flex flex-wrap md:flex-nowrap gap-x-6 items-start text-base"
                key={idx}
              >
                <motion.p
                  variants={navItemVariants}
                  className="text-gray-500 font-medium min-w-[110px]"
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
                    className="flex items-start gap-x-1"
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
  );
}
