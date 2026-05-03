"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        "relative flex w-full items-center rounded-md border border-border outline-none transition-[color,box-shadow]",
        "h-9 has-[>textarea]:h-auto",
        "bg-white dark:bg-surface",
        "focus-within:ring-2 focus-within:ring-accent focus-within:border-accent",
        "has-[[aria-invalid=true]]:ring-destructive/20 has-[[aria-invalid=true]]:border-destructive",
        className
      )}
      {...props}
    />
  )
}

function InputGroupAddon({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      className={cn(
        "text-muted-foreground flex h-auto cursor-text select-none items-center justify-center gap-2 py-1.5 text-sm font-medium px-3",
        "[&>svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      data-slot="input-group-control"
      className={cn(
        "flex-1 h-full bg-transparent border-0 shadow-none outline-none px-3 py-1.5 text-sm",
        "placeholder:text-muted-foreground",
        "focus:ring-0 focus:outline-none",
        className
      )}
      {...props}
    />
  )
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="input-group-control"
      className={cn(
        "flex-1 resize-none bg-transparent border-0 shadow-none outline-none px-3 py-3 text-sm",
        "placeholder:text-muted-foreground",
        "focus:ring-0 focus:outline-none",
        className
      )}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupTextarea,
}