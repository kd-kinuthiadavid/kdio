"use client";

import { motion, type Variants } from "framer-motion";
import { Button } from "../ui/button";

const MotionButton = motion.create(Button);

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
  onClick?: () => void;
}

export default function AnimatedButton({
  className,
  children,
  motionVariants,
  variant,
  onClick,
}: AnimatedButtonProps) {
  return (
    <MotionButton
      variant={variant}
      className={className}
      variants={motionVariants}
      onClick={onClick}
    >
      {children}
    </MotionButton>
  );
}
