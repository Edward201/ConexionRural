"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "@/lib/utils"

/**
 * @typedef DrawerProps
 * @property {boolean} [shouldScaleBackground] - Whether the background should be scaled when the drawer is open.
 */

/**
 * A component that displays a drawer from the bottom of the screen.
 * @param {DrawerProps & React.ComponentProps<typeof DrawerPrimitive.Root>} props - The props for the component.
 * @returns {JSX.Element} The rendered drawer.
 */
const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
)
Drawer.displayName = "Drawer"

const DrawerTrigger = DrawerPrimitive.Trigger

const DrawerPortal = DrawerPrimitive.Portal

const DrawerClose = DrawerPrimitive.Close

/**
 * @typedef DrawerOverlayProps
 * @property {string} [className] - Additional class names for styling.
 */

/**
 * A component that darkens the background when the drawer is open.
 * @param {DrawerOverlayProps & React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof DrawerPrimitive.Overlay>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered drawer overlay.
 */
const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/80", className)}
    {...props}
  />
))
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

/**
 * @typedef DrawerContentProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the drawer.
 */

/**
 * A component that contains the content of the drawer.
 * @param {DrawerContentProps & React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof DrawerPrimitive.Content>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered drawer content.
 */
const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
        className
      )}
      {...props}
    >
      <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
))
DrawerContent.displayName = "DrawerContent"

/**
 * @typedef DrawerHeaderProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the drawer header.
 */

/**
 * A component that represents the header of a drawer.
 * @param {DrawerHeaderProps & React.HTMLAttributes<HTMLDivElement>} props - The props for the component.
 * @returns {JSX.Element} The rendered drawer header.
 */
const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
    {...props}
  />
)
DrawerHeader.displayName = "DrawerHeader"

/**
 * @typedef DrawerFooterProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the drawer footer.
 */

/**
 * A component that represents the footer of a drawer.
 * @param {DrawerFooterProps & React.HTMLAttributes<HTMLDivElement>} props - The props for the component.
 * @returns {JSX.Element} The rendered drawer footer.
 */
const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("mt-auto flex flex-col gap-2 p-4", className)}
    {...props}
  />
)
DrawerFooter.displayName = "DrawerFooter"

/**
 * @typedef DrawerTitleProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the drawer title.
 */

/**
 * A component that represents the title of a drawer.
 * @param {DrawerTitleProps & React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof DrawerPrimitive.Title>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered drawer title.
 */
const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DrawerTitle.displayName = DrawerPrimitive.Title.displayName

/**
 * @typedef DrawerDescriptionProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the drawer description.
 */

/**
 * A component that represents the description of a drawer.
 * @param {DrawerDescriptionProps & React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof DrawerPrimitive.Description>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered drawer description.
 */
const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DrawerDescription.displayName = DrawerPrimitive.Description.displayName

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
