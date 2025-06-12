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
    sizes: [] as { size: string; quantity: number }[],
    images: [] as {
      image_url: string;
      quality: "low" | "medium" | "high";
      is_primary: boolean;
    }[],
  });

  React.useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        price: item.price,
        description: item.description,
        color: item.details?.color || "",
        detail: item.details?.detail || "",
        sizes: item.sizes.map((size) => ({
          size: size.size,
          quantity: size.quantity,
        })),
        images: item.images.map((img) => ({
          image_url: img.image_url,
          quality: img.quality as "low" | "medium" | "high",
          is_primary: img.is_primary,
        })),
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
          sizes: formData.sizes,
          images: formData.images,
        },
      }).unwrap();
      toast.success("Item updated successfully");
      router.push("/admin");
    } catch {
      toast.error("Failed to update item");
    }
  };

  const handleSizeChange = (
    index: number,
    field: "size" | "quantity",
    value: string | number
  ) => {
    const newSizes = [...formData.sizes];
    newSizes[index] = {
      ...newSizes[index],
      [field]: field === "quantity" ? Number(value) : value,
    };
    setFormData({ ...formData, sizes: newSizes });
  };

  const handleImageChange = (
    index: number,
    field: "image_url" | "quality" | "is_primary",
    value: string | boolean
  ) => {
    const newImages = [...formData.images];
    newImages[index] = {
      ...newImages[index],
      [field]: value,
    };
    setFormData({ ...formData, images: newImages });
  };

  const addSize = () => {
    setFormData({
      ...formData,
      sizes: [...formData.sizes, { size: "", quantity: 0 }],
    });
  };

  const addImage = () => {
    setFormData({
      ...formData,
      images: [
        ...formData.images,
        { image_url: "", quality: "medium", is_primary: false },
      ],
    });
  };

  const removeSize = (index: number) => {
    const newSizes = formData.sizes.filter((_, i) => i !== index);
    setFormData({ ...formData, sizes: newSizes });
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
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
            The item you&apos;re looking for doesn&apos;t exist.
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
              className="h-96"
              value={formData.detail}
              onChange={(e) =>
                setFormData({ ...formData, detail: e.target.value })
              }
            />
          </div>

          {/* Sizes Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Sizes and Quantities</Label>
              <Button type="button" variant="outline" onClick={addSize}>
                Add Size
              </Button>
            </div>
            {formData.sizes.map((size, index) => (
              <div key={index} className="flex gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <Label>Size</Label>
                  <Input
                    value={size.size}
                    onChange={(e) =>
                      handleSizeChange(index, "size", e.target.value)
                    }
                    placeholder="e.g., S, M, L"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={size.quantity}
                    onChange={(e) =>
                      handleSizeChange(index, "quantity", e.target.value)
                    }
                    min="0"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeSize(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          {/* Images Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Images</Label>
              <Button type="button" variant="outline" onClick={addImage}>
                Add Image
              </Button>
            </div>
            {formData.images.map((image, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input
                    value={image.image_url}
                    onChange={(e) =>
                      handleImageChange(index, "image_url", e.target.value)
                    }
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <Label>Quality</Label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={image.quality}
                      onChange={(e) =>
                        handleImageChange(
                          index,
                          "quality",
                          e.target.value as "low" | "medium" | "high"
                        )
                      }
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={image.is_primary}
                        onChange={(e) =>
                          handleImageChange(
                            index,
                            "is_primary",
                            e.target.checked
                          )
                        }
                      />
                      Primary Image
                    </label>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeImage(index)}
                >
                  Remove Image
                </Button>
              </div>
            ))}
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
