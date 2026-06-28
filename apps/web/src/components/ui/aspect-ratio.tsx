"use client"

import * as React from "react"
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"

const AspectRatio = AspectRatioPrimitive.Root
type AspectRatioProps = React.ComponentPropsWithoutRef<
  typeof AspectRatioPrimitive.Root
>

AspectRatio.displayName = AspectRatioPrimitive.Root.displayName

export { AspectRatio, type AspectRatioProps }
