import type { Metadata } from "next";
import "./globals.css";
import { raleway } from "./fonts";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export const metadata: Metadata = {
  title: "David Kinuthia",
  description: "Design-led and user-centered product engineer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${raleway.className} antialiased`}>
        <div className="flex flex-col justify-between h-screen px-14 py-16">
          <div className={`flex flex-col`}>
            <h2 className="text-2xl font-semibold">David.</h2>
            <h2 className="text-2xl font-semibold">Kinuthia.</h2>
            <Separator className="my-2 w-[5%] !h-[2px]" />
          </div>
          <div className="flex items-end justify-between">
            {children}

            <div className="flex flex-col gap-y-2">
              <Link
                href="/"
                className="capitalize font-medium hover:underline hover:underline-offset-4 hover:font-semibold active:underline active:underline-offset-4 active:font-semibold"
              >
                intro
              </Link>
              <Link
                href="/about"
                className="capitalize font-medium hover:underline hover:underline-offset-4 hover:font-semibold active:underline active:underline-offset-4 active:font-semibold"
              >
                about
              </Link>
              <Link
                href="/manifesto"
                className="capitalize font-medium hover:underline hover:underline-offset-4 hover:font-semibold active:underline active:underline-offset-4 active:font-semibold"
              >
                manifesto
              </Link>
              <Link
                href="/work"
                className="capitalize font-medium hover:underline hover:underline-offset-4 hover:font-semibold active:underline active:underline-offset-4 active:font-semibold"
              >
                work
              </Link>
              <Link
                href="/experience"
                className="capitalize font-medium hover:underline hover:underline-offset-4 hover:font-semibold active:underline active:underline-offset-4 active:font-semibold"
              >
                experience
              </Link>
              <Link
                href="/contact"
                className="capitalize font-medium hover:underline hover:underline-offset-4 hover:font-semibold active:underline active:underline-offset-4 active:font-semibold"
              >
                contact
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
