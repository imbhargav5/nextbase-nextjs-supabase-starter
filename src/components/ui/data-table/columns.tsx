"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Table as TableType } from "@/types";

// Helper function to format date
const formatDate = (dateString: string | null) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString();
};

// Private Items Columns
export const privateItemsColumns: ColumnDef<TableType<'private_items'>>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="pl-0 font-medium"
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const createdAt = row.original.created_at;
      
      return (
        <div>
          <div className="font-medium">{name}</div>
          {createdAt && (
            <div className="flex items-center gap-1 mt-1 text-muted-foreground text-xs">
              <Clock className="h-3 w-3" />
              <span>{formatDate(createdAt)}</span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="pl-0 font-medium"
      >
        Description
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <div className="text-muted-foreground">
          {description.length > 100 ? `${description.slice(0, 100)}...` : description}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const id = row.original.id;
      
      return (
        <div className="text-right">
          <Link href={`/private-item/${id}`}>
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
            >
              <ExternalLink className="h-3.5 w-3.5" /> View
            </Button>
          </Link>
        </div>
      );
    },
  },
];

// Public Items Columns
export const publicItemsColumns: ColumnDef<TableType<'items'>>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="pl-0 font-medium"
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const createdAt = row.original.created_at;
      
      return (
        <div>
          <div className="font-medium">{name}</div>
          {createdAt && (
            <div className="flex items-center gap-1 mt-1 text-muted-foreground text-xs">
              <Clock className="h-3 w-3" />
              <span>{formatDate(createdAt)}</span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="pl-0 font-medium"
      >
        Description
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <div className="text-muted-foreground">
          {description.length > 100 ? `${description.slice(0, 100)}...` : description}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const id = row.original.id;
      
      return (
        <div className="text-right">
          <Link href={`/item/${id}`}>
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
            >
              <ExternalLink className="h-3.5 w-3.5" /> View
            </Button>
          </Link>
        </div>
      );
    },
  },
];
