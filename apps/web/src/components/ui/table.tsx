"use client"

import { forwardRef } from "react"
import { Table as HeroUITable } from "@heroui/react"
import { cn } from "@/lib/utils"

const Table = HeroUITable
const TableHeader = HeroUITable.Header
const TableBody = HeroUITable.Body
const TableFooter = HeroUITable.Footer
const TableRow = HeroUITable.Row
const TableHead = HeroUITable.Column
const TableCell = HeroUITable.Cell

const TableCaption = forwardRef<HTMLTableCaptionElement, React.ComponentProps<"caption">>(
  ({ className, ...props }, ref) => (
    <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />
  )
)
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}