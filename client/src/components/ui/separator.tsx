import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

/**
 * @typedef SeparatorProps
 * @property {string} [className] - Additional class names for styling.
 * @property {"horizontal" | "vertical"} [orientation] - The orientation of the separator.
 * @property {boolean} [decorative] - Whether the separator is decorative.
 */

/**
 * A component that displays a separator.
 * @param {SeparatorProps & React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof SeparatorPrimitive.Root>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered separator.
 */
const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
