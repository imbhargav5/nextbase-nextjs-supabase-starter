# Styling Conversion Patterns

Guide for converting various styling approaches to shadcn/ui with Tailwind CSS.

## CSS-in-JS to Tailwind

### styled-components Conversions

#### Basic Styling

**Before:**
```tsx
import styled from 'styled-components'

const StyledCard = styled.div`
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`
```

**After:**
```tsx
<div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
```

#### With Props

**Before:**
```tsx
const Button = styled.button<{ $primary?: boolean }>`
  background-color: ${props => props.$primary ? '#3b82f6' : 'transparent'};
  color: ${props => props.$primary ? 'white' : '#3b82f6'};
  border: 1px solid #3b82f6;
  padding: 8px 16px;
  border-radius: 6px;
`

<Button $primary>Click me</Button>
```

**After:**
```tsx
import { Button } from "@/components/ui/button"

<Button variant="default">Click me</Button>
<Button variant="outline">Click me</Button>
```

#### Hover States

**Before:**
```tsx
const Link = styled.a`
  color: #3b82f6;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: #2563eb;
  }
`
```

**After:**
```tsx
<a className="text-blue-500 hover:text-blue-600 transition-colors">
```

#### Media Queries

**Before:**
```tsx
const Container = styled.div`
  padding: 16px;

  @media (min-width: 768px) {
    padding: 32px;
  }

  @media (min-width: 1024px) {
    padding: 48px;
  }
`
```

**After:**
```tsx
<div className="p-4 md:p-8 lg:p-12">
```

#### Complex Selectors

**Before:**
```tsx
const Nav = styled.nav`
  ul {
    display: flex;
    gap: 16px;
  }

  li {
    list-style: none;
  }

  a {
    color: #374151;
    &:hover {
      color: #111827;
    }
  }
`
```

**After:**
```tsx
<nav>
  <ul className="flex gap-4">
    <li className="list-none">
      <a className="text-gray-700 hover:text-gray-900">
    </li>
  </ul>
</nav>
```

### Emotion Conversions

#### css prop

**Before:**
```tsx
import { css } from '@emotion/react'

<div css={css`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background: white;
  border-radius: 8px;
`}>
```

**After:**
```tsx
<div className="flex flex-col gap-4 p-6 bg-white rounded-lg">
```

#### Dynamic Styles

**Before:**
```tsx
const getButtonStyles = (variant: string) => css`
  padding: 8px 16px;
  border-radius: 6px;
  background: ${variant === 'primary' ? '#3b82f6' : 'transparent'};
  color: ${variant === 'primary' ? 'white' : '#3b82f6'};
`

<button css={getButtonStyles('primary')}>
```

**After:**
```tsx
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

<Button variant={variant === 'primary' ? 'default' : 'outline'}>
```

#### Styled Components

**Before:**
```tsx
import styled from '@emotion/styled'

const Card = styled.div`
  background: white;
  padding: ${props => props.compact ? '12px' : '24px'};
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`
```

**After:**
```tsx
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

<Card className={cn(compact ? "p-3" : "p-6")}>
```

### CSS Modules to Tailwind

**Before (styles.module.css):**
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 16px;
}
```

**Before (Component):**
```tsx
import styles from './styles.module.css'

<div className={styles.container}>
  <div className={styles.card}>
    <h2 className={styles.title}>Title</h2>
  </div>
</div>
```

**After:**
```tsx
<div className="max-w-7xl mx-auto px-4">
  <Card>
    <CardHeader>
      <CardTitle>Title</CardTitle>
    </CardHeader>
  </Card>
</div>
```

## Theme Conversions

### Material-UI Theme → shadcn Theme

**Before (MUI theme):**
```tsx
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#3b82f6',
    },
    secondary: {
      main: '#8b5cf6',
    },
    error: {
      main: '#ef4444',
    },
    background: {
      default: '#f9fafb',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
  },
  spacing: 8,
})
```

**After (shadcn theme in globals.css):**
```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%; /* #3b82f6 */
    --primary-foreground: 210 40% 98%;
    --secondary: 262.1 83.3% 57.8%; /* #8b5cf6 */
    --secondary-foreground: 210 40% 98%;
    --destructive: 0 84.2% 60.2%; /* #ef4444 */
    --destructive-foreground: 210 40% 98%;
    /* ... other variables */
  }
}

body {
  font-family: 'Inter', sans-serif;
}
```

**And in tailwind.config.ts:**
```ts
export default {
  theme: {
    extend: {
      fontSize: {
        '2xl': '2.5rem', // h1
      },
    },
  },
}
```

### Chakra Theme → shadcn Theme

**Before (Chakra theme):**
```tsx
import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  colors: {
    brand: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      500: '#3b82f6',
      900: '#1e3a8a',
    },
  },
  fonts: {
    heading: '"Poppins", sans-serif',
    body: '"Inter", sans-serif',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'md',
      },
      variants: {
        primary: {
          bg: 'brand.500',
          color: 'white',
        },
      },
    },
  },
})
```

**After (shadcn theme):**
```css
/* globals.css */
@layer base {
  :root {
    --primary: 221.2 83.2% 53.3%; /* brand.500 */
    --radius: 0.375rem; /* md border radius */
  }
}
```

```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
}
```

```tsx
// Customize Button variant in button.tsx
const buttonVariants = cva(
  "font-semibold rounded-md", // baseStyle
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        // Add custom variant
        brand: "bg-brand-500 text-white hover:bg-brand-600",
      },
    },
  }
)
```

## Responsive Design Conversions

### Breakpoint Mappings

**Material-UI breakpoints:**
```tsx
theme.breakpoints.up('sm')  // >= 600px
theme.breakpoints.up('md')  // >= 900px
theme.breakpoints.up('lg')  // >= 1200px
theme.breakpoints.up('xl')  // >= 1536px
```

**Tailwind breakpoints:**
```
sm:  // >= 640px
md:  // >= 768px
lg:  // >= 1024px
xl:  // >= 1280px
2xl: // >= 1536px
```

**Before (MUI sx prop):**
```tsx
<Box
  sx={{
    padding: 2,
    [theme.breakpoints.up('md')]: {
      padding: 4,
    },
    [theme.breakpoints.up('lg')]: {
      padding: 6,
    },
  }}
>
```

**After (Tailwind):**
```tsx
<div className="p-2 md:p-4 lg:p-6">
```

### Responsive Utilities

**Before (Chakra):**
```tsx
<Stack
  direction={{ base: 'column', md: 'row' }}
  spacing={{ base: 4, md: 6 }}
  align={{ base: 'stretch', md: 'center' }}
>
```

**After (Tailwind):**
```tsx
<div className="flex flex-col md:flex-row gap-4 md:gap-6 items-stretch md:items-center">
```

## Animation Conversions

### CSS Animations → Tailwind

**Before:**
```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.element {
  animation: fadeIn 0.3s ease-in-out;
}
```

**After:**
```tsx
<div className="animate-in fade-in duration-300">
```

Or define custom animation:
```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out',
      },
    },
  },
}
```

### Framer Motion Integration

Combine Framer Motion with shadcn:

```tsx
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  <Card>
    <CardContent>Content</CardContent>
  </Card>
</motion.div>
```

## Color System Conversions

### Named Colors → Tailwind Colors

**Common conversions:**
```
primary     → bg-primary / text-primary
secondary   → bg-secondary / text-secondary
error       → bg-destructive / text-destructive
warning     → bg-yellow-500 / text-yellow-500
info        → bg-blue-500 / text-blue-500
success     → bg-green-500 / text-green-500
```

### Opacity/Alpha

**Before:**
```css
background-color: rgba(59, 130, 246, 0.5);
```

**After:**
```tsx
<div className="bg-blue-500/50">
```

### Gradient Backgrounds

**Before:**
```css
background: linear-gradient(to right, #3b82f6, #8b5cf6);
```

**After:**
```tsx
<div className="bg-gradient-to-r from-blue-500 to-purple-500">
```

## Spacing Conversions

### Material-UI spacing

MUI uses a base spacing unit (default 8px):
```tsx
padding: theme.spacing(2)     // 16px → p-4
margin: theme.spacing(1, 2)   // 8px 16px → m-1 mx-4
gap: theme.spacing(3)         // 24px → gap-6
```

**Conversion table:**
```
spacing(0.5) → 1 (4px)
spacing(1)   → 2 (8px)
spacing(2)   → 4 (16px)
spacing(3)   → 6 (24px)
spacing(4)   → 8 (32px)
spacing(5)   → 10 (40px)
```

### Chakra spacing

Chakra uses t-shirt sizes:
```
xs  → 1 (4px)
sm  → 2 (8px)
md  → 4 (16px)
lg  → 6 (24px)
xl  → 8 (32px)
2xl → 10 (40px)
```

## Typography Conversions

### Font Sizes

**MUI variants → Tailwind:**
```
h1      → text-4xl font-bold
h2      → text-3xl font-bold
h3      → text-2xl font-semibold
h4      → text-xl font-semibold
h5      → text-lg font-medium
h6      → text-base font-medium
body1   → text-base
body2   → text-sm
caption → text-xs
```

**Chakra sizes → Tailwind:**
```
xs → text-xs
sm → text-sm
md → text-base
lg → text-lg
xl → text-xl
2xl → text-2xl
3xl → text-3xl
4xl → text-4xl
```

### Font Weights

**Common mappings:**
```
light      → font-light (300)
regular    → font-normal (400)
medium     → font-medium (500)
semibold   → font-semibold (600)
bold       → font-bold (700)
```

## Shadow Conversions

**Material-UI elevation → Tailwind shadow:**
```
elevation={1}  → shadow-sm
elevation={2}  → shadow
elevation={3}  → shadow-md
elevation={4}  → shadow-lg
elevation={8}  → shadow-xl
elevation={12} → shadow-2xl
```

**Chakra shadow → Tailwind:**
```
sm    → shadow-sm
base  → shadow
md    → shadow-md
lg    → shadow-lg
xl    → shadow-xl
2xl   → shadow-2xl
```

## Border Conversions

### Border Radius

**MUI → Tailwind:**
```
borderRadius: 1  → rounded (4px)
borderRadius: 2  → rounded-md (8px)
borderRadius: 3  → rounded-lg (12px)
borderRadius: 4  → rounded-xl (16px)
borderRadius: '50%' → rounded-full
```

**Chakra → Tailwind:**
```
sm   → rounded-sm
md   → rounded-md
lg   → rounded-lg
xl   → rounded-xl
full → rounded-full
```

### Border Width

**All libraries → Tailwind:**
```
border: '1px'  → border
border: '2px'  → border-2
border: '4px'  → border-4
borderTop      → border-t
borderBottom   → border-b
```

## Flex & Grid Conversions

### Flexbox

**Before (various libraries):**
```tsx
display: 'flex'
flexDirection: 'column'
justifyContent: 'space-between'
alignItems: 'center'
gap: 16
```

**After (Tailwind):**
```tsx
<div className="flex flex-col justify-between items-center gap-4">
```

### Grid

**Before (CSS Grid):**
```css
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 24px;
```

**After (Tailwind):**
```tsx
<div className="grid grid-cols-3 gap-6">
```

## Practical Conversion Examples

### Complete Card Component

**Before (MUI):**
```tsx
import { Card, CardContent, Typography, Button } from '@mui/material'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
  card: {
    padding: theme.spacing(3),
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[2],
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 600,
    marginBottom: theme.spacing(2),
  },
  content: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(3),
  },
}))

function MyCard() {
  const classes = useStyles()
  
  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography className={classes.title}>
          Card Title
        </Typography>
        <Typography className={classes.content}>
          Card content goes here
        </Typography>
        <Button variant="contained" color="primary">
          Action
        </Button>
      </CardContent>
    </Card>
  )
}
```

**After (shadcn):**
```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

function MyCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Card content goes here
        </p>
        <Button>Action</Button>
      </CardContent>
    </Card>
  )
}
```

### Complex Form

**Before (Chakra):**
```tsx
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Checkbox,
  Button,
  VStack,
} from '@chakra-ui/react'

function MyForm() {
  return (
    <VStack spacing={4} align="stretch">
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input placeholder="Enter name" />
      </FormControl>
      
      <FormControl>
        <FormLabel>Country</FormLabel>
        <Select placeholder="Select country">
          <option value="us">USA</option>
          <option value="uk">UK</option>
        </Select>
      </FormControl>
      
      <Checkbox>Subscribe to newsletter</Checkbox>
      
      <Button colorScheme="blue" type="submit">
        Submit
      </Button>
    </VStack>
  )
}
```

**After (shadcn):**
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
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
  name: z.string().min(1),
  country: z.string(),
  subscribe: z.boolean(),
})

function MyForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      country: "",
      subscribe: false,
    },
  })

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
                <Input placeholder="Enter name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="us">USA</SelectItem>
                  <SelectItem value="uk">UK</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="subscribe"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="!mt-0">Subscribe to newsletter</FormLabel>
            </FormItem>
          )}
        />
        
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```
