import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

/**
 * @typedef DropdownMenuSubTriggerProps
 * @property {boolean} [inset] - Whether the sub trigger is inset.
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the sub trigger.
 */

/**
 * A component that opens a submenu in a dropdown menu.
 * @param {DropdownMenuSubTriggerProps & React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered dropdown menu sub trigger.
 */
const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

/**
 * @typedef DropdownMenuSubContentProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the sub content.
 */

/**
 * A component that contains the content of a submenu in a dropdown menu.
 * @param {DropdownMenuSubContentProps & React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof DropdownMenuPrimitive.SubContent>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered dropdown menu sub content.
 */
const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-dropdown-menu-content-transform-origin]",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

/**
 * @typedef DropdownMenuContentProps
 * @property {string} [className] - Additional class names for styling.
 * @property {number} [sideOffset] - The offset of the content from the trigger.
 * @property {React.ReactNode} children - The content of the dropdown menu.
 */

/**
 * A component that contains the content of a dropdown menu.
 * @param {DropdownMenuContentProps & React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof DropdownMenuPrimitive.Content>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered dropdown menu content.
 */
const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-dropdown-menu-content-transform-origin]",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

/**
 * @typedef DropdownMenuItemProps
 * @property {boolean} [inset] - Whether the item is inset.
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the item.
 */

/**
 * A component that represents a single item in a dropdown menu.
 * @param {DropdownMenuItemProps & React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof DropdownMenuPrimitive.Item>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered dropdown menu item.
 */
const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

/**
 * @typedef DropdownMenuCheckboxItemProps
 * @property {boolean} [checked] - Whether the checkbox item is checked.
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the checkbox item.
 */

/**
 * A component that represents a checkbox item in a dropdown menu.
 * @param {DropdownMenuCheckboxItemProps & React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered dropdown menu checkbox item.
 */
const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

/**
 * @typedef DropdownMenuRadioItemProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the radio item.
 */

/**
 * A component that represents a radio item in a dropdown menu.
 * @param {DropdownMenuRadioItemProps & React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered dropdown menu radio item.
 */
const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

/**
 * @typedef DropdownMenuLabelProps
 * @property {boolean} [inset] - Whether the label is inset.
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the label.
 */

/**
 * A component that displays a label in a dropdown menu.
 * @param {DropdownMenuLabelProps & React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof DropdownMenuPrimitive.Label>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered dropdown menu label.
 */
const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

/**
 * @typedef DropdownMenuSeparatorProps
 * @property {string} [className] - Additional class names for styling.
 */

/**
 * A component that displays a separator in a dropdown menu.
 * @param {DropdownMenuSeparatorProps & React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof DropdownMenuPrimitive.Separator>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered dropdown menu separator.
 */
const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

/**
 * @typedef DropdownMenuShortcutProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the shortcut.
 */

/**
 * A component that displays a shortcut in a dropdown menu.
 * @param {DropdownMenuShortcutProps & React.HTMLAttributes<HTMLSpanElement>} props - The props for the component.
 * @returns {JSX.Element} The rendered dropdown menu shortcut.
 */
const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
