---
name: component-to-shadcn-component-converter
description: Convert existing React components, UI libraries, poorly made components, or design implementations to shadcn/ui components. Use when converting Material-UI, Ant Design, Chakra UI, or custom components to shadcn/ui, migrating from other component libraries, translating Figma/design mockups to shadcn components, refactoring existing React code to use shadcn/ui patterns, or fixing poorly written/structured components by rebuilding them with shadcn/ui. Also use when asked to rebuild, recreate, reimplement, clean up, or improve components using shadcn/ui.
---

# Component to shadcn/ui Converter

Systematic approach for converting components from other libraries, custom implementations, or poorly made components to shadcn/ui.

## Conversion Workflow

### Step 1: Analyze Source Component

Identify the component's:
- **Core functionality**: What does it do?
- **Interactive elements**: Buttons, inputs, modals, etc.
- **State management**: Controlled/uncontrolled, form state, UI state
- **Visual hierarchy**: Layout, spacing, typography
- **Accessibility features**: ARIA attributes, keyboard navigation
- **Styling approach**: CSS-in-JS, Tailwind, CSS modules, inline styles, etc.
- **Code quality issues**: Anti-patterns, poor structure, accessibility gaps

### Step 2: Map to shadcn/ui Primitives

Match source patterns to shadcn components:

**Common mappings:**
```
Modal/Dialog → Dialog
Dropdown → DropdownMenu or Select
Menu → DropdownMenu or NavigationMenu
Tooltip → Tooltip
Popover → Popover
Alert → Alert
Card → Card
Tabs → Tabs
Accordion → Accordion
Table → Table
Form inputs → Input, Textarea, Select, Checkbox, RadioGroup
Button → Button
Badge → Badge
```

### Step 3: Install Required Components

```bash
# Install only what you need
npx shadcn@latest add dialog
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add form
```

### Step 4: Convert Structure

Follow shadcn's composition patterns:
- Break down complex components into smaller pieces
- Use compound component patterns
- Leverage `asChild` for flexibility
- Apply proper TypeScript types

### Step 5: Convert Styling

Replace existing styles with Tailwind + shadcn patterns:
- Use `cn()` utility for className merging
- Apply shadcn's CSS variables for theming
- Use Tailwind utility classes
- Maintain responsive design with Tailwind breakpoints

### Step 6: Preserve Functionality

Ensure all features work:
- Test interactive behaviors
- Verify accessibility
- Check form validation
- Test keyboard navigation
- Validate responsive behavior

## Converting Poorly Made Components

### Common Anti-Patterns and Fixes

#### Anti-Pattern 1: Inline Styles Everywhere

**Before (Poorly made):**
```tsx
function BadCard({ title, content }) {
  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '16px'
    }}>
      <h3 style={{
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '12px',
        color: '#333'
      }}>
        {title}
      </h3>
      <p style={{
        fontSize: '14px',
        color: '#666',
        lineHeight: '1.5'
      }}>
        {content}
      </p>
    </div>
  )
}
```

**After (shadcn/ui):**
```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function GoodCard({ title, content }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {content}
        </p>
      </CardContent>
    </Card>
  )
}
```

#### Anti-Pattern 2: No Accessibility

**Before (Poorly made):**
```tsx
function BadModal({ isOpen, onClose, children }) {
  if (!isOpen) return null
  
  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          maxWidth: '500px',
          width: '100%'
        }}
      >
        <button 
          onClick={onClose}
          style={{ float: 'right', cursor: 'pointer' }}
        >
          X
        </button>
        {children}
      </div>
    </div>
  )
}
```

**After (shadcn/ui):**
```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

function GoodModal({ isOpen, onOpenChange, title, children }) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
```

**Improvements:**
- Proper ARIA attributes
- Keyboard navigation (Escape to close)
- Focus management
- Screen reader support

#### Anti-Pattern 3: Mixed Concerns

**Before (Poorly made):**
```tsx
function BadUserForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}
    
    if (!name) newErrors.name = 'Name is required'
    if (!email) newErrors.email = 'Email is required'
    if (email && !email.includes('@')) newErrors.email = 'Invalid email'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setLoading(true)
    try {
      await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({ name, email })
      })
      alert('Success!')
    } catch (err) {
      alert('Error!')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px' }}>Name</label>
        <input 
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '8px', 
            border: errors.name ? '1px solid red' : '1px solid #ccc' 
          }}
        />
        {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px' }}>Email</label>
        <input 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '8px', 
            border: errors.email ? '1px solid red' : '1px solid #ccc' 
          }}
        />
        {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
      </div>
      
      <button 
        type="submit" 
        disabled={loading}
        style={{
          backgroundColor: loading ? '#ccc' : '#0070f3',
          color: 'white',
          padding: '8px 16px',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Loading...' : 'Submit'}
      </button>
    </form>
  )
}
```

**After (shadcn/ui):**
```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
})

function GoodUserForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "" },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(values),
      })
      toast({
        title: "Success",
        description: "User created successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create user",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Loading..." : "Submit"}
        </Button>
      </form>
    </Form>
  )
}
```

**Improvements:**
- Separated validation logic (Zod schema)
- Proper form state management
- Better error handling
- Proper loading states
- Clean, maintainable code

#### Anti-Pattern 4: Non-Responsive Design

**Before (Poorly made):**
```tsx
function BadGrid({ items }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px'
    }}>
      {items.map(item => (
        <div 
          key={item.id}
          style={{
            padding: '16px',
            border: '1px solid #ccc',
            borderRadius: '8px'
          }}
        >
          <img src={item.image} style={{ width: '100%' }} />
          <h3>{item.title}</h3>
        </div>
      ))}
    </div>
  )
}
```

**After (shadcn/ui):**
```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

function GoodGrid({ items }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map(item => (
        <Card key={item.id}>
          <CardHeader className="p-0">
            <Image 
              src={item.image} 
              alt={item.title}
              width={300}
              height={200}
              className="w-full h-48 object-cover rounded-t-lg"
            />
          </CardHeader>
          <CardContent className="pt-4">
            <CardTitle className="text-lg">{item.title}</CardTitle>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

#### Anti-Pattern 5: Prop Drilling and Poor State

**Before (Poorly made):**
```tsx
function BadApp() {
  const [user, setUser] = useState(null)
  const [theme, setTheme] = useState('light')
  const [notifications, setNotifications] = useState([])
  
  return (
    <div>
      <Header 
        user={user} 
        theme={theme} 
        setTheme={setTheme}
        notifications={notifications}
      />
      <Sidebar user={user} theme={theme} />
      <Content 
        user={user} 
        theme={theme}
        notifications={notifications}
        setNotifications={setNotifications}
      />
    </div>
  )
}
```

**After (shadcn/ui with proper context):**
```tsx
import { createContext, useContext, useState } from "react"
import { ThemeProvider } from "@/components/providers/theme-provider"

const UserContext = createContext(null)
const NotificationContext = createContext(null)

export function useUser() {
  return useContext(UserContext)
}

export function useNotifications() {
  return useContext(NotificationContext)
}

function GoodApp() {
  const [user, setUser] = useState(null)
  const [notifications, setNotifications] = useState([])
  
  return (
    <ThemeProvider>
      <UserContext.Provider value={{ user, setUser }}>
        <NotificationContext.Provider value={{ notifications, setNotifications }}>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Header />
              <Content />
            </div>
          </div>
        </NotificationContext.Provider>
      </UserContext.Provider>
    </ThemeProvider>
  )
}
```

#### Anti-Pattern 6: No Error Boundaries

**Before (Poorly made):**
```tsx
function BadDataDisplay({ data }) {
  return (
    <div>
      <h2>{data.title}</h2>
      <p>{data.description}</p>
      <ul>
        {data.items.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  )
}
```

**After (shadcn/ui with proper error handling):**
```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

function GoodDataDisplay({ data, isLoading, error }) {
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load data. Please try again later.
        </AlertDescription>
      </Alert>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data || !data.items?.length) {
    return (
      <Alert>
        <AlertDescription>No data available</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{data.title}</CardTitle>
        <CardDescription>{data.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {data.items.map(item => (
            <li key={item.id} className="text-sm">
              {item.name}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
```

#### Anti-Pattern 7: Inconsistent Spacing and Layout

**Before (Poorly made):**
```tsx
function BadLayout() {
  return (
    <div style={{ padding: '23px' }}>
      <div style={{ marginBottom: '17px' }}>
        <h1 style={{ fontSize: '27px', marginBottom: '11px' }}>Title</h1>
        <p style={{ marginBottom: '9px' }}>Description</p>
      </div>
      <div style={{ display: 'flex', gap: '13px' }}>
        <button style={{ padding: '9px 18px' }}>Cancel</button>
        <button style={{ padding: '9px 18px' }}>Save</button>
      </div>
    </div>
  )
}
```

**After (shadcn/ui with consistent spacing):**
```tsx
import { Button } from "@/components/ui/button"

function GoodLayout() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Title</h1>
        <p className="text-muted-foreground">Description</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save</Button>
      </div>
    </div>
  )
}
```

#### Anti-Pattern 8: Tight Coupling

**Before (Poorly made):**
```tsx
function BadButton() {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { trackEvent } = useAnalytics()
  
  const handleClick = () => {
    trackEvent('button_clicked')
    addToCart(product)
    navigate('/cart')
  }
  
  return (
    <button onClick={handleClick}>
      Add to Cart
    </button>
  )
}
```

**After (shadcn/ui with proper separation):**
```tsx
import { Button } from "@/components/ui/button"

interface AddToCartButtonProps {
  onAddToCart: () => void
  disabled?: boolean
}

function GoodButton({ onAddToCart, disabled }: AddToCartButtonProps) {
  return (
    <Button onClick={onAddToCart} disabled={disabled}>
      Add to Cart
    </Button>
  )
}

// Usage in parent component
function ProductPage() {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { trackEvent } = useAnalytics()
  
  const handleAddToCart = () => {
    trackEvent('add_to_cart')
    addToCart(product)
    navigate('/cart')
  }
  
  return (
    <GoodButton 
      onAddToCart={handleAddToCart}
      disabled={!product.inStock}
    />
  )
}
```

### Fixing Code Quality Issues

When converting poorly made components, also fix:

1. **Missing TypeScript types** - Add proper interfaces
2. **No key props in lists** - Add unique keys
3. **Mutating state directly** - Use proper state setters
4. **Memory leaks** - Clean up effects and subscriptions
5. **Poor naming** - Use descriptive, consistent names
6. **Magic numbers** - Use constants or theme variables
7. **Duplicate code** - Extract reusable components
8. **No loading states** - Add proper loading indicators
9. **No error handling** - Add try-catch and error states
10. **Inconsistent patterns** - Standardize on shadcn patterns

## Conversion Examples (Libraries)

### Material-UI to shadcn/ui

#### MUI Dialog → shadcn Dialog

**Before (MUI):**
```tsx
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'

function MyDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Action</DialogTitle>
      <DialogContent>
        Are you sure you want to proceed?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirm} variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}
```

**After (shadcn/ui):**
```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

function MyDialog({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogDescription>
            Are you sure you want to proceed?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

**Key changes:**
- `onClose` → `onOpenChange` (takes boolean)
- Added `DialogDescription` for accessibility
- `variant="contained"` → default Button variant
- Use `DialogFooter` for action buttons

#### MUI TextField → shadcn Input + Form

**Before (MUI):**
```tsx
import TextField from '@mui/material/TextField'

function MyForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  return (
    <TextField
      label="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      error={!!error}
      helperText={error}
      fullWidth
    />
  )
}
```

**After (shadcn/ui with React Hook Form):**
```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
})

function MyForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  })

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} className="w-full" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  )
}
```

**Key changes:**
- Use React Hook Form + Zod for validation
- Structured form components with proper accessibility
- `fullWidth` → `className="w-full"`
- Validation integrated with form state

### Ant Design to shadcn/ui

#### Ant Modal → shadcn Dialog

**Before (Ant Design):**
```tsx
import { Modal, Button } from 'antd'

function MyModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button type="primary" onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>
      <Modal
        title="Delete Item"
        open={isOpen}
        onOk={handleDelete}
        onCancel={() => setIsOpen(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this item?</p>
      </Modal>
    </>
  )
}
```

**After (shadcn/ui):**
```tsx
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

function MyModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Open Modal</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Item</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this item?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

**Key changes:**
- Use `DialogTrigger` for the open button
- `danger` prop → `variant="destructive"`
- Explicit footer with action buttons
- Added `DialogDescription` for a11y

### Chakra UI to shadcn/ui

#### Chakra Modal → shadcn Dialog

**Before (Chakra UI):**
```tsx
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@chakra-ui/react'

function MyModal() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalBody>Modal content goes here</ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="blue">Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
```

**After (shadcn/ui):**
```tsx
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"

function MyModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Open Modal</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modal Title</DialogTitle>
          <DialogDescription>Modal content goes here</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Close
          </Button>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

**Key changes:**
- Replace `useDisclosure` hook with `useState`
- No need for `ModalOverlay` (built-in)
- `colorScheme` → use default variant (or customize theme)
- Use Tailwind spacing (`gap-2`) instead of `mr` props

## Custom Component Conversions

### Custom Modal → shadcn Dialog

**Before (Custom):**
```tsx
function CustomModal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose}>×</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}
```

**After (shadcn/ui):**
```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

function CustomModal({ isOpen, onOpenChange, title, children }) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
```

**Key changes:**
- Remove manual overlay and click handling
- Built-in close button
- Built-in accessibility features
- Proper focus management

## Design to shadcn/ui

### Figma/Sketch to shadcn

**Workflow:**
1. **Identify components** in design
2. **Map to shadcn primitives** (see reference file)
3. **Extract design tokens**:
   - Colors → CSS variables
   - Spacing → Tailwind spacing scale
   - Typography → Tailwind text utilities
   - Border radius → Tailwind rounded utilities

4. **Implement structure first**, styling second
5. **Test responsive breakpoints**

## State Management Conversions

### Redux Form → React Hook Form

**Before (Redux Form):**
```tsx
import { Field, reduxForm } from 'redux-form'

function MyForm({ handleSubmit }) {
  return (
    <form onSubmit={handleSubmit}>
      <Field name="email" component="input" type="email" />
      <Field name="password" component="input" type="password" />
      <button type="submit">Submit</button>
    </form>
  )
}

export default reduxForm({ form: 'myForm' })(MyForm)
```

**After (React Hook Form + shadcn):**
```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

function MyForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

## Migration Strategy

### Incremental Migration

1. **Start with new features** - Build new components with shadcn/ui
2. **Convert high-traffic pages** - Prioritize user-facing components
3. **Migrate shared components** - Buttons, inputs, modals used across app
4. **Convert remaining pages** - Gradually migrate legacy components
5. **Remove old library** - Once migration is complete

### Coexistence Pattern

Allow old and new components to coexist:

```tsx
// Create wrapper components for transition period
import { Button as ShadcnButton } from "@/components/ui/button"
import { Button as OldButton } from "@/old-ui/button"

export function Button(props) {
  // Use feature flag or gradual rollout
  if (useShadcn) {
    return <ShadcnButton {...props} />
  }
  return <OldButton {...props} />
}
```

## Conversion Checklist

For each component conversion:

- [ ] Install required shadcn components
- [ ] Map functionality to shadcn primitives
- [ ] Convert props/API to shadcn patterns
- [ ] Migrate styling to Tailwind
- [ ] Update state management if needed
- [ ] Fix code quality issues
- [ ] Test interactive behaviors
- [ ] Verify accessibility (keyboard nav, screen readers)
- [ ] Check responsive behavior
- [ ] Update tests
- [ ] Document any breaking changes

## Common Pitfalls

**❌ Don't wrap shadcn components unnecessarily:**
```tsx
// Bad
function MyButton({ children, ...props }) {
  return <Button {...props}>{children}</Button>
}

// Good - use shadcn Button directly
import { Button } from "@/components/ui/button"
```

**❌ Don't fight the composition model:**
```tsx
// Bad - trying to make it config-based
<Dialog config={{ title, description, actions }} />

// Good - use composition
<Dialog>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>{title}</DialogTitle>
      <DialogDescription>{description}</DialogDescription>
    </DialogHeader>
    <DialogFooter>{actions}</DialogFooter>
  </DialogContent>
</Dialog>
```

**❌ Don't ignore accessibility:**
```tsx
// Bad
<DialogContent>
  <h2>Title</h2>
  <p>Description</p>
</DialogContent>

// Good - use semantic components
<DialogContent>
  <DialogHeader>
    <DialogTitle>Title</DialogTitle>
    <DialogDescription>Description</DialogDescription>
  </DialogHeader>
</DialogContent>
```

## Resources

See reference files for:
- Complete library mapping guide
- Styling conversion patterns
- Common conversion recipes
