"use client";
import AnimatedButton from "@/components/shared/AnimatedButton";
import React, { useEffect } from "react";
import { navItemVariants } from "./motionVariants";

const Error = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);
  return (
    <div className="flex flex-col gap-y-6 max-w-[70%] xl:max-w-[50%] w-full">
      <h1 className="font-semibold text-5xl capitalize">
        Something went wrong!
      </h1>
      <p className={`font-normal text-lg`}>
        An error occurred while loading this page. Please try again later.
      </p>
      <AnimatedButton
        motionVariants={navItemVariants}
        variant={"default"}
        className="w-full text-base font-medium capitalize py-6"
        onClick={() => reset()}
      >
        Refresh
      </AnimatedButton>
    </div>
  );
};

export default Error;
