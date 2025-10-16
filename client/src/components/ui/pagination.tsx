import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"

/**
 * A component that displays a pagination control.
 * @param {React.ComponentProps<"nav">} props - The props for the component.
 * @returns {JSX.Element} The rendered pagination control.
 */
const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
)
Pagination.displayName = "Pagination"

/**
 * A component that contains the content of a pagination control.
 * @param {React.ComponentProps<"ul">} props - The props for the component.
 * @param {React.Ref<HTMLUListElement>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered pagination content.
 */
const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

/**
 * A component that represents a single item in a pagination control.
 * @param {React.ComponentProps<"li">} props - The props for the component.
 * @param {React.Ref<HTMLLIElement>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered pagination item.
 */
const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">

/**
 * A component that displays a link in a pagination control.
 * @param {PaginationLinkProps} props - The props for the component.
 * @returns {JSX.Element} The rendered pagination link.
 */
const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className
    )}
    {...props}
  />
)
PaginationLink.displayName = "PaginationLink"

/**
 * A component that displays a link to the previous page in a pagination control.
 * @param {React.ComponentProps<typeof PaginationLink>} props - The props for the component.
 * @returns {JSX.Element} The rendered pagination previous link.
 */
const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

/**
 * A component that displays a link to the next page in a pagination control.
 * @param {React.ComponentProps<typeof PaginationLink>} props - The props for the component.
 * @returns {JSX.Element} The rendered pagination next link.
 */
const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

/**
 * A component that displays an ellipsis in a pagination control.
 * @param {React.ComponentProps<"span">} props - The props for the component.
 * @returns {JSX.Element} The rendered pagination ellipsis.
 */
const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
