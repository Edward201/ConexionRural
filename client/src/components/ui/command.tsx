import * as React from "react"
import { type DialogProps } from "@radix-ui/react-dialog"
import { Command as CommandPrimitive } from "cmdk"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"

/**
 * @typedef CommandProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the command.
 */

/**
 * A component that displays a command menu.
 * @param {CommandProps & React.ComponentPropsWithoutRef<typeof CommandPrimitive>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof CommandPrimitive>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered command menu.
 */
const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className
    )}
    {...props}
  />
))
Command.displayName = CommandPrimitive.displayName

/**
 * @typedef CommandDialogProps
 * @property {React.ReactNode} children - The content of the command dialog.
 */

/**
 * A component that displays a command menu in a dialog.
 * @param {CommandDialogProps & DialogProps} props - The props for the component.
 * @returns {JSX.Element} The rendered command dialog.
 */
const CommandDialog = ({ children, ...props }: DialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

/**
 * @typedef CommandInputProps
 * @property {string} [className] - Additional class names for styling.
 */

/**
 * A component that displays an input for a command menu.
 * @param {CommandInputProps & React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof CommandPrimitive.Input>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered command input.
 */
const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  </div>
))

CommandInput.displayName = CommandPrimitive.Input.displayName

/**
 * @typedef CommandListProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the command list.
 */

/**
 * A component that displays a list of commands.
 * @param {CommandListProps & React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof CommandPrimitive.List>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered command list.
 */
const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
))

CommandList.displayName = CommandPrimitive.List.displayName

/**
 * A component that displays a message when there are no commands to show.
 * @param {React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof CommandPrimitive.Empty>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered empty command message.
 */
const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-6 text-center text-sm"
    {...props}
  />
))

CommandEmpty.displayName = CommandPrimitive.Empty.displayName

/**
 * @typedef CommandGroupProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the command group.
 */

/**
 * A component that groups commands.
 * @param {CommandGroupProps & React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof CommandPrimitive.Group>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered command group.
 */
const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className
    )}
    {...props}
  />
))

CommandGroup.displayName = CommandPrimitive.Group.displayName

/**
 * @typedef CommandSeparatorProps
 * @property {string} [className] - Additional class names for styling.
 */

/**
 * A component that displays a separator between command groups.
 * @param {CommandSeparatorProps & React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof CommandPrimitive.Separator>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered command separator.
 */
const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 h-px bg-border", className)}
    {...props}
  />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

/**
 * @typedef CommandItemProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the command item.
 */

/**
 * A component that displays a single command item.
 * @param {CommandItemProps & React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof CommandPrimitive.Item>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered command item.
 */
const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      className
    )}
    {...props}
  />
))

CommandItem.displayName = CommandPrimitive.Item.displayName

/**
 * @typedef CommandShortcutProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the command shortcut.
 */

/**
 * A component that displays a shortcut for a command.
 * @param {CommandShortcutProps & React.HTMLAttributes<HTMLSpanElement>} props - The props for the component.
 * @returns {JSX.Element} The rendered command shortcut.
 */
const CommandShortcut = ({
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
CommandShortcut.displayName = "CommandShortcut"

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
