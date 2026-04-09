---
name: shadcn-expert
description: Expert guidance for building UI components with shadcn/ui library. Use when creating, customizing, or working with shadcn/ui components in React/Next.js projects. Covers component installation, theming, variants, animations, accessibility, form handling, and integration patterns. Trigger on requests like "create shadcn component", "add shadcn form", "customize shadcn theme", "shadcn dialog", "shadcn data table", or any UI development using shadcn/ui components.
---

# shadcn/ui Expert

Expert guidance for building production-ready UI components using shadcn/ui, a collection of re-usable components built with Radix UI and Tailwind CSS.

## Core principles

1. **Components are yours** - Copy components into your project, not installed as dependencies
2. **Built on standards** - Radix UI primitives + Tailwind CSS styling
3. **Accessible by default** - Radix UI provides ARIA-compliant components
4. **Customizable** - Modify components directly in your codebase
5. **TypeScript-first** - Full type safety across all components

## Installation workflow

When adding shadcn/ui components to a project:

1. **Initialize (first-time only)**:
   ```bash
   npx shadcn@latest init
   ```
   This creates `components.json` config and sets up paths

2. **Add components**:
   ```bash
   npx shadcn@latest add [component-name]
   ```
   Components get copied to `components/ui/` directory

3. **Import and use**:
   ```tsx
   import { Button } from "@/components/ui/button"
   ```

## Component patterns

### Button variants

shadcn/ui uses class-variance-authority (CVA) for variant management:

```tsx
// Extend button variants
const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input bg-background",
        secondary: "bg-secondary text-secondary-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

Add custom variants by extending the variants object.

### Form handling

shadcn/ui forms use React Hook Form + Zod for validation:

```tsx
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.string().email(),
})

export function ProfileForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Handle submission
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>Your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
```

### Dialog patterns

For modals and dialogs, prefer composition:

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you absolutely sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button type="submit">Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Data tables

For data tables with sorting, filtering, and pagination:
- Use TanStack Table (React Table) as the base
- Add shadcn/ui table components for styling
- See `references/data-table-patterns.md` for complete implementation

## Theming

### Color system

shadcn/ui uses CSS variables for theming. Define in `globals.css`:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    /* ... more variables */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... dark mode variables */
  }
}
```

Use Tailwind color names that reference these variables:
```tsx
<div className="bg-background text-foreground">
  <Button className="bg-primary text-primary-foreground">
    Click me
  </Button>
</div>
```

### Custom themes

To add custom color schemes:
1. Define new CSS variables in `globals.css`
2. Use the color names in Tailwind classes
3. Consider using the theme generator at ui.shadcn.com/themes

## Animation patterns

shadcn/ui components support Framer Motion for advanced animations. For component-level animations:

```tsx
import { motion } from "framer-motion"

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  <Card>Content</Card>
</motion.div>
```

For list animations with AnimatePresence:

```tsx
import { AnimatePresence, motion } from "framer-motion"

<AnimatePresence>
  {items.map((item) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      <Card>{item.content}</Card>
    </motion.div>
  ))}
</AnimatePresence>
```

## Common component combinations

### Form with dialog
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Add Item</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add New Item</DialogTitle>
    </DialogHeader>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields */}
        <DialogFooter>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </form>
    </Form>
  </DialogContent>
</Dialog>
```

### Dropdown menu with actions
```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon">
      <MoreVertical className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuLabel>Actions</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={handleEdit}>
      <Pencil className="mr-2 h-4 w-4" />
      Edit
    </DropdownMenuItem>
    <DropdownMenuItem onClick={handleDelete} className="text-destructive">
      <Trash className="mr-2 h-4 w-4" />
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Accessibility guidelines

1. **Use semantic HTML** - shadcn/ui components use proper ARIA attributes
2. **Keyboard navigation** - All interactive components are keyboard accessible
3. **Focus management** - Dialogs, dropdowns trap focus appropriately
4. **Screen reader support** - Use `FormDescription` and `FormMessage` for context
5. **Color contrast** - Ensure theme colors meet WCAG standards

## Server components (Next.js)

Many shadcn/ui components work in React Server Components:
- Use "use client" directive only when needed (forms, dialogs, interactive elements)
- Server components: Card, Typography, Separator, Badge (static variants)
- Client components: Form, Dialog, Dropdown Menu, Toast, anything with state

## Best practices

1. **Component customization**: Modify components directly in `components/ui/` rather than extending
2. **Consistent spacing**: Use Tailwind spacing scale (gap-4, p-6, etc.)
3. **Responsive design**: Use Tailwind responsive prefixes (sm:, md:, lg:)
4. **Dark mode**: Test all components in both light and dark themes
5. **Performance**: Use dynamic imports for heavy components (data tables, calendars)

## Troubleshooting

**Component styling conflicts**: Ensure Tailwind processes component styles by checking `tailwind.config.js`:
```js
content: [
  "./app/**/*.{ts,tsx}",
  "./components/**/*.{ts,tsx}",
]
```

**TypeScript errors**: Run `npx shadcn@latest add [component]` again to get latest types

**Theme not applying**: Verify CSS variables are imported in root layout and `globals.css` is loaded

## Bundled resources

- **references/data-table-patterns.md**: Complete data table implementation patterns
- **references/component-library.md**: Full component API reference
- **references/advanced-patterns.md**: Complex composition patterns and custom hooks
