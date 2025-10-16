import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * @typedef RadioGroupProps
 * @property {string} [className] - Additional class names for styling.
 */

/**
 * A component that displays a set of radio buttons.
 * @param {RadioGroupProps & React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof RadioGroupPrimitive.Root>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered radio group.
 */
const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

/**
 * @typedef RadioGroupItemProps
 * @property {string} [className] - Additional class names for styling.
 */

/**
 * A component that represents a single radio button in a radio group.
 * @param {RadioGroupItemProps & React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof RadioGroupPrimitive.Item>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered radio group item.
 */
const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
