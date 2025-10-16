import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * @typedef TextareaProps
 * @property {string} [className] - Additional class names for styling.
 */

/**
 * A component that displays a textarea.
 * @param {TextareaProps & React.ComponentProps<"textarea">} props - The props for the component.
 * @param {React.Ref<HTMLTextAreaElement>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered textarea.
 */
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
