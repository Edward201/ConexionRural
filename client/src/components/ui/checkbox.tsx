import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * @typedef CheckboxProps
 * @property {string} [className] - Additional class names for styling.
 * @property {boolean} [checked] - Whether the checkbox is checked.
 * @property {function} [onCheckedChange] - A callback function that is called when the checkbox is checked or unchecked.
 */

/**
 * A component that allows the user to select one or more options from a set.
 * @param {CheckboxProps & React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>} props - The props for the component.
 * @param {React.Ref<HTMLButtonElement>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered checkbox.
 */
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
