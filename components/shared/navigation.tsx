"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();
  console.log("------------", pathname);
  return (
    <div className="flex flex-col gap-y-2">
      <Link
        prefetch={true}
        href="/"
        className={`capitalize font-medium hover:underline hover:underline-offset-4 hover:font-semibold active:underline active:underline-offset-4 active:font-semibold ${
          pathname === "/"
            ? "font-semibold underline underline-offset-4 text-accent-foreground decoration-accent-foreground"
            : ""
        }`}
      >
        intro
      </Link>
      <Link
        prefetch={true}
        href="/about"
        className={`capitalize font-medium hover:underline hover:underline-offset-4 hover:font-semibold active:underline active:underline-offset-4 active:font-semibold ${
          pathname === "/about"
            ? "font-semibold underline underline-offset-4 text-accent-foreground decoration-accent-foreground"
            : ""
        }`}
      >
        about
      </Link>
      <Link
        prefetch={true}
        href="/manifesto"
        className={`capitalize font-medium hover:underline hover:underline-offset-4 hover:font-semibold active:underline active:underline-offset-4 active:font-semibold ${
          pathname === "/manifesto"
            ? "font-semibold underline underline-offset-4 text-accent-foreground decoration-accent-foreground"
            : ""
        }`}
      >
        manifesto
      </Link>
      <Link
        prefetch={true}
        href="/work"
        className={`capitalize font-medium hover:underline hover:underline-offset-4 hover:font-semibold active:underline active:underline-offset-4 active:font-semibold ${
          pathname === "/work"
            ? "font-semibold underline underline-offset-4 text-accent-foreground decoration-accent-foreground"
            : ""
        }`}
      >
        work
      </Link>
      <Link
        prefetch={true}
        href="/experience"
        className={`capitalize font-medium hover:underline hover:underline-offset-4 hover:font-semibold active:underline active:underline-offset-4 active:font-semibold ${
          pathname === "/experience"
            ? "font-semibold underline underline-offset-4 text-accent-foreground decoration-accent-foreground"
            : ""
        }`}
      >
        experience
      </Link>
      <Link
        prefetch={true}
        href="/contact"
        className={`capitalize font-medium hover:underline hover:underline-offset-4 hover:font-semibold active:underline active:underline-offset-4 active:font-semibold ${
          pathname === "/contact"
            ? "font-semibold underline underline-offset-4 text-accent-foreground decoration-accent-foreground"
            : ""
        }`}
      >
        contact
      </Link>
    </div>
  );
}
