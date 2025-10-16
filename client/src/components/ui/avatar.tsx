"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

/**
 * @typedef AvatarProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the avatar.
 */

/**
 * A component that displays an image representing a user or entity.
 * @param {AvatarProps} props - The props for the component.
 * @param {React.Ref<HTMLDivElement>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered avatar.
 */
const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

/**
 * @typedef AvatarImageProps
 * @property {string} [className] - Additional class names for styling.
 * @property {string} src - The URL of the image to display.
 */

/**
 * A component that displays the image for an avatar.
 * @param {AvatarImageProps} props - The props for the component.
 * @param {React.Ref<HTMLImageElement>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered avatar image.
 */
const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

/**
 * @typedef AvatarFallbackProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content to display when the image is not available.
 */

/**
 * A component that displays a fallback for an avatar when the image is not available.
 * @param {AvatarFallbackProps} props - The props for the component.
 * @param {React.Ref<HTMLSpanElement>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered avatar fallback.
 */
const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
