"use client"

import { forwardRef } from "react"
import { Dropdown, type DropdownItemProps } from "@heroui/react"
import { cn } from "@/lib/utils"

const DropdownMenu = Dropdown.Root

function DropdownMenuTrigger(props: React.ComponentProps<typeof Dropdown.Trigger>) {
  return <Dropdown.Trigger {...props} />
}

function DropdownMenuContent(props: React.ComponentProps<typeof Dropdown.Popover>) {
  return (
    <Dropdown.Popover {...props}>
      <Dropdown.Menu />
    </Dropdown.Popover>
  )
}

const DropdownMenuItem = forwardRef<HTMLDivElement, DropdownItemProps>(
  ({ className, textValue, ...props }, ref) => {
    return (
      <Dropdown.Item
        ref={ref}
        className={className}
        textValue={textValue}
        {...props}
      />
    )
  }
)
DropdownMenuItem.displayName = "DropdownMenuItem"

function DropdownMenuGroup(props: React.ComponentProps<typeof Dropdown.Section>) {
  return <Dropdown.Section {...props} />
}

function DropdownMenuLabel(props: React.ComponentProps<typeof Dropdown.Section>) {
  return <Dropdown.Section {...props} />
}

function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      role="separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function DropdownMenuCheckboxItem(props: DropdownItemProps) {
  return <Dropdown.Item {...props} />
}

function DropdownMenuRadioGroup(props: React.ComponentProps<typeof Dropdown.Menu>) {
  return <Dropdown.Menu selectionMode="single" {...props} />
}

function DropdownMenuRadioItem(props: DropdownItemProps) {
  return <Dropdown.Item {...props} />
}

function DropdownMenuSub(props: React.ComponentProps<typeof Dropdown.Root>) {
  return <Dropdown.Root {...props} />
}

function DropdownMenuPortal(props: React.ComponentProps<typeof Dropdown.Popover>) {
  return <Dropdown.Popover {...props} />
}

function DropdownMenuSubContent(props: React.ComponentProps<typeof Dropdown.Popover>) {
  return <Dropdown.Popover {...props} />
}

function DropdownMenuSubTrigger(props: DropdownItemProps) {
  return <Dropdown.Item {...props} />
}

function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)} {...props} />
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}