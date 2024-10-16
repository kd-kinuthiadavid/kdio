import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="flex flex-col justify-between h-screen px-14 py-16">
      <div className={`flex flex-col`}>
        <h2 className="text-2xl font-semibold">David.</h2>
        <h2 className="text-2xl font-semibold">Kinuthia.</h2>
        <Separator className="my-2 w-[5%] !h-[2px]" />
      </div>
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-y-6 max-w-[70%] 2xl:max-w-[50%]">
          <h1 className="font-semibold text-5xl capitalize">About</h1>
          <p className={`font-normal text-lg`}>
            I’m a product software engineer with a passion for building
            solutions that balance technical excellence and human-centered
            design. My unique value lies in my ability to:
          </p>
          <ul className="list-disc ml-8 text-lg space-y-3">
            <li>
              Translate complex technical challenges into easy-to-use,
              user-driven solutions.
            </li>
            <li>
              Ensure consistency between the product vision and the final user
              experience, from backend architecture to front-end design.
            </li>
            <li>
              Collaborate effectively with product managers, designers, and
              cross-functional teams to deliver impactful, scalable products.
            </li>
          </ul>
          <p className={`font-normal text-lg`}>
            Whether you’re a founder, product manager, or solopreneur, I’m here
            to help you bridge the gap between engineering and user experience,
            ensuring your product doesn’t just work—but works beautifully for
            your users.
          </p>
          <div className="flex gap-x-5">
            <Button className="w-full text-base font-medium capitalize py-6">
              Let&apos;s build together
            </Button>
            <Button
              variant={"outline"}
              className="w-full text-base font-medium capitalize py-6"
            >
              Explore manifesto
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-y-2">
          <a
            href="#"
            className="capitalize font-medium hover:underline hover:underline-offset-4 hover:font-semibold active:underline active:underline-offset-4 active:font-semibold"
          >
            intro
          </a>
          <a
            href="#"
            className="capitalize font-medium hover:underline hover:underline-offset-4 hover:font-semibold active:underline active:underline-offset-4 active:font-semibold"
          >
            about
          </a>
          <a
            href="#"
            className="capitalize font-medium hover:underline hover:underline-offset-4 hover:font-semibold active:underline active:underline-offset-4 active:font-semibold"
          >
            manifesto
          </a>
          <a
            href="#"
            className="capitalize font-medium hover:underline hover:underline-offset-4 hover:font-semibold active:underline active:underline-offset-4 active:font-semibold"
          >
            work
          </a>
          <a
            href="#"
            className="capitalize font-medium hover:underline hover:underline-offset-4 hover:font-semibold active:underline active:underline-offset-4 active:font-semibold"
          >
            experience
          </a>
          <a
            href="#"
            className="capitalize font-medium hover:underline hover:underline-offset-4 hover:font-semibold active:underline active:underline-offset-4 active:font-semibold"
          >
            contact
          </a>
        </div>
      </div>
    </div>
  );
}
