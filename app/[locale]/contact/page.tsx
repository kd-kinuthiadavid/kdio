import * as motion from "framer-motion/client";
import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

import ContentSurface from "@/components/shared/ContentSurface";
import {
  containerVariants,
  itemVariants,
  navItemVariants,
} from "../../motionVariants";

export default async function Contact() {
  const t = await getTranslations("contact");

  const contacts = [
    {
      name: "Cal",
      description: t("calDescription"),
      url: "https://cal.com/kinuthiadavid/15min",
      year: "2024",
    },
    {
      name: "Email",
      description: t("emailDescription"),
      url: "mailto:david.kinuthia@gmail.com",
      year: "2024",
    },
    {
      name: "LinkedIn",
      description: t("linkedinDescription"),
      url: "https://www.linkedin.com/in/david-kinuthia/",
      year: "2024",
    },
  ];

  return (
    <ContentSurface className="w-full min-w-0 max-w-[min(100%,clamp(22rem,90vw,48rem))]">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex w-full flex-col gap-y-8 sm:gap-y-10 md:gap-y-12"
      >
        <motion.h1
          variants={itemVariants}
          className="text-balance font-semibold text-4xl leading-tight sm:text-5xl"
        >
          {t("title")}
        </motion.h1>
        <motion.p
          variants={navItemVariants}
          className="max-w-prose font-normal text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          {t("intro")}
        </motion.p>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col"
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid w-full grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 sm:gap-y-5"
          >
            {contacts.map((contact, idx) => (
              <motion.div
                variants={navItemVariants}
                className="flex min-w-0 flex-col gap-1"
                key={idx}
              >
                <Link
                  target="_blank"
                  href={contact.url}
                  className="flex min-w-0 items-start gap-x-1"
                >
                  <p className="font-semibold">{contact.name}</p>
                  <ArrowUpRight
                    size={20}
                    className="shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                </Link>
                <p className="w-fit max-w-full font-medium text-muted-foreground">
                  {contact.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </ContentSurface>
  );
}
