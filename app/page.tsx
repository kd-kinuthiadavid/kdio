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
        <div className="flex flex-col gap-y-6  max-w-[60%] 2xl:max-w-[40%]">
          <h1 className="font-semibold text-5xl capitalize">
            Crafting Scalable Solutions Where Engineering Meets Empathy.
          </h1>
          <p className={`font-normal text-xl max-w-[95%]`}>
            Hello, my name is David Kinuthia. I am a product software engineer
            based in Nairobi. I blend technical expertise and user empathy to
            build products that are reliable, intuitive, and meaningful—
            delivering exceptional experiences from backend to interface.
          </p>
          <div className="flex gap-x-5">
            <Button className="w-full text-base font-medium capitalize py-6">
              Let&apos;s build together
            </Button>
            <Button
              variant={"outline"}
              className="w-full text-base font-medium capitalize py-6"
            >
              Explore my work
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
