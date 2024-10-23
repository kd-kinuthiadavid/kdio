import Link from "next/link";

/* eslint-disable react/no-unescaped-entities */
export default function Method() {
  return (
    <div className="flex flex-col gap-y-12 w-full max-w-[80%]">
      <div className="flex flex-col gap-y-6">
        <h1 className="font-semibold text-5xl capitalize">Method</h1>
        <p className="font-normal text-lg">
          I believe that software can still, and perhaps should, feel magical.
          Therefore, in an attempt to achieve this, my approach to product
          development is guided by a set of foundational principles rooted in
          craftsmanship, quality and design-thinking:
        </p>
      </div>
      <div className="grid gap-6 grid-cols-3 grid-rows-2">
        {/* user-centric */}
        <div className="flex flex-col gap-2">
          <p className="text-xl font-semibold capitalize">user-centric</p>
          <p className="text-base">
            <span className="font-semibold">
              Design for the user, build for the impact.
            </span>{" "}
            I believe that truly impactful products solve real-world issues in
            ways that feel intuitive and natural. By embedding myself in the
            user’s journey, I ensure that my technical solutions translate into
            meaningful experiences. I seek to work with teams that prioritize
            empathy and care deeply about the people using their product.
          </p>
        </div>

        {/* quality */}
        <div className="flex flex-col gap-2">
          <p className="text-xl font-semibold capitalize">quality</p>
          <p className="text-base">
            <span className="font-semibold">
              Yes, ship fast - but don't ship junk.
            </span>{" "}
            While moving fast is important, I believe quality should never be
            sacrificed for speed. I aim for a level of craftsmanship that
            results in reliable, scalable, and elegant solutions. My goal is to
            create products that stand the test of time, not just meet
            deadlines. I want to collaborate with teams that share a passion for
            getting the details right.
          </p>
        </div>

        {/* collaboration */}
        <div className="flex flex-col gap-2">
          <p className="text-xl font-semibold capitalize">collaboration</p>
          <p className="text-base">
            <span className="font-semibold">
              The best products come from diverse minds working together.
            </span>{" "}
            I thrive in cross-functional environments where engineers,
            designers, and product teams come together to build something
            greater than the sum of its parts. I am seeking opportunities where
            collaborative problem-solving and shared-ownership are encouraged
            and prioritized.
          </p>
        </div>

        {/* Iteration */}
        <div className="flex flex-col gap-2">
          <p className="text-xl font-semibold capitalize">Iteration</p>
          <p className="text-base">
            <span className="font-semibold">
              Perfection is found in iteration, not in a single release.
            </span>{" "}
            Great products are born through cycles of learning, iterating, and
            refining. I’m a strong advocate for building MVPs that allow for
            quick feedback and continuous improvement. I look for partners who
            value feedback, understand the importance of iteration, and embrace
            continuous learning.
          </p>
        </div>

        {/* simplicity & clarity */}
        <div className="flex flex-col gap-2">
          <p className="text-xl font-semibold capitalize">
            Simplicity & clarity
          </p>
          <p className="text-base">
            <span className="font-semibold">Simple is powerful.</span> In both
            software architecture and user experience, simplicity is key. I
            believe that the most elegant solutions are often the simplest, and
            that complexity should only be introduced where it provides genuine
            value. I’m looking for teams that appreciate the value of simplicity
            and strive for clarity in both code and design.
          </p>
        </div>

        {/* human-centered intelligent systems */}
        <div className="flex flex-col gap-2">
          <p className="text-xl font-semibold capitalize">
            human-centered intelligent systems
          </p>
          <p className="text-base">
            <span className="font-semibold">
              Design intelligent systems that enhance the human experience - not
              exploit it.
            </span>{" "}
            I believe that the role of AI should be to optimize the world for
            humans. I'm inspired by ethical leaders in technology like Tristan
            Harris and Aza Raskin. I’m looking for teams that prioritize
            human-centered design and development, and that are committed to
            using AI to enhance the user experience.
          </p>
        </div>
      </div>

      <p className="font-normal text-lg">
        If you share these values, then we're already on the same page.{" "}
        <span className="font-medium">
          Let's create something beautifull and impactful together.
        </span>{" "}
        <Link
          href="/contact"
          className="underline underline-offset-4 cursor:pointer hover:font-semibold"
        >
          Let's connect.
        </Link>
      </p>
    </div>
  );
}
