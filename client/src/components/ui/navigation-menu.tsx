import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { cva } from "class-variance-authority"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * @typedef NavigationMenuProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the navigation menu.
 */

/**
 * A component that displays a navigation menu.
 * @param {NavigationMenuProps & React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof NavigationMenuPrimitive.Root>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered navigation menu.
 */
const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn(
      "relative z-10 flex max-w-max flex-1 items-center justify-center",
      className
    )}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
))
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName

/**
 * @typedef NavigationMenuListProps
 * @property {string} [className] - Additional class names for styling.
 */

/**
 * A component that displays a list of items in a navigation menu.
 * @param {NavigationMenuListProps & React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof NavigationMenuPrimitive.List>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered navigation menu list.
 */
const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(
      "group flex flex-1 list-none items-center justify-center space-x-1",
      className
    )}
    {...props}
  />
))
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName

const NavigationMenuItem = NavigationMenuPrimitive.Item

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=open]:text-accent-foreground data-[state=open]:bg-accent/50 data-[state=open]:hover:bg-accent data-[state=open]:focus:bg-accent"
)

/**
 * @typedef NavigationMenuTriggerProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the trigger.
 */

/**
 * A component that triggers a navigation menu.
 * @param {NavigationMenuTriggerProps & React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof NavigationMenuPrimitive.Trigger>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered navigation menu trigger.
 */
const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), "group", className)}
    {...props}
  >
    {children}{" "}
    <ChevronDown
      className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
))
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName

/**
 * @typedef NavigationMenuContentProps
 * @property {string} [className] - Additional class names for styling.
 */

/**
 * A component that contains the content of a navigation menu.
 * @param {NavigationMenuContentProps & React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof NavigationMenuPrimitive.Content>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered navigation menu content.
 */
const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ",
      className
    )}
    {...props}
  />
))
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName

const NavigationMenuLink = NavigationMenuPrimitive.Link

/**
 * @typedef NavigationMenuViewportProps
 * @property {string} [className] - Additional class names for styling.
 */

/**
 * A component that displays the viewport of a navigation menu.
 * @param {NavigationMenuViewportProps & React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof NavigationMenuPrimitive.Viewport>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered navigation menu viewport.
 */
const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className={cn("absolute left-0 top-full flex justify-center")}>
    <NavigationMenuPrimitive.Viewport
      className={cn(
        "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
        className
      )}
      ref={ref}
      {...props}
    />
  </div>
))
NavigationMenuViewport.displayName =
  NavigationMenuPrimitive.Viewport.displayName

/**
 * @typedef NavigationMenuIndicatorProps
 * @property {string} [className] - Additional class names for styling.
 */

/**
 * A component that displays an indicator for the active item in a navigation menu.
 * @param {NavigationMenuIndicatorProps & React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof NavigationMenuPrimitive.Indicator>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered navigation menu indicator.
 */
const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
      className
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
  </NavigationMenuPrimitive.Indicator>
))
NavigationMenuIndicator.displayName =
  NavigationMenuPrimitive.Indicator.displayName

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
}
