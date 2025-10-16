"use client"

import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * A menu in a menubar.
 * @param {React.ComponentProps<typeof MenubarPrimitive.Menu>} props - The props for the component.
 * @returns {JSX.Element} The rendered menubar menu.
 */
function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu {...props} />
}

/**
 * A group of items in a menubar.
 * @param {React.ComponentProps<typeof MenubarPrimitive.Group>} props - The props for the component.
 * @returns {JSX.Element} The rendered menubar group.
 */
function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group {...props} />
}

/**
 * A portal for a menubar.
 * @param {React.ComponentProps<typeof MenubarPrimitive.Portal>} props - The props for the component.
 * @returns {JSX.Element} The rendered menubar portal.
 */
function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal {...props} />
}

/**
 * A group of radio items in a menubar.
 * @param {React.ComponentProps<typeof MenubarPrimitive.RadioGroup>} props - The props for the component.
 * @returns {JSX.Element} The rendered menubar radio group.
 */
function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return <MenubarPrimitive.RadioGroup {...props} />
}

/**
 * A submenu in a menubar.
 * @param {React.ComponentProps<typeof MenubarPrimitive.Sub>} props - The props for the component.
 * @returns {JSX.Element} The rendered menubar submenu.
 */
function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />
}

/**
 * @typedef MenubarProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the menubar.
 */

/**
 * A component that displays a menubar.
 * @param {MenubarProps & React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof MenubarPrimitive.Root>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered menubar.
 */
const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn(
      "flex h-10 items-center space-x-1 rounded-md border bg-background p-1",
      className
    )}
    {...props}
  />
))
Menubar.displayName = MenubarPrimitive.Root.displayName

/**
 * @typedef MenubarTriggerProps
 * @property {string} [className] - Additional class names for styling.
 */

/**
 * A component that triggers a menubar menu.
 * @param {MenubarTriggerProps & React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof MenubarPrimitive.Trigger>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered menubar trigger.
 */
const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      className
    )}
    {...props}
  />
))
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName

/**
 * @typedef MenubarSubTriggerProps
 * @property {boolean} [inset] - Whether the sub trigger is inset.
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the sub trigger.
 */

/**
 * A component that triggers a submenu in a menubar.
 * @param {MenubarSubTriggerProps & React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof MenubarPrimitive.SubTrigger>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered menubar sub trigger.
 */
const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </MenubarPrimitive.SubTrigger>
))
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName

/**
 * @typedef MenubarSubContentProps
 * @property {string} [className] - Additional class names for styling.
 */

/**
 * A component that contains the content of a submenu in a menubar.
 * @param {MenubarSubContentProps & React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof MenubarPrimitive.SubContent>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered menubar sub content.
 */
const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-menubar-content-transform-origin]",
      className
    )}
    {...props}
  />
))
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName

/**
 * @typedef MenubarContentProps
 * @property {string} [className] - Additional class names for styling.
 * @property {"start" | "center" | "end"} [align] - The alignment of the content.
 * @property {number} [alignOffset] - The offset of the content from the trigger.
 * @property {number} [sideOffset] - The offset of the content from the trigger.
 */

/**
 * A component that contains the content of a menubar menu.
 * @param {MenubarContentProps & React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof MenubarPrimitive.Content>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered menubar content.
 */
const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(
  (
    { className, align = "start", alignOffset = -4, sideOffset = 8, ...props },
    ref
  ) => (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        ref={ref}
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-menubar-content-transform-origin]",
          className
        )}
        {...props}
      />
    </MenubarPrimitive.Portal>
  )
)
MenubarContent.displayName = MenubarPrimitive.Content.displayName

/**
 * @typedef MenubarItemProps
 * @property {boolean} [inset] - Whether the item is inset.
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the item.
 */

/**
 * A component that represents a single item in a menubar.
 * @param {MenubarItemProps & React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof MenubarPrimitive.Item>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered menubar item.
 */
const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
MenubarItem.displayName = MenubarPrimitive.Item.displayName

/**
 * @typedef MenubarCheckboxItemProps
 * @property {boolean} [checked] - Whether the checkbox item is checked.
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the checkbox item.
 */

/**
 * A component that represents a checkbox item in a menubar.
 * @param {MenubarCheckboxItemProps & React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof MenubarPrimitive.CheckboxItem>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered menubar checkbox item.
 */
const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
))
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName

/**
 * @typedef MenubarRadioItemProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the radio item.
 */

/**
 * A component that represents a radio item in a menubar.
 * @param {MenubarRadioItemProps & React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof MenubarPrimitive.RadioItem>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered menubar radio item.
 */
const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
))
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName

/**
 * @typedef MenubarLabelProps
 * @property {boolean} [inset] - Whether the label is inset.
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the label.
 */

/**
 * A component that displays a label in a menubar.
 * @param {MenubarLabelProps & React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof MenubarPrimitive.Label>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered menubar label.
 */
const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
MenubarLabel.displayName = MenubarPrimitive.Label.displayName

/**
 * @typedef MenubarSeparatorProps
 * @property {string} [className] - Additional class names for styling.
 */

/**
 * A component that displays a separator in a menubar.
 * @param {MenubarSeparatorProps & React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof MenubarPrimitive.Separator>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered menubar separator.
 */
const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName

/**
 * @typedef MenubarShortcutProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the shortcut.
 */

/**
 * A component that displays a shortcut in a menubar.
 * @param {MenubarShortcutProps & React.HTMLAttributes<HTMLSpanElement>} props - The props for the component.
 * @returns {JSX.Element} The rendered menubar shortcut.
 */
const MenubarShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
MenubarShortcut.displayname = "MenubarShortcut"

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
}
