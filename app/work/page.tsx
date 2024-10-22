export default function Work() {
  const projects = [
    {
      name: "Invoicething",
      description:
        "Intuitive invoicing for freelancers, solopreneurs & small businesses",
      techStack:
        "Nextjs, tailwindcss, shadcn/ui, NestJs, supabase, stripe, vercel",
      url: "https://invoicething.com",
      year: "2024",
    },
    {
      name: "Sndscape",
      description: "On-demand spotify highlights",
      techStack: "nextjs, tailwindcss, shadcn/ui, Spotify API, vercel",
      url: "https://sndscape.com",
      year: "2024",
    },
    {
      name: "Waitlist.io",
      description: "Manage your waitlists with ease",
      techStack: "Nextjs, tailwindcss, shadcn/ui, Supabase, Vercel",
      url: "https://waitlist.io",
      year: "2024",
    },
  ];

  const experience = [
    {
      company: "Churpy Inc",
      position: "Senior Fullstack Engineer",
      capacity: "Full-Time",
      timeStamp: "2022 - Present",
    },
    {
      company: "ProductNotes",
      position: "Senior Frontend Engineer",
      capacity: "Contract",
      timeStamp: "2024 - Present",
    },
    {
      company: "Apollo API",
      position: "Senior Frontend Engineer",
      capacity: "Part-Time",
      timeStamp: "2023 - 2024",
    },
    {
      company: "Twende Mobility",
      position: "Frontend Engineer",
      capacity: "Full-Time",
      timeStamp: "2018 - 2022",
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
                  <p className="font-semibold">{project.name}</p>
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
                  <p className="font-semibold">{exp.position}</p>
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
