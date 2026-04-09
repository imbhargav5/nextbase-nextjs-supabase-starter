# shadcn/ui Component Library Reference

Comprehensive API reference for all shadcn/ui components.

## Layout components

### Card
Container component with header, content, and footer sections.

```tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Main content */}
  </CardContent>
  <CardFooter>
    {/* Footer content */}
  </CardFooter>
</Card>
```

**Props**: Standard div props
**Variants**: None (style with className)

### Separator
Horizontal or vertical divider.

```tsx
<Separator orientation="horizontal" />
<Separator orientation="vertical" className="h-4" />
```

**Props**:
- `orientation`: "horizontal" | "vertical" (default: "horizontal")
- `decorative`: boolean (default: true) - Whether separator is decorative

### Tabs
Tabbed interface with multiple panels.

```tsx
<Tabs defaultValue="account" className="w-[400px]">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    Make changes to your account here.
  </TabsContent>
  <TabsContent value="password">
    Change your password here.
  </TabsContent>
</Tabs>
```

**Props**:
- `defaultValue`: string - Initial active tab
- `value`: string - Controlled active tab
- `onValueChange`: (value: string) => void

## Form components

### Input
Text input field.

```tsx
<Input type="email" placeholder="Email" />
```

**Props**: Standard input props
**Types**: text, email, password, number, tel, url, search, date, time, etc.

### Textarea
Multi-line text input.

```tsx
<Textarea placeholder="Type your message here." />
```

**Props**: Standard textarea props

### Select
Dropdown selection menu.

```tsx
<Select onValueChange={(value) => console.log(value)}>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select a fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
    <SelectItem value="orange">Orange</SelectItem>
  </SelectContent>
</Select>
```

**Props**:
- `value`: string - Controlled value
- `defaultValue`: string - Initial value
- `onValueChange`: (value: string) => void
- `disabled`: boolean

### Checkbox
Checkbox input.

```tsx
<Checkbox 
  checked={checked}
  onCheckedChange={setChecked}
/>
```

**Props**:
- `checked`: boolean | "indeterminate"
- `onCheckedChange`: (checked: boolean) => void
- `disabled`: boolean

### Radio Group
Radio button group.

```tsx
<RadioGroup defaultValue="option-one">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option-one" id="option-one" />
    <Label htmlFor="option-one">Option One</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option-two" id="option-two" />
    <Label htmlFor="option-two">Option Two</Label>
  </div>
</RadioGroup>
```

**Props**:
- `value`: string - Controlled value
- `defaultValue`: string - Initial value
- `onValueChange`: (value: string) => void

### Switch
Toggle switch.

```tsx
<Switch 
  checked={enabled}
  onCheckedChange={setEnabled}
/>
```

**Props**:
- `checked`: boolean
- `onCheckedChange`: (checked: boolean) => void
- `disabled`: boolean

### Slider
Range input slider.

```tsx
<Slider
  defaultValue={[50]}
  max={100}
  step={1}
  onValueChange={(value) => console.log(value)}
/>
```

**Props**:
- `value`: number[] - Controlled value(s)
- `defaultValue`: number[] - Initial value(s)
- `onValueChange`: (value: number[]) => void
- `min`: number (default: 0)
- `max`: number (default: 100)
- `step`: number (default: 1)

### Form
Form wrapper with validation.

```tsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="username"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Username</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormDescription>This is your public display name.</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

**Required packages**: react-hook-form, zod, @hookform/resolvers

## Overlay components

### Dialog
Modal dialog.

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* Content */}
    <DialogFooter>
      <Button type="submit">Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Props**:
- `open`: boolean - Controlled open state
- `onOpenChange`: (open: boolean) => void
- `modal`: boolean (default: true)

### Sheet
Slide-in panel (drawer).

```tsx
<Sheet open={open} onOpenChange={setOpen}>
  <SheetTrigger asChild>
    <Button>Open</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Title</SheetTitle>
      <SheetDescription>Description</SheetDescription>
    </SheetHeader>
    {/* Content */}
  </SheetContent>
</Sheet>
```

**Props**:
- `open`: boolean - Controlled open state
- `onOpenChange`: (open: boolean) => void
- `side`: "top" | "right" | "bottom" | "left" (default: "right")

### Popover
Floating content container.

```tsx
<Popover>
  <PopoverTrigger asChild>
    <Button>Open</Button>
  </PopoverTrigger>
  <PopoverContent>
    Place content here.
  </PopoverContent>
</Popover>
```

**Props**:
- `open`: boolean - Controlled open state
- `onOpenChange`: (open: boolean) => void
- `modal`: boolean (default: false)

### Tooltip
Hover tooltip.

```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button>Hover</Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Tooltip content</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

**Props**:
- `delayDuration`: number (default: 700ms)
- `skipDelayDuration`: number (default: 300ms)

### Alert Dialog
Confirmation dialog.

```tsx
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button>Delete</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

## Navigation components

### Dropdown Menu
Contextual menu.

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Open</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Billing</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Logout</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

**Sub-components**:
- `DropdownMenuCheckboxItem` - Checkbox item
- `DropdownMenuRadioGroup` / `DropdownMenuRadioItem` - Radio items
- `DropdownMenuSub` - Nested submenu

### Navigation Menu
Complex navigation structure.

```tsx
<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
      <NavigationMenuContent>
        {/* Content */}
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

### Menubar
Desktop application-style menu.

```tsx
<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>New Tab</MenubarItem>
      <MenubarItem>New Window</MenubarItem>
      <MenubarSeparator />
      <MenubarItem>Share</MenubarItem>
      <MenubarSeparator />
      <MenubarItem>Print</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>
```

### Breadcrumb
Navigation breadcrumb trail.

```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

## Feedback components

### Toast
Toast notification.

```tsx
import { useToast } from "@/components/ui/use-toast"

function Component() {
  const { toast } = useToast()

  return (
    <Button
      onClick={() => {
        toast({
          title: "Scheduled: Catch up",
          description: "Friday, February 10, 2023 at 5:57 PM",
        })
      }}
    >
      Show Toast
    </Button>
  )
}
```

**Toast options**:
- `title`: string
- `description`: string
- `variant`: "default" | "destructive"
- `action`: ReactNode (action button)
- `duration`: number (ms)

### Alert
Static alert message.

```tsx
<Alert>
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    You can add components to your app using the cli.
  </AlertDescription>
</Alert>
```

**Variants**:
- `default`
- `destructive`

### Progress
Progress indicator.

```tsx
<Progress value={progress} className="w-[60%]" />
```

**Props**:
- `value`: number (0-100)
- `max`: number (default: 100)

### Skeleton
Loading placeholder.

```tsx
<Skeleton className="h-12 w-12 rounded-full" />
<Skeleton className="h-4 w-[250px]" />
```

## Display components

### Avatar
User avatar with fallback.

```tsx
<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>
```

### Badge
Status badge.

```tsx
<Badge>Badge</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
```

**Variants**: default, secondary, destructive, outline

### Table
Data table.

```tsx
<Table>
  <TableCaption>A list of your recent invoices.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>INV001</TableCell>
      <TableCell>Paid</TableCell>
      <TableCell>$250.00</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Accordion
Collapsible content sections.

```tsx
<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>
      Yes. It adheres to the WAI-ARIA design pattern.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Is it styled?</AccordionTrigger>
    <AccordionContent>
      Yes. It comes with default styles.
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

**Props**:
- `type`: "single" | "multiple"
- `collapsible`: boolean (for single type)
- `defaultValue`: string (for single) | string[] (for multiple)

### Calendar
Date picker calendar.

```tsx
<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  className="rounded-md border"
/>
```

**Modes**:
- `single` - Single date selection
- `multiple` - Multiple dates
- `range` - Date range

### Collapsible
Expandable content section.

```tsx
<Collapsible open={isOpen} onOpenChange={setIsOpen}>
  <CollapsibleTrigger asChild>
    <Button>Can I use this?</Button>
  </CollapsibleTrigger>
  <CollapsibleContent>
    Yes. Free to use for personal and commercial projects.
  </CollapsibleContent>
</Collapsible>
```

### Command
Command palette / search.

```tsx
<Command>
  <CommandInput placeholder="Type a command or search..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem>Calendar</CommandItem>
      <CommandItem>Search Emoji</CommandItem>
      <CommandItem>Calculator</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

**Use cases**: Command palettes, search interfaces, autocomplete

### Context Menu
Right-click context menu.

```tsx
<ContextMenu>
  <ContextMenuTrigger>Right click me</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Profile</ContextMenuItem>
    <ContextMenuItem>Billing</ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem>Team</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

### Hover Card
Hover-triggered card.

```tsx
<HoverCard>
  <HoverCardTrigger asChild>
    <Button variant="link">@nextjs</Button>
  </HoverCardTrigger>
  <HoverCardContent>
    <div className="flex justify-between space-x-4">
      <Avatar>
        <AvatarImage src="https://github.com/vercel.png" />
        <AvatarFallback>VC</AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <h4 className="text-sm font-semibold">@nextjs</h4>
        <p className="text-sm">The React Framework</p>
      </div>
    </div>
  </HoverCardContent>
</HoverCard>
```

## Utility components

### Aspect Ratio
Maintain aspect ratio container.

```tsx
<AspectRatio ratio={16 / 9}>
  <img src="..." alt="..." className="rounded-md object-cover" />
</AspectRatio>
```

### Scroll Area
Scrollable container with custom scrollbar.

```tsx
<ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
  {/* Long content */}
</ScrollArea>
```

### Label
Form label.

```tsx
<Label htmlFor="email">Your email address</Label>
<Input id="email" type="email" />
```

### Resizable
Resizable panel container.

```tsx
<ResizablePanelGroup direction="horizontal">
  <ResizablePanel defaultSize={50}>
    <div>Panel 1</div>
  </ResizablePanel>
  <ResizableHandle />
  <ResizablePanel defaultSize={50}>
    <div>Panel 2</div>
  </ResizablePanel>
</ResizablePanelGroup>
```

**Direction**: "horizontal" | "vertical"

## Installation commands

Quick reference for adding components:

```bash
# Common components
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add form
npx shadcn@latest add table
npx shadcn@latest add toast

# Install multiple at once
npx shadcn@latest add button input card dialog
```
