"use client";

import React from "react";
import { useGetAdminItemsQuery } from "@/services/endpoints/admin-endpoints";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminPage() {
  const { data: itemsData, isLoading } = useGetAdminItemsQuery({
    page: 1,
    page_size: 50,
  });

  console.log("Items Data:", itemsData); // Debug log

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  if (!itemsData?.results?.items || !Array.isArray(itemsData.results.items)) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Items Found</h1>
          <p className="text-muted-foreground">
            There are no items to display.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button asChild>
          <Link href="/admin/items/new">Add New Item</Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Categories</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Sizes</TableHead>
              <TableHead>Images</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {itemsData.results.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>${item.price}</TableCell>
                <TableCell>
                  {item.categories.map((cat) => cat.name).join(", ")}
                </TableCell>
                <TableCell>{item.details?.color || "-"}</TableCell>
                <TableCell>
                  {item.sizes
                    .map((size) => `${size.size}(${size.quantity})`)
                    .join(", ")}
                </TableCell>
                <TableCell>
                  {item.total_images} / {item.total_detail_images}
                </TableCell>
                <TableCell>
                  {format(new Date(item.created_at), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/items/${item.id}`}>Edit</Link>
                    </Button>
                    <Button variant="destructive" size="sm">
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
