"use client"

import { Popover } from "@heroui/react"

const HoverCard = Popover.Root
const HoverCardTrigger = Popover.Trigger

function HoverCardContent({ className, ...props }: React.ComponentProps<typeof Popover.Content>) {
  return <Popover.Content className={className} {...props} />
}

export { HoverCard, HoverCardTrigger, HoverCardContent }