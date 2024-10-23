import type { Metadata } from "next";


import "./globals.css";
import { raleway } from "./fonts";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/shared/navigation";



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
            <h2 className="text-2xl font-semibold">David Kinuthia.</h2>
            <Separator className="my-2 w-[5%] !h-[2px]" />
          </div>
          <div className="flex items-center justify-between">
            {children}

            <Navigation />
          </div>
        </div>
      </body>
    </html>
  );
}
