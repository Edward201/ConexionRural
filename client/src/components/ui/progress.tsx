"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

/**
 * @typedef ProgressProps
 * @property {string} [className] - Additional class names for styling.
 * @property {number} [value] - The value of the progress bar.
 */

/**
 * A component that displays a progress bar.
 * @param {ProgressProps & React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof ProgressPrimitive.Root>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered progress bar.
 */
const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
