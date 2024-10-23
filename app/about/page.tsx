import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <div className="flex flex-col gap-y-4 max-w-[70%] 2xl:max-w-[50%]">
      <h1 className="font-semibold text-5xl capitalize">About</h1>
      <p className={`font-normal text-lg`}>
        I’m a product software engineer with a passion for building solutions
        that balance technical excellence and human-centered design. My unique
        value lies in my ability to:
      </p>
      <ul className="list-disc ml-8 text-lg space-y-2">
        <li>
          Translate complex technical challenges into easy-to-use, user-driven
          solutions.
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
        I’m here to help you bridge the gap between engineering and user
        experience, ensuring your product doesn’t just work—but works
        beautifully for your users.
      </p>
      <div className="flex gap-x-5">
        <Button className="w-full text-base font-medium capitalize py-6">
          Let&apos;s build together
        </Button>
        <Button
          variant={"outline"}
          className="w-full text-base font-medium capitalize py-6"
        >
          Explore my method
        </Button>
      </div>
    </div>
  );
}
