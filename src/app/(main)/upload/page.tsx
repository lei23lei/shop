"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { categories } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0, "Price must be a positive number"),
  description: z.string().min(1, "Description is required"),
  parent_category_id: z.number().min(1, "Category is required"),
  category_id: z.number().min(1, "Subcategory is required"),
  color: z.string().min(1, "Color is required"),
  detail: z.string().optional(),
  sizes: z.array(
    z.object({
      size: z.string().min(1, "Size is required"),
      quantity: z.number().min(0, "Quantity must be a positive number"),
    })
  ),
  images: z.array(z.string()).min(1, "At least one image is required"),
  detailImages: z.array(z.string()).optional(),
});

export default function UploadPage() {
  const [sizes, setSizes] = useState([{ size: "", quantity: 0 }]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(
    null
  );
  const [images, setImages] = useState<string[]>([]);
  const [detailImages, setDetailImages] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      parent_category_id: 0,
      category_id: 0,
      color: "",
      detail: "",
      sizes: [{ size: "", quantity: 0 }],
      images: [],
      detailImages: [],
    },
  });

  const addSize = () => {
    const newSizes = [...sizes, { size: "", quantity: 0 }];
    setSizes(newSizes);
    form.setValue("sizes", newSizes, { shouldValidate: true });
  };

  const removeSize = (index: number) => {
    if (sizes.length <= 1) {
      const newSizes = [{ size: "", quantity: 0 }];
      setSizes(newSizes);
      form.setValue("sizes", newSizes, { shouldValidate: true });
    } else {
      const newSizes = sizes.filter((_, i) => i !== index);
      setSizes(newSizes);
      form.setValue("sizes", newSizes, { shouldValidate: true });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setImages([...images, ...newImages]);
      form.setValue("images", [...images, ...newImages]);
    }
  };

  const handleDetailImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setDetailImages([...detailImages, ...newImages]);
    }
  };

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategory(categoryId);
    form.setValue("parent_category_id", categoryId);
    // Clear subcategory when changing category
    setSelectedSubcategory(null);
    form.setValue("category_id", 0);
  };

  const handleSubcategoryChange = (subcategoryId: number) => {
    setSelectedSubcategory(subcategoryId);
    form.setValue("category_id", subcategoryId);
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Get the selected category and subcategory names
      const selectedCategoryData = categories.find(
        (c) => c.id === selectedCategory
      );
      const selectedSubcategoryData = selectedCategoryData?.subcategories.find(
        (s) => s.id === selectedSubcategory
      );

      // Ensure we have valid category and subcategory IDs
      if (!selectedCategory || !selectedSubcategory) {
        throw new Error("Please select both category and subcategory");
      }

      // Filter out empty sizes before submission
      const validSizes = sizes.filter((size) => size.size.trim() !== "");

      const formData = {
        ...values,
        categories: [selectedCategory, selectedSubcategory],
        images: images.filter(Boolean),
        detailImages: detailImages.filter(Boolean),
        sizes: validSizes.map((size) => ({
          size: size.size.trim(),
          quantity: size.quantity || 0,
        })),
      };

      // Remove any undefined or null values from the formData
      const cleanedFormData = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => {
          if (Array.isArray(value)) {
            return value.length > 0;
          }
          return value !== null && value !== undefined && value !== "";
        })
      );

      console.log("Form Data:", JSON.stringify(cleanedFormData, null, 2));
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Update the price field to handle number conversion
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    form.setValue("price", isNaN(value) ? 0 : value);
  };

  // Update the handleQuantityChange function
  const handleQuantityChange = (index: number, value: string) => {
    const numValue = parseInt(value);
    const newSizes = [...sizes];
    newSizes[index] = {
      size: newSizes[index].size,
      quantity: isNaN(numValue) ? 0 : numValue,
    };
    setSizes(newSizes);
    form.setValue("sizes", newSizes, { shouldValidate: true });
  };

  // Add a new function to handle size changes
  const handleSizeChange = (index: number, value: string) => {
    const newSizes = [...sizes];
    newSizes[index] = {
      ...newSizes[index],
      size: value,
    };
    setSizes(newSizes);
    form.setValue("sizes", newSizes, { shouldValidate: true });
  };

  // Update the form submission handler
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submit event triggered");

    // Update form with current state before validation
    form.setValue("parent_category_id", selectedCategory || 0);
    form.setValue("category_id", selectedSubcategory || 0);
    form.setValue("images", images);
    form.setValue("sizes", sizes, { shouldValidate: true });

    // Log current form state
    const currentValues = form.getValues();
    console.log("Form errors:", form.formState.errors);

    try {
      // Validate the form data
      const validatedData = formSchema.parse(currentValues);
      console.log("Form validation passed, calling handleSubmit");
      handleSubmit(validatedData);
    } catch (error) {
      console.log("Form validation failed:", error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Upload New Item</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Item name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          onChange={handlePriceChange}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Item description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Categories */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Categories</h3>
                <div className="space-y-6">
                  {categories.map((category) => (
                    <div key={category.id} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={`category-${category.id}`}
                          name="parent_category_id"
                          checked={selectedCategory === category.id}
                          onChange={() => {
                            handleCategoryChange(category.id);
                          }}
                          className="h-4 w-4 border-gray-300"
                        />
                        <label
                          htmlFor={`category-${category.id}`}
                          className="text-sm font-medium"
                        >
                          {category.name}
                        </label>
                      </div>

                      {selectedCategory === category.id && (
                        <div className="ml-6 space-y-2">
                          {category.subcategories
                            .filter((subcategory) => subcategory.name !== "All")
                            .map((subcategory) => (
                              <div
                                key={subcategory.id}
                                className="flex items-center space-x-2"
                              >
                                <input
                                  type="radio"
                                  id={`subcategory-${subcategory.id}`}
                                  name="category_id"
                                  checked={
                                    selectedSubcategory === subcategory.id
                                  }
                                  onChange={() => {
                                    handleSubcategoryChange(subcategory.id);
                                  }}
                                  className="h-4 w-4 border-gray-300"
                                />
                                <label
                                  htmlFor={`subcategory-${subcategory.id}`}
                                  className="text-sm text-muted-foreground"
                                >
                                  {subcategory.name}
                                </label>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Details</h3>
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input placeholder="Item color" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="detail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Details</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Additional details" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Sizes and Quantities */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Sizes and Quantities</h3>
                {sizes.map((_, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <FormField
                      control={form.control}
                      name={`sizes.${index}.size`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder="Size (e.g., S, M, L)"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) =>
                                handleSizeChange(index, e.target.value)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`sizes.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Quantity"
                              onChange={(e) =>
                                handleQuantityChange(index, e.target.value)
                              }
                              value={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSize(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addSize}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Size
                </Button>
              </div>

              {/* Images */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={image}
                        alt={`Item image ${index + 1}`}
                        className="object-cover w-full h-full rounded-lg"
                      />
                    </div>
                  ))}
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                />
              </div>

              {/* Detail Images */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Detail Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {detailImages.map((image, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={image}
                        alt={`Detail image ${index + 1}`}
                        className="object-cover w-full h-full rounded-lg"
                      />
                    </div>
                  ))}
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleDetailImageUpload}
                />
              </div>

              <Button type="submit" className="w-full">
                Upload Item
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
