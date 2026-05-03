"use client"

import { Tabs as HeroUITabs } from "@heroui/react"

type TabsProps = React.ComponentProps<typeof HeroUITabs.Root> & {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
}

function Tabs({ defaultValue, value, onValueChange, className, ...props }: TabsProps) {
  return (
    <HeroUITabs.Root
      defaultSelectedKey={defaultValue}
      selectedKey={value}
      onSelectionChange={onValueChange ? (key: any) => onValueChange(String(key)) : undefined}
      className={className}
      {...props}
    />
  )
}

function TabsList({ className, ...props }: React.ComponentProps<typeof HeroUITabs.List>) {
  return (
    <HeroUITabs.ListContainer>
      <HeroUITabs.List className={className} {...props} />
    </HeroUITabs.ListContainer>
  )
}

type TabsTriggerProps = React.ComponentProps<typeof HeroUITabs.Tab> & {
  value?: string
}

function TabsTrigger({ value, children, className, ...props }: TabsTriggerProps) {
  return (
    <HeroUITabs.Tab id={value} className={className} {...(props as any)}>
      {children as any}
      <HeroUITabs.Indicator />
    </HeroUITabs.Tab>
  )
}

type TabsContentProps = React.ComponentProps<typeof HeroUITabs.Panel> & {
  value?: string
}

function TabsContent({ value, className, ...props }: TabsContentProps) {
  return <HeroUITabs.Panel id={value} className={className} {...props} />
}

export { Tabs, TabsList, TabsTrigger, TabsContent }