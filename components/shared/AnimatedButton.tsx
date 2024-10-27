"use client";

import { motion, type Variants } from "framer-motion";
import { Button } from "../ui/button";

const MotionButton = motion(Button);

interface AnimatedButtonProps {
  className?: string;
  children: React.ReactNode;
  motionVariants: Variants | undefined;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "accent"
    | "ghost"
    | null
    | undefined;
}

export default function AnimatedButton({
  className,
  children,
  motionVariants,
  variant,
}: AnimatedButtonProps) {
  return (
    <MotionButton
      variant={variant}
      className={className}
      variants={motionVariants}
    >
      {children}
    </MotionButton>
  );
}
