import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function Work() {
  const projects = [
    {
      name: "Invoicething",
      description:
        "Intuitive invoicing for freelancers, solopreneurs & small businesses",
      techStack:
        "Nextjs, tailwindcss, shadcn/ui, NestJs, supabase, stripe, vercel",
      url: "https://invoicething.vercel.app/",
      year: "2024",
    },
    {
      name: "Sndscape",
      description: "On-demand spotify highlights",
      techStack: "nextjs, tailwindcss, shadcn/ui, Spotify API, vercel",
      url: "https://sndscp.vercel.app/",
      year: "2024",
    },
    {
      name: "Waitlist.io",
      description: "Manage your waitlists with ease",
      techStack: "Nextjs, tailwindcss, shadcn/ui, Supabase, Vercel",
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
    <div className="flex flex-col gap-y-12 w-full max-w-[70%]">
      <h1 className="font-semibold text-5xl capitalize">Work</h1>
      <div className="flex justify-between gap-x-32 w-full">
        <div className="flex flex-col gap-y-3 w-full">
          <h2 className="font-semibold text-2xl capitalize">projects</h2>
          <div className="flex flex-col gap-y-3 w-full">
            {projects.map((project, idx) => (
              <div
                className="flex gap-x-6 items-start text-base w-full"
                key={idx}
              >
                <p className="text-gray-500 font-medium">{project.year}</p>
                <div className="flex flex-col">
                  <Link
                    target="_blank"
                    href={project.url}
                    className="flex items-start gap-x-1"
                  >
                    <p className="font-semibold">{project.name}</p>
                    <ArrowUpRight size={20} className="text-gray-600" />
                  </Link>
                  <p className="font-medium text-gray-500 w-fit">
                    {project.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-y-6 w-full">
          <h2 className="font-semibold text-2xl capitalize">experience</h2>
          <div className="flex flex-col gap-y-3">
            {experience.map((exp, idx) => (
              <div className="flex gap-x-6 items-start text-base" key={idx}>
                <p className="text-gray-500 font-medium min-w-[110px]">
                  {exp.timeStamp}
                </p>
                <div className="flex flex-col">
                  <Link
                    target="_blank"
                    href={exp.url}
                    className="flex items-start gap-x-1"
                  >
                    <p className="font-semibold">{exp.position}</p>
                    <ArrowUpRight size={20} className="text-gray-600" />
                  </Link>
                  <p className="font-medium text-gray-500">
                    {`${exp.company} . ${exp.capacity}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
