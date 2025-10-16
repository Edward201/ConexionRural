import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

/**
 * @typedef AlertDialogOverlayProps
 * @property {string} [className] - Additional class names for styling.
 */

/**
 * A component that darkens the background when the alert dialog is open.
 * @param {AlertDialogOverlayProps} props - The props for the component.
 * @param {React.Ref<HTMLDivElement>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered alert dialog overlay.
 */
const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

/**
 * @typedef AlertDialogContentProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the alert dialog.
 */

/**
 * A component that contains the content of the alert dialog.
 * @param {AlertDialogContentProps} props - The props for the component.
 * @param {React.Ref<HTMLDivElement>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered alert dialog content.
 */
const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

/**
 * @typedef AlertDialogHeaderProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the alert dialog header.
 */

/**
 * A component that represents the header of the alert dialog.
 * @param {AlertDialogHeaderProps} props - The props for the component.
 * @returns {JSX.Element} The rendered alert dialog header.
 */
const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

/**
 * @typedef AlertDialogFooterProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the alert dialog footer.
 */

/**
 * A component that represents the footer of the alert dialog.
 * @param {AlertDialogFooterProps} props - The props for the component.
 * @returns {JSX.Element} The rendered alert dialog footer.
 */
const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

/**
 * @typedef AlertDialogTitleProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the alert dialog title.
 */

/**
 * A component that represents the title of the alert dialog.
 * @param {AlertDialogTitleProps} props - The props for the component.
 * @param {React.Ref<HTMLHeadingElement>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered alert dialog title.
 */
const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

/**
 * @typedef AlertDialogDescriptionProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the alert dialog description.
 */

/**
 * A component that represents the description of the alert dialog.
 * @param {AlertDialogDescriptionProps} props - The props for the component.
 * @param {React.Ref<HTMLParagraphElement>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered alert dialog description.
 */
const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

/**
 * @typedef AlertDialogActionProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the alert dialog action button.
 */

/**
 * A component that represents the action button of the alert dialog.
 * @param {AlertDialogActionProps} props - The props for the component.
 * @param {React.Ref<HTMLButtonElement>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered alert dialog action button.
 */
const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

/**
 * @typedef AlertDialogCancelProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the alert dialog cancel button.
 */

/**
 * A component that represents the cancel button of the alert dialog.
 * @param {AlertDialogCancelProps} props - The props for the component.
 * @param {React.Ref<HTMLButtonElement>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered alert dialog cancel button.
 */
const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    )}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
