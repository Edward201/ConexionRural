import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * @typedef BreadcrumbProps
 * @property {React.ReactNode} [separator] - The separator to use between breadcrumb items.
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the breadcrumb.
 */

/**
 * A component that displays a breadcrumb navigation.
 * @param {BreadcrumbProps} props - The props for the component.
 * @param {React.Ref<HTMLElement>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered breadcrumb.
 */
const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav"> & {
    separator?: React.ReactNode
  }
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />)
Breadcrumb.displayName = "Breadcrumb"

/**
 * @typedef BreadcrumbListProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the breadcrumb list.
 */

/**
 * A component that displays a list of breadcrumb items.
 * @param {BreadcrumbListProps} props - The props for the component.
 * @param {React.Ref<HTMLOListElement>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered breadcrumb list.
 */
const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<"ol">
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
      className
    )}
    {...props}
  />
))
BreadcrumbList.displayName = "BreadcrumbList"

/**
 * @typedef BreadcrumbItemProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the breadcrumb item.
 */

/**
 * A component that displays a single breadcrumb item.
 * @param {BreadcrumbItemProps} props - The props for the component.
 * @param {React.Ref<HTMLLIElement>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered breadcrumb item.
 */
const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("inline-flex items-center gap-1.5", className)}
    {...props}
  />
))
BreadcrumbItem.displayName = "BreadcrumbItem"

/**
 * @typedef BreadcrumbLinkProps
 * @property {boolean} [asChild] - Whether to render the link as a child component.
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the breadcrumb link.
 */

/**
 * A component that displays a link in a breadcrumb item.
 * @param {BreadcrumbLinkProps} props - The props for the component.
 * @param {React.Ref<HTMLAnchorElement>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered breadcrumb link.
 */
const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & {
    asChild?: boolean
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      ref={ref}
      className={cn("transition-colors hover:text-foreground", className)}
      {...props}
    />
  )
})
BreadcrumbLink.displayName = "BreadcrumbLink"

/**
 * @typedef BreadcrumbPageProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the breadcrumb page.
 */

/**
 * A component that displays the current page in a breadcrumb item.
 * @param {BreadcrumbPageProps} props - The props for the component.
 * @param {React.Ref<HTMLSpanElement>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered breadcrumb page.
 */
const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn("font-normal text-foreground", className)}
    {...props}
  />
))
BreadcrumbPage.displayName = "BreadcrumbPage"

/**
 * @typedef BreadcrumbSeparatorProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the breadcrumb separator.
 */

/**
 * A component that displays a separator between breadcrumb items.
 * @param {BreadcrumbSeparatorProps} props - The props for the component.
 * @returns {JSX.Element} The rendered breadcrumb separator.
 */
const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn("[&>svg]:w-3.5 [&>svg]:h-3.5", className)}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

/**
 * @typedef BreadcrumbEllipsisProps
 * @property {string} [className] - Additional class names for styling.
 */

/**
 * A component that displays an ellipsis in a breadcrumb item.
 * @param {BreadcrumbEllipsisProps} props - The props for the component.
 * @returns {JSX.Element} The rendered breadcrumb ellipsis.
 */
const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
)
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis"

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
