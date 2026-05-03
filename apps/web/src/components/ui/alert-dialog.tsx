"use client"

import { AlertDialog as HeroUIAlertDialog } from "@heroui/react"
import { cn } from "@/lib/utils"

const AlertDialog = HeroUIAlertDialog.Root

function AlertDialogTrigger(props: React.ComponentProps<typeof HeroUIAlertDialog.Trigger>) {
  return <HeroUIAlertDialog.Trigger {...props} />
}

function AlertDialogOverlay(props: React.ComponentProps<typeof HeroUIAlertDialog.Backdrop>) {
  return <HeroUIAlertDialog.Backdrop {...props} />
}

function AlertDialogContent({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof HeroUIAlertDialog.Container>, "children"> & {
  children?: React.ReactNode
}) {
  return (
    <>
      <HeroUIAlertDialog.Backdrop />
      <HeroUIAlertDialog.Container className={cn("max-w-lg", className)} {...props}>
        <HeroUIAlertDialog.Dialog>
          {children}
        </HeroUIAlertDialog.Dialog>
      </HeroUIAlertDialog.Container>
    </>
  )
}

const AlertDialogHeader = HeroUIAlertDialog.Header
const AlertDialogFooter = HeroUIAlertDialog.Footer
const AlertDialogTitle = HeroUIAlertDialog.Heading

function AlertDialogDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />
}

function AlertDialogAction({ className, variant: _variant = "danger", ...props }: React.ComponentProps<typeof HeroUIAlertDialog.CloseTrigger> & { variant?: string }) {
  return <HeroUIAlertDialog.CloseTrigger className={cn(className)} {...props} />
}

function AlertDialogCancel({ className, variant: _variant = "ghost", ...props }: React.ComponentProps<typeof HeroUIAlertDialog.CloseTrigger> & { variant?: string }) {
  return <HeroUIAlertDialog.CloseTrigger className={cn("mt-2 sm:mt-0", className)} {...props} />
}

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}