"use client"

import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { toggleVariants } from "@/components/ui/toggle"

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: "default",
  variant: "default",
})

/**
 * @typedef ToggleGroupProps
 * @property {string} [className] - Additional class names for styling.
 * @property {object} [variant] - The variant of the toggle group.
 * @property {object} [size] - The size of the toggle group.
 * @property {React.ReactNode} children - The content of the toggle group.
 */

/**
 * A component that displays a group of toggle buttons.
 * @param {ToggleGroupProps & React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> & VariantProps<typeof toggleVariants>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof ToggleGroupPrimitive.Root>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered toggle group.
 */
const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn("flex items-center justify-center gap-1", className)}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {children}
    </ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
))

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

/**
 * @typedef ToggleGroupItemProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the toggle group item.
 * @property {object} [variant] - The variant of the toggle group item.
 * @property {object} [size] - The size of the toggle group item.
 */

/**
 * A component that displays a single toggle button in a toggle group.
 * @param {ToggleGroupItemProps & React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> & VariantProps<typeof toggleVariants>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof ToggleGroupPrimitive.Item>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered toggle group item.
 */
const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleVariants>
>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
})

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export { ToggleGroup, ToggleGroupItem }
