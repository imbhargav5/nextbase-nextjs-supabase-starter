# Advanced shadcn/ui Patterns

Complex composition patterns, custom hooks, and advanced techniques for shadcn/ui.

## Custom variant patterns

### Extending button variants with new colors

```tsx
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
        // Custom variants
        success: "bg-green-500 text-white hover:bg-green-600",
        warning: "bg-yellow-500 text-white hover:bg-yellow-600",
        info: "bg-blue-500 text-white hover:bg-blue-600",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
        xs: "h-8 px-2 text-xs",
        xl: "h-12 px-10 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}
```

### Compound variants for complex styling

```tsx
const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        primary: "bg-blue-500",
        secondary: "bg-gray-500",
      },
      size: {
        sm: "text-sm",
        lg: "text-lg",
      },
      loading: {
        true: "opacity-50 cursor-not-allowed",
      },
    },
    compoundVariants: [
      {
        variant: "primary",
        size: "lg",
        className: "uppercase font-bold",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "sm",
    },
  }
)
```

## Controlled vs uncontrolled patterns

### Controlled component pattern

```tsx
export function ControlledDialog() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Submit logic
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Open Form</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <DialogFooter>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

### Uncontrolled with refs

```tsx
export function UncontrolledDialog() {
  const closeRef = useRef<HTMLButtonElement>(null)

  const handleSubmit = (formData: FormData) => {
    // Submit logic
    closeRef.current?.click() // Close dialog
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Form</Button>
      </DialogTrigger>
      <DialogContent>
        <form action={handleSubmit}>
          <Input name="name" />
          <DialogFooter>
            <DialogClose asChild>
              <button ref={closeRef} style={{ display: "none" }} />
            </DialogClose>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

## Custom hooks for shadcn/ui

### useDisclosure hook for modal state

```tsx
import { useState, useCallback } from "react"

interface UseDisclosureReturn {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  onToggle: () => void
}

export function useDisclosure(defaultIsOpen = false): UseDisclosureReturn {
  const [isOpen, setIsOpen] = useState(defaultIsOpen)

  const onOpen = useCallback(() => setIsOpen(true), [])
  const onClose = useCallback(() => setIsOpen(false), [])
  const onToggle = useCallback(() => setIsOpen((prev) => !prev), [])

  return { isOpen, onOpen, onClose, onToggle }
}

// Usage
function MyComponent() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button onClick={onOpen}>Open</Button>
      </DialogTrigger>
      {/* ... */}
    </Dialog>
  )
}
```

### useToast wrapper with queue

```tsx
import { useToast as useToastPrimitive } from "@/components/ui/use-toast"

interface ToastOptions {
  title: string
  description?: string
  variant?: "default" | "destructive"
  duration?: number
}

export function useToast() {
  const { toast } = useToastPrimitive()

  const success = useCallback((options: Omit<ToastOptions, "variant">) => {
    toast({
      ...options,
      variant: "default",
      title: `✅ ${options.title}`,
    })
  }, [toast])

  const error = useCallback((options: Omit<ToastOptions, "variant">) => {
    toast({
      ...options,
      variant: "destructive",
      title: `❌ ${options.title}`,
    })
  }, [toast])

  const info = useCallback((options: Omit<ToastOptions, "variant">) => {
    toast({
      ...options,
      title: `ℹ️ ${options.title}`,
    })
  }, [toast])

  return { toast, success, error, info }
}

// Usage
const { success, error } = useToast()
success({ title: "Saved!", description: "Your changes were saved." })
```

### useMediaQuery for responsive behavior

```tsx
import { useState, useEffect } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    const listener = () => setMatches(media.matches)
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [matches, query])

  return matches
}

// Usage
function ResponsiveComponent() {
  const isMobile = useMediaQuery("(max-width: 768px)")

  return (
    <Sheet open={isMobile ? isOpen : false}>
      {/* Mobile drawer */}
    </Sheet>
  )
}
```

## Complex composition patterns

### Multi-step form wizard

```tsx
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

const steps = [
  {
    id: "personal",
    schema: z.object({
      firstName: z.string().min(2),
      lastName: z.string().min(2),
    }),
  },
  {
    id: "contact",
    schema: z.object({
      email: z.string().email(),
      phone: z.string().min(10),
    }),
  },
  {
    id: "preferences",
    schema: z.object({
      newsletter: z.boolean(),
      notifications: z.boolean(),
    }),
  },
]

export function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({})

  const form = useForm({
    resolver: zodResolver(steps[currentStep].schema),
    defaultValues: formData,
  })

  const onNext = (data: any) => {
    setFormData({ ...formData, ...data })
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Final submission
      console.log("Complete form data:", { ...formData, ...data })
    }
  }

  const onPrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step {currentStep + 1} of {steps.length}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onNext)}>
            {/* Render current step fields */}
            <div className="space-y-4">
              {currentStep === 0 && (
                <>
                  <FormField name="firstName" {...} />
                  <FormField name="lastName" {...} />
                </>
              )}
              {currentStep === 1 && (
                <>
                  <FormField name="email" {...} />
                  <FormField name="phone" {...} />
                </>
              )}
              {currentStep === 2 && (
                <>
                  <FormField name="newsletter" {...} />
                  <FormField name="notifications" {...} />
                </>
              )}
            </div>
            <div className="flex justify-between mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onPrevious}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              <Button type="submit">
                {currentStep === steps.length - 1 ? "Submit" : "Next"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
```

### Combobox (autocomplete) pattern

```tsx
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const frameworks = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt.js", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
]

export function Combobox() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select framework..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            {frameworks.map((framework) => (
              <CommandItem
                key={framework.value}
                value={framework.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === framework.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {framework.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
```

### Drag and drop file upload

```tsx
import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X } from "lucide-react"

export function FileUpload() {
  const [files, setFiles] = useState<File[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
  })

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
          )}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            {isDragActive
              ? "Drop the files here..."
              : "Drag & drop files here, or click to select"}
          </p>
        </div>

        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-lg border"
              >
                <span className="text-sm truncate">{file.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

## Form patterns with server actions

### Next.js 14+ server action integration

```tsx
"use client"

import { useFormState, useFormStatus } from "react-dom"
import { createUser } from "@/app/actions"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating..." : "Create User"}
    </Button>
  )
}

export function ServerActionForm() {
  const [state, formAction] = useFormState(createUser, { message: "" })

  return (
    <form action={formAction}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        {state.message && (
          <Alert variant={state.error ? "destructive" : "default"}>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}
        <SubmitButton />
      </div>
    </form>
  )
}
```

Server action:
```tsx
"use server"

import { z } from "zod"

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
})

export async function createUser(prevState: any, formData: FormData) {
  const validatedFields = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  })

  if (!validatedFields.success) {
    return {
      error: true,
      message: "Invalid fields",
    }
  }

  try {
    // Database operation
    await db.user.create({ data: validatedFields.data })
    return { message: "User created successfully!" }
  } catch (error) {
    return {
      error: true,
      message: "Failed to create user",
    }
  }
}
```

## Accessibility enhancements

### Keyboard navigation wrapper

```tsx
import { useEffect, useRef } from "react"

export function useTrapFocus(isOpen: boolean) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const container = containerRef.current
    if (!container) return

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    firstElement?.focus()

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    container.addEventListener("keydown", handleTabKey)
    return () => container.removeEventListener("keydown", handleTabKey)
  }, [isOpen])

  return containerRef
}
```

### Announce changes to screen readers

```tsx
import { useEffect, useRef } from "react"

export function useAnnounce() {
  const announceRef = useRef<HTMLDivElement>(null)

  const announce = (message: string) => {
    if (announceRef.current) {
      announceRef.current.textContent = message
    }
  }

  return {
    announce,
    AriaLive: () => (
      <div
        ref={announceRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
    ),
  }
}

// Usage
function MyComponent() {
  const { announce, AriaLive } = useAnnounce()

  const handleAction = () => {
    // Do something
    announce("Action completed successfully")
  }

  return (
    <>
      <AriaLive />
      <Button onClick={handleAction}>Do Action</Button>
    </>
  )
}
```

## Performance optimization

### Lazy load heavy components

```tsx
import dynamic from "next/dynamic"

const DataTable = dynamic(() => import("@/components/data-table"), {
  loading: () => <Skeleton className="h-[400px] w-full" />,
  ssr: false,
})

const Calendar = dynamic(() => import("@/components/ui/calendar"), {
  loading: () => <Skeleton className="h-[300px] w-[300px]" />,
})
```

### Virtualized lists for performance

```tsx
import { useVirtualizer } from "@tanstack/react-virtual"
import { useRef } from "react"

export function VirtualizedList({ items }: { items: any[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  })

  return (
    <div
      ref={parentRef}
      className="h-[400px] overflow-auto border rounded-md"
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <div className="px-4 py-2 border-b">
              {items[virtualItem.index].name}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

## Testing patterns

### Component testing with Testing Library

```tsx
import { render, screen, fireEvent } from "@testing-library/react"
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"

describe("Dialog", () => {
  it("opens when trigger is clicked", async () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>Content</DialogContent>
      </Dialog>
    )

    const trigger = screen.getByText("Open")
    fireEvent.click(trigger)

    expect(screen.getByText("Content")).toBeInTheDocument()
  })

  it("closes when clicking outside", async () => {
    const { container } = render(
      <Dialog defaultOpen>
        <DialogContent>Content</DialogContent>
      </Dialog>
    )

    const overlay = container.querySelector("[data-radix-dialog-overlay]")
    fireEvent.click(overlay!)

    expect(screen.queryByText("Content")).not.toBeInTheDocument()
  })
})
```
