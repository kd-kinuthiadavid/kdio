"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

import AnimatedButton from "@/components/shared/AnimatedButton";
import { navItemVariants } from "../motionVariants";

const Error = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  const t = useTranslations("error");
  const tCommon = useTranslations("common");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col gap-y-6 max-w-[70%] xl:max-w-[50%] w-full">
      <h1 className="font-semibold text-5xl capitalize">{t("title")}</h1>
      <p className="font-normal text-lg">{t("body")}</p>
      <AnimatedButton
        motionVariants={navItemVariants}
        variant={"default"}
        className="w-full text-base font-medium capitalize py-6"
        onClick={() => reset()}
      >
        {tCommon("refresh")}
      </AnimatedButton>
    </div>
  );
};

export default Error;
