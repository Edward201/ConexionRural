"use client"

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

/**
 * A component that can be collapsed or expanded.
 * @param {object} props - The props for the component.
 * @returns {JSX.Element} The rendered collapsible component.
 */
const Collapsible = CollapsiblePrimitive.Root

/**
 * A component that triggers the collapsing and expanding of a collapsible component.
 * @param {object} props - The props for the component.
 * @returns {JSX.Element} The rendered collapsible trigger component.
 */
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

/**
 * A component that contains the content of a collapsible component.
 * @param {object} props - The props for the component.
 * @returns {JSX.Element} The rendered collapsible content component.
 */
const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
