"use client"

import { forwardRef } from "react"
import { Button as HeroUIButton, buttonVariants as heroUIButtonVariants } from "@heroui/react"

const variantMap = {
  default: "primary",
  destructive: "danger",
  outline: "outline",
  secondary: "secondary",
  ghost: "ghost",
  link: "link",
} as const

const sizeMap = {
  default: "md",
  sm: "sm",
  lg: "lg",
  icon: "md",
} as const

type ShadcnVariant = keyof typeof variantMap
type ShadcnSize = keyof typeof sizeMap

type ButtonProps = Omit<React.ComponentProps<typeof HeroUIButton>, "variant" | "size"> & {
  variant?: ShadcnVariant
  size?: ShadcnSize | "xs" | "icon-xs" | "icon-sm" | "icon-lg"
  onClick?: () => void
  disabled?: boolean
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", size = "default", onClick, disabled, asChild: _asChild, ...props }, ref) => {
    const mappedVariant = variantMap[variant] ?? "primary"
    const mappedSize = sizeMap[size as ShadcnSize] ?? "md"
    return (
      <HeroUIButton
        ref={ref}
        variant={mappedVariant as any}
        size={mappedSize as any}
        isIconOnly={size === "icon" || size === "icon-xs" || size === "icon-sm" || size === "icon-lg"}
        onPress={onClick}
        isDisabled={disabled}
        {...(props as any)}
      />
    )
  }
)
Button.displayName = "Button"

function buttonVariants(
  opts?: { variant?: ShadcnVariant; size?: ShadcnSize | "xs" | "icon-xs" | "icon-sm" | "icon-lg"; className?: string }
): string {
  if (!opts) return heroUIButtonVariants({ variant: "primary", size: "md" } as any) as string
  const { variant = "default", size = "default", className } = opts
  const mappedVariant = variantMap[variant] ?? "primary"
  const mappedSize = sizeMap[size as ShadcnSize] ?? "md"
  return heroUIButtonVariants({ variant: mappedVariant, size: mappedSize, className } as any) as string
}

export { Button, buttonVariants }