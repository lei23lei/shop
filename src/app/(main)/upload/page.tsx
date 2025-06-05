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
import { CldUploadWidget } from "next-cloudinary";
import { useCreateItemMutation } from "@/services/endpoints/items-endpoints";

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
  images: z.array(z.string()).optional(),
  detailImages: z.array(z.string()).optional(),
  displayImage: z.string().optional(),
});

export default function UploadPage() {
  const [sizes, setSizes] = useState([{ size: "", quantity: 0 }]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(
    null
  );
  const [images, setImages] = useState<string[]>([]);
  const [detailImages, setDetailImages] = useState<string[]>([]);
  const [displayImage, setDisplayImage] = useState<string>("");
  const [createItem, { isLoading }] = useCreateItemMutation();

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
      displayImage: "",
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

  const handleDisplayImageUpload = (result: any) => {
    console.log("Display Image Upload Result:", result);
    const uploadInfo = result.info;
    if (uploadInfo?.secure_url) {
      const imageUrl = uploadInfo.secure_url;
      console.log("Setting display image URL:", imageUrl);
      setDisplayImage(imageUrl);
      form.setValue("displayImage", imageUrl);
      console.log("Updated form values:", form.getValues());
    }
  };

  const handleImageUpload = (result: any) => {
    console.log("Additional Image Upload Result:", result);
    const uploadInfo = result.info;
    if (uploadInfo?.secure_url) {
      const imageUrl = uploadInfo.secure_url;
      console.log("Adding additional image URL:", imageUrl);
      console.log("Current images:", images);
      // Get current images and append new one
      const currentImages = form.getValues("images") || [];
      const newImages = [...currentImages, imageUrl];
      console.log("New images array before update:", newImages);
      setImages(newImages);
      form.setValue("images", newImages, { shouldValidate: true });
      console.log("Updated images array:", newImages);
    }
  };

  const handleDetailImageUpload = (result: any) => {
    console.log("Detail Image Upload Result:", result);
    const uploadInfo = result.info;
    if (uploadInfo?.secure_url) {
      const imageUrl = uploadInfo.secure_url;
      console.log("Adding detail image URL:", imageUrl);
      console.log("Current detail images:", detailImages);
      // Get current detail images and append new one
      const currentDetailImages = form.getValues("detailImages") || [];
      const newDetailImages = [...currentDetailImages, imageUrl];
      console.log("New detail images array before update:", newDetailImages);
      setDetailImages(newDetailImages);
      form.setValue("detailImages", newDetailImages, { shouldValidate: true });
      console.log("Updated detail images array:", newDetailImages);
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
      console.log("Current images state:", images);
      console.log("Current form values:", values);

      const hasImages =
        images.length > 0 || (values.images && values.images.length > 0);

      if (!hasImages) {
        alert("Please upload at least one image");
        return;
      }

      if (!selectedCategory || !selectedSubcategory) {
        alert("Please select both category and subcategory");
        return;
      }

      const validSizes = sizes.filter((size) => size.size.trim() !== "");

      if (validSizes.length === 0) {
        alert("Please add at least one size");
        return;
      }

      // Destructure to remove parent_category_id and category_id
      const { parent_category_id, category_id, ...rest } = values;

      const requestData = {
        ...rest,
        categories: [selectedCategory, selectedSubcategory],
        details: {
          color: values.color,
          detail: values.detail || undefined,
        },
        display_image: displayImage,
        images: images.filter(Boolean),
        detail_images: detailImages.filter(Boolean),
        sizes: validSizes.map((size) => ({
          size: size.size.trim(),
          quantity: size.quantity || 0,
        })),
      };

      console.log(
        "Submitting Form Data:",
        JSON.stringify(requestData, null, 2)
      );

      try {
        const response = await createItem(requestData).unwrap();
        console.log("Item created successfully:", response);
        // You might want to redirect to the item detail page or show a success message
      } catch (error) {
        console.error("Failed to create item:", error);
        alert("Failed to create item. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Please check all required fields.");
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

  const removeDisplayImage = () => {
    setDisplayImage("");
    form.setValue("displayImage", "");
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    form.setValue("images", newImages);
  };

  const removeDetailImage = (index: number) => {
    const newDetailImages = detailImages.filter((_, i) => i !== index);
    setDetailImages(newDetailImages);
    form.setValue("detailImages", newDetailImages);
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

              {/* Display Image */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Display Image</h3>
                <div className="grid grid-cols-1 gap-4">
                  <CldUploadWidget
                    uploadPreset="myshop"
                    onUpload={handleDisplayImageUpload}
                    options={{
                      maxFiles: 1,
                      sources: ["local", "url", "camera"],
                      clientAllowedFormats: ["jpg", "jpeg", "png", "gif"],
                      maxFileSize: 10000000,
                      styles: {
                        palette: {
                          window: "#FFFFFF",
                          windowBorder: "#90A0B3",
                          tabIcon: "#0078FF",
                          menuIcons: "#5A616A",
                          textDark: "#000000",
                          textLight: "#FFFFFF",
                          link: "#0078FF",
                          action: "#FF620C",
                          inactiveTabIcon: "#0E2F5A",
                          error: "#F44235",
                          inProgress: "#0078FF",
                          complete: "#20B832",
                          sourceBg: "#E4EBF1",
                        },
                        frame: {
                          background: "#0078FF",
                        },
                      },
                    }}
                    onSuccess={(result) => {
                      console.log("Upload success:", result);
                      handleDisplayImageUpload(result);
                    }}
                    onError={(error) => {
                      console.error("Upload error:", error);
                    }}
                  >
                    {({ open }) => (
                      <div className="flex flex-col items-center gap-4">
                        {displayImage && (
                          <div className="relative aspect-square w-full max-w-[300px] group">
                            <img
                              src={displayImage}
                              alt="Display image"
                              className="object-cover w-full h-full rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={removeDisplayImage}
                              className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => open()}
                          className="w-full"
                        >
                          Upload Display Image
                        </Button>
                      </div>
                    )}
                  </CldUploadWidget>
                </div>
              </div>

              {/* Images */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Additional Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-square group">
                      <img
                        src={image}
                        alt={`Item image ${index + 1}`}
                        className="object-cover w-full h-full rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <CldUploadWidget
                  uploadPreset="myshop"
                  onSuccess={(result) => {
                    console.log("Upload success:", result);
                    handleImageUpload(result);
                  }}
                  onError={(error) => {
                    console.error("Upload error:", error);
                  }}
                  options={{
                    maxFiles: 5,
                    sources: ["local", "url", "camera"],
                    clientAllowedFormats: ["jpg", "jpeg", "png", "gif"],
                    maxFileSize: 10000000,
                    styles: {
                      palette: {
                        window: "#FFFFFF",
                        windowBorder: "#90A0B3",
                        tabIcon: "#0078FF",
                        menuIcons: "#5A616A",
                        textDark: "#000000",
                        textLight: "#FFFFFF",
                        link: "#0078FF",
                        action: "#FF620C",
                        inactiveTabIcon: "#0E2F5A",
                        error: "#F44235",
                        inProgress: "#0078FF",
                        complete: "#20B832",
                        sourceBg: "#E4EBF1",
                      },
                    },
                  }}
                >
                  {({ open }) => (
                    <div className="flex flex-col gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => open()}
                        className="w-full"
                      >
                        Upload Additional Images
                      </Button>
                    </div>
                  )}
                </CldUploadWidget>
              </div>

              {/* Detail Images */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Detail Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {detailImages.map((image, index) => (
                    <div key={index} className="relative aspect-square group">
                      <img
                        src={image}
                        alt={`Detail image ${index + 1}`}
                        className="object-cover w-full h-full rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeDetailImage(index)}
                        className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <CldUploadWidget
                  uploadPreset="myshop"
                  onSuccess={(result) => {
                    console.log("Upload success:", result);
                    handleDetailImageUpload(result);
                  }}
                  onError={(error) => {
                    console.error("Upload error:", error);
                  }}
                  options={{
                    maxFiles: 5,
                    sources: ["local", "url", "camera"],
                    clientAllowedFormats: ["jpg", "jpeg", "png", "gif"],
                    maxFileSize: 10000000,
                    styles: {
                      palette: {
                        window: "#FFFFFF",
                        windowBorder: "#90A0B3",
                        tabIcon: "#0078FF",
                        menuIcons: "#5A616A",
                        textDark: "#000000",
                        textLight: "#FFFFFF",
                        link: "#0078FF",
                        action: "#FF620C",
                        inactiveTabIcon: "#0E2F5A",
                        error: "#F44235",
                        inProgress: "#0078FF",
                        complete: "#20B832",
                        sourceBg: "#E4EBF1",
                      },
                    },
                  }}
                >
                  {({ open }) => (
                    <div className="flex flex-col gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => open()}
                        className="w-full"
                      >
                        Upload Detail Images
                      </Button>
                    </div>
                  )}
                </CldUploadWidget>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Uploading..." : "Upload Item"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
