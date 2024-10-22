import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function Contact() {
  const projects = [
    {
      name: "Cal",
      description: "Book a 30-minute chat with me",
      url: "https://cal.com/kinuthiadavid/30min",
      year: "2024",
    },
    {
      name: "Email",
      description: "Shoot me an email",
      url: "mailto:david.kinuthia@gmail.com",
      year: "2024",
    },
    {
      name: "X",
      description: "Let's connect on X",
      url: "mailto:david.kinuthia@gmail.com",
      year: "2024",
    },
    {
      name: "IG",
      description: "Let's be friends?",
      url: "mailto:david.kinuthia@gmail.com",
      year: "2024",
    },
  ];

  return (
    <div className="flex flex-col gap-y-12 w-full max-w-[70%]">
      <h1 className="font-semibold text-5xl capitalize">Contact</h1>
      <div className="flex flex-col">
        <div className="flex flex-col gap-y-3 w-full">
          {projects.map((project, idx) => (
            <div className="flex flex-col gap-1" key={idx}>
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
          ))}
        </div>
      </div>
    </div>
  );
}
