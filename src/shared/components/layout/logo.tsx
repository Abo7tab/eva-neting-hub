import Image from "next/image";
import { cn } from "@/shared/lib/utils";

export interface LogoProps {
  variant?: "main" | "men" | "women";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  priority?: boolean;
  showText?: boolean; // Ignored for external SVG via next/image
}

const sizeMap = {
  sm: 24,
  md: 40,
  lg: 64,
  xl: 96,
};

export function Logo({
  variant = "main",
  size = "md",
  className,
  priority = false,
  showText = true, // eslint-disable-line @typescript-eslint/no-unused-vars
}: LogoProps) {
  const dimension = sizeMap[size];
  // Since the SVG viewBox is 350x80 (aspect ratio 4.375), setting it as a square
  // without object-contain will warp it. We use the height dimension for both,
  // but object-contain ensures it fits nicely without distortion if needed,
  // or we can just apply a width auto class.
  return (
    <Image
      src={`/logos/${variant}.svg`}
      alt={`Eva Beauty Hub ${variant} logo`}
      width={dimension * 4.375} // Scale width correctly for aspect ratio 350x80
      height={dimension}
      priority={priority}
      className={cn("w-auto object-contain", className)}
      style={{ maxHeight: dimension }}
    />
  );
}
