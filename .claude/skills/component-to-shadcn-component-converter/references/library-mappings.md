# Component Library Mapping Guide

Comprehensive mapping from popular UI libraries to shadcn/ui components.

## Material-UI (MUI) Mappings

### Layout Components

| MUI Component | shadcn/ui Equivalent | Notes |
|--------------|---------------------|-------|
| `Box` | Native `div` with Tailwind | Use Tailwind utilities for layout |
| `Container` | Native `div` with `container` class | Configure in tailwind.config |
| `Grid` | Tailwind grid utilities | Use `grid`, `grid-cols-*` |
| `Stack` | Native `div` with `flex` or `space-y-*` | Use Tailwind flex/space utilities |
| `Paper` | `Card` | Add elevation with shadow utilities |

### Data Display

| MUI Component | shadcn/ui Equivalent | Notes |
|--------------|---------------------|-------|
| `Avatar` | `Avatar` | `npx shadcn@latest add avatar` |
| `Badge` | `Badge` | `npx shadcn@latest add badge` |
| `Chip` | `Badge` | Similar functionality |
| `Divider` | `Separator` | `npx shadcn@latest add separator` |
| `List` | Custom with Tailwind | Use flex/grid with items |
| `Table` | `Table` | `npx shadcn@latest add table` |
| `Tooltip` | `Tooltip` | `npx shadcn@latest add tooltip` |
| `Typography` | Tailwind text utilities | Use `text-*`, `font-*` classes |

### Inputs

| MUI Component | shadcn/ui Equivalent | Notes |
|--------------|---------------------|-------|
| `Autocomplete` | `Command` with `Popover` | More work required for autocomplete |
| `Button` | `Button` | `npx shadcn@latest add button` |
| `ButtonGroup` | Custom with `Button` | Group buttons with flex |
| `Checkbox` | `Checkbox` | `npx shadcn@latest add checkbox` |
| `Fab` | `Button` with `size="icon"` | Add rounded-full class |
| `Radio` | `RadioGroup` | `npx shadcn@latest add radio-group` |
| `Select` | `Select` | `npx shadcn@latest add select` |
| `Slider` | `Slider` | `npx shadcn@latest add slider` |
| `Switch` | `Switch` | `npx shadcn@latest add switch` |
| `TextField` | `Input` + `Label` | Or use with `Form` components |

### Feedback

| MUI Component | shadcn/ui Equivalent | Notes |
|--------------|---------------------|-------|
| `Alert` | `Alert` | `npx shadcn@latest add alert` |
| `Backdrop` | Built into Dialog/Sheet | No separate component needed |
| `CircularProgress` | Custom or library | Use lucide-react `Loader2` icon |
| `Dialog` | `Dialog` | `npx shadcn@latest add dialog` |
| `LinearProgress` | `Progress` | `npx shadcn@latest add progress` |
| `Skeleton` | `Skeleton` | `npx shadcn@latest add skeleton` |
| `Snackbar` | `Toast` + `Toaster` | `npx shadcn@latest add toast` |

### Navigation

| MUI Component | shadcn/ui Equivalent | Notes |
|--------------|---------------------|-------|
| `AppBar` | Custom navigation | Build with flex + shadcn components |
| `BottomNavigation` | Custom navigation | Use Tabs or custom component |
| `Breadcrumbs` | `Breadcrumb` | `npx shadcn@latest add breadcrumb` |
| `Drawer` | `Sheet` | `npx shadcn@latest add sheet` |
| `Link` | Next.js `Link` | Use with Button `asChild` |
| `Menu` | `DropdownMenu` | `npx shadcn@latest add dropdown-menu` |
| `Pagination` | `Pagination` | `npx shadcn@latest add pagination` |
| `Tabs` | `Tabs` | `npx shadcn@latest add tabs` |

### Surfaces

| MUI Component | shadcn/ui Equivalent | Notes |
|--------------|---------------------|-------|
| `Accordion` | `Accordion` | `npx shadcn@latest add accordion` |
| `Card` | `Card` | `npx shadcn@latest add card` |
| `Paper` | `Card` or custom `div` | Use shadow utilities |

## Ant Design Mappings

### General

| Ant Design | shadcn/ui Equivalent | Notes |
|-----------|---------------------|-------|
| `Button` | `Button` | Similar API |
| `Icon` | lucide-react | Use icon library |
| `Typography` | Tailwind text utilities | Text, Title, Paragraph |

### Layout

| Ant Design | shadcn/ui Equivalent | Notes |
|-----------|---------------------|-------|
| `Layout` | Custom with Tailwind | Sider, Header, Content, Footer |
| `Grid` | Tailwind grid | Row, Col → grid utilities |
| `Space` | Tailwind space utilities | `space-x-*`, `space-y-*` |
| `Divider` | `Separator` | Horizontal/vertical |

### Navigation

| Ant Design | shadcn/ui Equivalent | Notes |
|-----------|---------------------|-------|
| `Affix` | Custom with position | Sticky/fixed positioning |
| `Breadcrumb` | `Breadcrumb` | Similar structure |
| `Dropdown` | `DropdownMenu` | Menu items |
| `Menu` | `NavigationMenu` or custom | More complex navigation |
| `Pagination` | `Pagination` | Similar API |
| `Steps` | Custom stepper | Build with Tailwind |

### Data Entry

| Ant Design | shadcn/ui Equivalent | Notes |
|-----------|---------------------|-------|
| `AutoComplete` | `Command` + `Popover` | More assembly required |
| `Cascader` | Multiple `Select` | Chain selects |
| `Checkbox` | `Checkbox` | Individual + Group |
| `DatePicker` | `Calendar` + `Popover` | `npx shadcn@latest add calendar` |
| `Form` | `Form` components | With React Hook Form |
| `Input` | `Input` | TextArea, Search |
| `InputNumber` | `Input` with type="number" | Add increment buttons |
| `Radio` | `RadioGroup` | Radio.Group → RadioGroup |
| `Rate` | Custom rating | Build with stars |
| `Select` | `Select` | Similar functionality |
| `Slider` | `Slider` | Range support |
| `Switch` | `Switch` | Toggle |
| `TimePicker` | Custom or library | Use time input |
| `Transfer` | Custom component | Build with lists |
| `TreeSelect` | Custom component | Hierarchical select |
| `Upload` | Custom upload | File input + preview |

### Data Display

| Ant Design | shadcn/ui Equivalent | Notes |
|-----------|---------------------|-------|
| `Avatar` | `Avatar` | Similar API |
| `Badge` | `Badge` | Count/dot badges |
| `Calendar` | `Calendar` | Full calendar |
| `Card` | `Card` | Meta, Grid support |
| `Carousel` | `Carousel` | `npx shadcn@latest add carousel` |
| `Collapse` | `Accordion` | Panel → AccordionItem |
| `Descriptions` | Custom layout | Description list |
| `Empty` | Custom empty state | Build with Tailwind |
| `List` | Custom list | Build with Tailwind |
| `Popover` | `Popover` | Similar API |
| `Statistic` | Custom component | Display numbers |
| `Table` | `Table` | Use with TanStack Table |
| `Tabs` | `Tabs` | Similar structure |
| `Tag` | `Badge` | Similar purpose |
| `Timeline` | Custom timeline | Build with Tailwind |
| `Tooltip` | `Tooltip` | Similar API |
| `Tree` | Custom tree | Hierarchical data |

### Feedback

| Ant Design | shadcn/ui Equivalent | Notes |
|-----------|---------------------|-------|
| `Alert` | `Alert` | Similar variants |
| `Drawer` | `Sheet` | Side panel |
| `Message` | `Toast` | Global message |
| `Modal` | `Dialog` or `AlertDialog` | Confirm, info, etc. |
| `Notification` | `Toast` | Notification box |
| `Popconfirm` | `AlertDialog` | Confirmation popup |
| `Progress` | `Progress` | Circle/line progress |
| `Result` | Custom result page | Success/error states |
| `Skeleton` | `Skeleton` | Loading placeholder |
| `Spin` | Custom spinner | Lucide Loader2 |

## Chakra UI Mappings

### Layout

| Chakra UI | shadcn/ui Equivalent | Notes |
|----------|---------------------|-------|
| `Box` | Native `div` | Use Tailwind |
| `Center` | `div` with `flex items-center justify-center` | Flexbox centering |
| `Container` | `div` with `container` | Tailwind container |
| `Flex` | `div` with `flex` | Flexbox utilities |
| `Grid` | `div` with `grid` | Grid utilities |
| `SimpleGrid` | `div` with `grid` | Auto-fit columns |
| `Stack` | `div` with `flex flex-col` or `space-y-*` | Vertical/horizontal |
| `Wrap` | `div` with `flex flex-wrap` | Flex wrap |

### Forms

| Chakra UI | shadcn/ui Equivalent | Notes |
|----------|---------------------|-------|
| `Button` | `Button` | Similar API |
| `Checkbox` | `Checkbox` | Individual + Group |
| `Editable` | Custom editable | Inline editing |
| `FormControl` | `FormItem` | Form field wrapper |
| `Input` | `Input` | Similar API |
| `NumberInput` | `Input` type="number" | Stepper controls |
| `PinInput` | Custom PIN input | OTP/PIN entry |
| `Radio` | `RadioGroup` | Radio group |
| `RangeSlider` | `Slider` with range | Range selection |
| `Select` | `Select` | Native select |
| `Slider` | `Slider` | Single value |
| `Switch` | `Switch` | Toggle |
| `Textarea` | `Textarea` | Multi-line input |

### Data Display

| Chakra UI | shadcn/ui Equivalent | Notes |
|----------|---------------------|-------|
| `Avatar` | `Avatar` | With badge |
| `Badge` | `Badge` | Label badge |
| `Card` | `Card` | Content card |
| `Code` | `code` with styling | Inline/block code |
| `Divider` | `Separator` | Horizontal/vertical |
| `Kbd` | Custom kbd | Keyboard key |
| `List` | Custom list | Ordered/unordered |
| `Stat` | Custom stat | Statistics display |
| `Table` | `Table` | Data table |
| `Tag` | `Badge` | Removable tags |

### Overlay

| Chakra UI | shadcn/ui Equivalent | Notes |
|----------|---------------------|-------|
| `AlertDialog` | `AlertDialog` | Confirmation dialog |
| `Drawer` | `Sheet` | Slide-out panel |
| `Menu` | `DropdownMenu` | Dropdown menu |
| `Modal` | `Dialog` | Modal dialog |
| `Popover` | `Popover` | Floating content |
| `Tooltip` | `Tooltip` | Hover tooltip |

### Disclosure

| Chakra UI | shadcn/ui Equivalent | Notes |
|----------|---------------------|-------|
| `Accordion` | `Accordion` | Collapsible sections |
| `Tabs` | `Tabs` | Tab panels |
| `VisuallyHidden` | `sr-only` class | Screen reader only |

### Feedback

| Chakra UI | shadcn/ui Equivalent | Notes |
|----------|---------------------|-------|
| `Alert` | `Alert` | Status alerts |
| `CircularProgress` | Custom spinner | Loading indicator |
| `Progress` | `Progress` | Progress bar |
| `Skeleton` | `Skeleton` | Loading skeleton |
| `Spinner` | Custom spinner | Loading spinner |
| `Toast` | `Toast` | Notifications |

### Typography

| Chakra UI | shadcn/ui Equivalent | Notes |
|----------|---------------------|-------|
| `Heading` | Tailwind heading utilities | `text-*`, `font-bold` |
| `Text` | Tailwind text utilities | Paragraph text |

### Media and Icons

| Chakra UI | shadcn/ui Equivalent | Notes |
|----------|---------------------|-------|
| `Icon` | lucide-react | Icon library |
| `Image` | Next.js `Image` | Optimized images |

## Bootstrap Mappings

### Components

| Bootstrap | shadcn/ui Equivalent | Notes |
|----------|---------------------|-------|
| `Accordion` | `Accordion` | Collapsible items |
| `Alert` | `Alert` | Contextual feedback |
| `Badge` | `Badge` | Count indicators |
| `Breadcrumb` | `Breadcrumb` | Navigation path |
| `Button` | `Button` | Action buttons |
| `Button Group` | Flex with Buttons | Group buttons |
| `Card` | `Card` | Content container |
| `Carousel` | `Carousel` | Image slider |
| `Dropdown` | `DropdownMenu` | Menu dropdown |
| `Form` | `Form` components | Form controls |
| `Input Group` | Custom composition | Input with addons |
| `Modal` | `Dialog` | Modal windows |
| `Navbar` | Custom navigation | Navigation bar |
| `Offcanvas` | `Sheet` | Side panel |
| `Pagination` | `Pagination` | Page navigation |
| `Popover` | `Popover` | Floating content |
| `Progress` | `Progress` | Progress indicator |
| `Spinner` | Custom spinner | Loading state |
| `Table` | `Table` | Data tables |
| `Tabs` | `Tabs` | Tab navigation |
| `Toast` | `Toast` | Notifications |
| `Tooltip` | `Tooltip` | Hover info |

### Form Controls

| Bootstrap | shadcn/ui Equivalent | Notes |
|----------|---------------------|-------|
| `Input` | `Input` | Text inputs |
| `Select` | `Select` | Dropdown select |
| `Checkbox` | `Checkbox` | Checkboxes |
| `Radio` | `RadioGroup` | Radio buttons |
| `Range` | `Slider` | Range slider |
| `File` | Custom file input | File upload |
| `Textarea` | `Textarea` | Multi-line text |

## Tailwind UI Patterns

Most Tailwind UI patterns translate directly since shadcn/ui uses Tailwind:

1. Copy Tailwind classes directly
2. Replace interactive parts with shadcn components
3. Maintain spacing and layout with Tailwind utilities

**Example: Tailwind UI Card → shadcn Card**
```tsx
// Tailwind UI pattern
<div className="bg-white rounded-lg shadow p-6">
  <h3 className="text-lg font-medium">Title</h3>
  <p className="mt-2 text-gray-600">Content</p>
</div>

// With shadcn Card
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-gray-600">Content</p>
  </CardContent>
</Card>
```

## Semantic UI Mappings

### Elements

| Semantic UI | shadcn/ui Equivalent | Notes |
|------------|---------------------|-------|
| `Button` | `Button` | Action buttons |
| `Container` | Container class | Max-width container |
| `Divider` | `Separator` | Section divider |
| `Header` | Tailwind typography | Heading styles |
| `Icon` | lucide-react | Icon library |
| `Image` | Next.js Image | Images |
| `Input` | `Input` | Text input |
| `Label` | `Badge` or `Label` | Labels/tags |
| `List` | Custom list | Lists |
| `Segment` | `Card` | Content block |

### Collections

| Semantic UI | shadcn/ui Equivalent | Notes |
|------------|---------------------|-------|
| `Breadcrumb` | `Breadcrumb` | Navigation |
| `Form` | `Form` components | Forms |
| `Grid` | Tailwind grid | Grid layout |
| `Menu` | `NavigationMenu` | Navigation |
| `Message` | `Alert` | Messages |
| `Table` | `Table` | Tables |

### Views

| Semantic UI | shadcn/ui Equivalent | Notes |
|------------|---------------------|-------|
| `Card` | `Card` | Card component |
| `Comment` | Custom component | Comments |
| `Feed` | Custom component | Activity feed |
| `Item` | Custom component | Item list |
| `Statistic` | Custom component | Statistics |

### Modules

| Semantic UI | shadcn/ui Equivalent | Notes |
|------------|---------------------|-------|
| `Accordion` | `Accordion` | Collapsible |
| `Checkbox` | `Checkbox` | Checkboxes |
| `Dimmer` | Dialog overlay | Dimming effect |
| `Dropdown` | `Select` or `DropdownMenu` | Dropdown |
| `Embed` | Custom iframe | Video embed |
| `Modal` | `Dialog` | Modal |
| `Popup` | `Popover` | Popup |
| `Progress` | `Progress` | Progress bar |
| `Rating` | Custom rating | Star rating |
| `Search` | `Command` | Search |
| `Sidebar` | `Sheet` | Sidebar |
| `Tab` | `Tabs` | Tabs |
| `Transition` | Tailwind transitions | Animations |

## Prop Mapping Examples

### Common prop conversions:

**onClick → onClick** (same)
```tsx
// All libraries
<Button onClick={handleClick}>
```

**disabled → disabled** (same)
```tsx
// All libraries
<Button disabled={isDisabled}>
```

**className → className** (same)
```tsx
// All libraries - merge with cn()
<Button className={cn("custom-class", className)}>
```

**color/variant → variant**
```tsx
// MUI
<Button color="primary">
// shadcn
<Button variant="default">

// Chakra
<Button colorScheme="blue">
// shadcn
<Button> // or customize theme
```

**size → size**
```tsx
// Most libraries use similar sizes
<Button size="sm" | "default" | "lg">
```

**fullWidth → className="w-full"**
```tsx
// MUI
<Button fullWidth>
// shadcn
<Button className="w-full">
```

**open/isOpen → open**
```tsx
// Various
<Modal open={isOpen} isOpen={isOpen}>
// shadcn
<Dialog open={isOpen}>
```

**onClose → onOpenChange**
```tsx
// Various
<Modal onClose={() => setOpen(false)}>
// shadcn
<Dialog onOpenChange={setOpen}>
```
