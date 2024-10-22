import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col gap-y-6  max-w-[60%] 2xl:max-w-[40%]">
      <h1 className="font-semibold text-5xl capitalize">
        Crafting Scalable Solutions Where Engineering Meets Empathy.
      </h1>
      <p className={`font-normal text-xl max-w-[95%]`}>
        Hello, my name is David Kinuthia. I am a product software engineer based
        in Nairobi. I blend technical expertise and user empathy to build
        products that are reliable, intuitive, and meaningful— delivering
        exceptional experiences from backend to interface.
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
  );
}
