"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

/**
 * @typedef SelectTriggerProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the trigger.
 */

/**
 * A component that triggers the select menu.
 * @param {SelectTriggerProps & React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof SelectPrimitive.Trigger>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered select trigger.
 */
const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

/**
 * @typedef SelectScrollUpButtonProps
 * @property {string} [className] - Additional class names for styling.
 */

/**
 * A component that displays a button to scroll up in the select menu.
 * @param {SelectScrollUpButtonProps & React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof SelectPrimitive.ScrollUpButton>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered select scroll up button.
 */
const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

/**
 * @typedef SelectScrollDownButtonProps
 * @property {string} [className] - Additional class names for styling.
 */

/**
 * A component that displays a button to scroll down in the select menu.
 * @param {SelectScrollDownButtonProps & React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof SelectPrimitive.ScrollDownButton>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered select scroll down button.
 */
const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

/**
 * @typedef SelectContentProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the select menu.
 * @property {"popper" | "item-aligned"} [position] - The position of the select menu.
 */

/**
 * A component that contains the content of the select menu.
 * @param {SelectContentProps & React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof SelectPrimitive.Content>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered select content.
 */
const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-[--radix-select-content-available-height] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-select-content-transform-origin]",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

/**
 * @typedef SelectLabelProps
 * @property {string} [className] - Additional class names for styling.
 */

/**
 * A component that displays a label in a select menu.
 * @param {SelectLabelProps & React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof SelectPrimitive.Label>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered select label.
 */
const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

/**
 * @typedef SelectItemProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the select item.
 */

/**
 * A component that represents a single item in a select menu.
 * @param {SelectItemProps & React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof SelectPrimitive.Item>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered select item.
 */
const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

/**
 * @typedef SelectSeparatorProps
 * @property {string} [className] - Additional class names for styling.
 */

/**
 * A component that displays a separator in a select menu.
 * @param {SelectSeparatorProps & React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof SelectPrimitive.Separator>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered select separator.
 */
const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
