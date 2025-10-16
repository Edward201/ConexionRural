import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { Dot } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * @typedef InputOTPProps
 * @property {string} [className] - Additional class names for styling.
 * @property {string} [containerClassName] - Additional class names for the container.
 */

/**
 * A component for inputting one-time passwords.
 * @param {InputOTPProps & React.ComponentPropsWithoutRef<typeof OTPInput>} props - The props for the component.
 * @param {React.Ref<React.ElementRef<typeof OTPInput>>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered input OTP component.
 */
const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn(
      "flex items-center gap-2 has-[:disabled]:opacity-50",
      containerClassName
    )}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props}
  />
))
InputOTP.displayName = "InputOTP"

/**
 * @typedef InputOTPGroupProps
 * @property {string} [className] - Additional class names for styling.
 */

/**
 * A component that groups the slots of an input OTP component.
 * @param {InputOTPGroupProps & React.ComponentPropsWithoutRef<"div">} props - The props for the component.
 * @param {React.Ref<React.ElementRef<"div">>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered input OTP group component.
 */
const InputOTPGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
))
InputOTPGroup.displayName = "InputOTPGroup"

/**
 * @typedef InputOTPSlotProps
 * @property {number} index - The index of the slot.
 * @property {string} [className] - Additional class names for styling.
 */

/**
 * A component that represents a single slot of an input OTP component.
 * @param {InputOTPSlotProps & React.ComponentPropsWithoutRef<"div">} props - The props for the component.
 * @param {React.Ref<React.ElementRef<"div">>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered input OTP slot component.
 */
const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { index: number }
>(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-2 ring-ring ring-offset-background",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  )
})
InputOTPSlot.displayName = "InputOTPSlot"

/**
 * A component that separates groups of slots in an input OTP component.
 * @param {React.ComponentPropsWithoutRef<"div">} props - The props for the component.
 * @param {React.Ref<React.ElementRef<"div">>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered input OTP separator component.
 */
const InputOTPSeparator = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Dot />
  </div>
))
InputOTPSeparator.displayName = "InputOTPSeparator"

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
