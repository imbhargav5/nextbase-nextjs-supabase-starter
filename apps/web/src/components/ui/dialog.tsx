"use client"

import { Modal } from "@heroui/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const Dialog = Modal.Root

function DialogTrigger(props: React.ComponentProps<typeof Modal.Trigger>) {
  return <Modal.Trigger {...props} />
}

function DialogOverlay(props: React.ComponentProps<typeof Modal.Backdrop>) {
  return <Modal.Backdrop {...props} />
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: Omit<React.ComponentProps<typeof Modal.Container>, "children"> & {
  children?: React.ReactNode
  showCloseButton?: boolean
}) {
  return (
    <>
      <Modal.Backdrop />
      <Modal.Container className={cn("max-w-lg", className)} {...props}>
        <Modal.Dialog>
          {children}
          {showCloseButton && <Modal.CloseTrigger className="absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100" />}
        </Modal.Dialog>
      </Modal.Container>
    </>
  )
}

function DialogHeader(props: React.ComponentProps<typeof Modal.Header>) {
  return <Modal.Header {...props} />
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<typeof Modal.Footer> & { showCloseButton?: boolean }) {
  return (
    <Modal.Footer className={className} {...props}>
      {children}
      {showCloseButton && (
        <Modal.CloseTrigger>
          <Button variant="outline">Close</Button>
        </Modal.CloseTrigger>
      )}
    </Modal.Footer>
  )
}

function DialogTitle(props: React.ComponentProps<typeof Modal.Heading>) {
  return <Modal.Heading {...props} />
}

function DialogDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
}

function DialogClose(props: React.ComponentProps<typeof Modal.CloseTrigger>) {
  return <Modal.CloseTrigger {...props} />
}

function DialogPortal(_props: Record<string, unknown>) {
  return null
}

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogOverlay,
  DialogTitle,
  DialogClose,
}