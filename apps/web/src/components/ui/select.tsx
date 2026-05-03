"use client"

import { Select as HeroUISelect } from "@heroui/react"

const Select = HeroUISelect
const SelectTrigger = HeroUISelect.Trigger
const SelectValue = HeroUISelect.Value
const SelectIndicator = HeroUISelect.Indicator
const SelectPopover = HeroUISelect.Popover

function SelectContent(props: React.ComponentProps<typeof HeroUISelect.Popover>) {
  return <HeroUISelect.Popover {...props} />
}

function SelectItem(props: React.ComponentProps<typeof HeroUISelect.Trigger>) {
  return <HeroUISelect.Trigger {...props} />
}

function SelectGroup(props: React.ComponentProps<typeof HeroUISelect>) {
  return <HeroUISelect {...props} />
}

function SelectLabel({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={className} {...props} />
}

function SelectSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={className} {...props} />
}

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectIndicator,
  SelectPopover,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
}