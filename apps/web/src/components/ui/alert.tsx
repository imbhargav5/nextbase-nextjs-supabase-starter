"use client"

import { Alert as HeroUIAlert } from "@heroui/react"
import { cn } from "@/lib/utils"

const statusMap: Record<string, "default" | "warning" | "danger" | "success" | "accent"> = {
  default: "default",
  destructive: "danger",
}

function Alert({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof HeroUIAlert> & {
  variant?: "default" | "destructive"
}) {
  return (
    <HeroUIAlert
      status={statusMap[variant] ?? "default"}
      className={cn(className)}
      {...props}
    />
  )
}

const AlertTitle = HeroUIAlert.Title
const AlertDescription = HeroUIAlert.Description

export { Alert, AlertTitle, AlertDescription }