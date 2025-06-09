"use client";

import React from "react";
import {
  useGetAdminItemDetailQuery,
  useUpdateItemMutation,
} from "@/services/endpoints/admin-endpoints";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function EditItemPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = Number(params.id);

  const { data: item, isLoading } = useGetAdminItemDetailQuery(itemId);
  const [updateItem] = useUpdateItemMutation();

  const [formData, setFormData] = React.useState({
    name: "",
    price: "",
    description: "",
    color: "",
    detail: "",
  });

  React.useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        price: item.price,
        description: item.description,
        color: item.details?.color || "",
        detail: item.details?.detail || "",
      });
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateItem({
        id: itemId,
        data: {
          name: formData.name,
          price: formData.price,
          description: formData.description,
          color: formData.color,
          detail: formData.detail,
        },
      }).unwrap();
      toast.success("Item updated successfully");
      router.push("/admin");
    } catch (error) {
      toast.error("Failed to update item");
    }
  };

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

  if (!item) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Item Not Found</h1>
          <p className="text-muted-foreground">
            The item you're looking for doesn't exist.
          </p>
          <Button className="mt-4" onClick={() => router.push("/admin")}>
            Back to Admin
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Edit Item</h1>
          <Button variant="outline" onClick={() => router.push("/admin")}>
            Back to Admin
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              className="h-40"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Input
              id="color"
              value={formData.color}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="detail">Detail</Label>
            <Textarea
              id="detail"
              className="h-40"
              value={formData.detail}
              onChange={(e) =>
                setFormData({ ...formData, detail: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin")}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
