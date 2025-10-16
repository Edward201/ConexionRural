import { cn } from "@/lib/utils"

/**
 * @typedef SkeletonProps
 * @property {string} [className] - Additional class names for styling.
 */

/**
 * A component that displays a skeleton loader.
 * @param {SkeletonProps & React.HTMLAttributes<HTMLDivElement>} props - The props for the component.
 * @returns {JSX.Element} The rendered skeleton loader.
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
