import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

/**
 * @typedef ScrollAreaProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the scroll area.
 */

/**
 * A component that provides a scrollable area.
 * @param {ScrollAreaProps & React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof ScrollAreaPrimitive.Root>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered scroll area.
 */
const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

/**
 * @typedef ScrollBarProps
 * @property {string} [className] - Additional class names for styling.
 * @property {"vertical" | "horizontal"} [orientation] - The orientation of the scrollbar.
 */

/**
 * A component that displays a scrollbar for a scroll area.
 * @param {ScrollBarProps & React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered scrollbar.
 */
const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
