import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function Contact() {
  const contacts = [
    {
      name: "Cal",
      description: "Book a 15-minute intro call",
      url: "https://cal.com/kinuthiadavid/15min",
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
      name: "LinkedIn",
      description: "Let's connect on LinkedIn",
      url: "https://www.linkedin.com/in/david-kinuthia/",
      year: "2024",
    },
  ];

  return (
    <div className="flex flex-col gap-y-12 w-full max-w-[70%]">
      <h1 className="font-semibold text-5xl capitalize">Contact</h1>
      <div className="flex flex-col">
        <div className="grid grid-cols-2 gap-y-3 w-full">
          {contacts.map((contact, idx) => (
            <div className="flex flex-col gap-1" key={idx}>
              <Link
                target="_blank"
                href={contact.url}
                className="flex items-start gap-x-1"
              >
                <p className="font-semibold">{contact.name}</p>
                <ArrowUpRight size={20} className="text-gray-600" />
              </Link>
              <p className="font-medium text-gray-500 w-fit">
                {contact.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
