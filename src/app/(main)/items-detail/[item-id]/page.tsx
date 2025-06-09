"use client";

import React from "react";
import Image from "next/image";
import {
  useGetItemDetailQuery,
  useDeleteItemMutation,
} from "@/services/endpoints/items-endpoints";
import { useAddToCartMutation } from "@/services/endpoints/account-endpoints";
import { useRouter } from "next/navigation";
import LoadingSpin from "@/components/loading-spin";
import BreadcrumbNavigation from "@/components/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import RecentItems from "../../_components/recent-items";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ReactMarkdown from "react-markdown";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import remarkGfm from "remark-gfm";

export default function ItemDetailPage({
  params,
}: {
  params: Promise<{ "item-id": string }>;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const resolvedParams = React.use(params);
  const { data: itemDetail, isLoading } = useGetItemDetailQuery(
    Number(resolvedParams["item-id"])
  );
  const [deleteItem] = useDeleteItemMutation();
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const [selectedImage, setSelectedImage] = React.useState<number>(0);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [quantity, setQuantity] = React.useState(1);
  const [selectedSize, setSelectedSize] = React.useState<string | null>(null);

  // Get the selected size object to access its quantity
  const selectedSizeObj = React.useMemo(() => {
    if (!selectedSize || !itemDetail) return null;
    return itemDetail.sizes.find((size) => size.size === selectedSize);
  }, [selectedSize, itemDetail]);

  // Reset quantity when size changes
  React.useEffect(() => {
    setQuantity(1);
  }, [selectedSize]);

  // Combine primary images and detail images for the gallery
  const allImages = React.useMemo(() => {
    if (!itemDetail) return [];

    const sortedImages = [...itemDetail.images].sort((a, b) =>
      b.is_primary ? 1 : -1
    );

    // const sortedDetailImages = [...itemDetail.detail_images].sort(
    //   (a, b) => a.display_order - b.display_order
    // );

    return [...sortedImages];
  }, [itemDetail]);

  if (isLoading) {
    return (
      <div className="container mx-auto min-h-[600px] flex items-center justify-center">
        <LoadingSpin />
      </div>
    );
  }

  if (!itemDetail) {
    return (
      <div className="container mx-auto min-h-[600px] flex items-center justify-center">
        <h2>Item not found</h2>
      </div>
    );
  }

  const categoryId = itemDetail.categories[0]?.id;

  return (
    <div className=" py-4 ">
      <div className="container mx-auto px-4 lg:px-6 xl:px-10 2xl:px-16">
        <div className="flex flex-col gap-4   lg:px-0">
          <div className="py-4">
            <BreadcrumbNavigation
              categoryId={categoryId}
              showItemName={true}
              itemName={itemDetail.name}
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-8 ">
            {/* Left side - Image Gallery */}
            <div className="w-full lg:w-[600px]">
              {/* Main Image Container */}
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <div className="w-full aspect-square relative bg-neutral-100 rounded-lg overflow-hidden cursor-zoom-in">
                    {/* Main Image */}
                    <Image
                      src={
                        allImages[selectedImage]?.image_url ||
                        "/placeholder.jpg"
                      }
                      alt={itemDetail.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 600px"
                      className="object-cover"
                      priority
                    />

                    {/* Thumbnail Gallery Overlay */}
                    {allImages.length > 1 && (
                      <div className="absolute left-0 bottom-0 bg-white/30 backdrop-blur-sm p-1.5 rounded-sm">
                        <div className="flex gap-2">
                          {allImages.map((image, index) => (
                            <button
                              key={image.id}
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent dialog from opening
                                setSelectedImage(index);
                              }}
                              className={cn(
                                "relative w-[82px] aspect-square bg-neutral-100 rounded-md overflow-hidden transition-all",
                                selectedImage === index
                                  ? "ring-2 ring-white/60 "
                                  : "hover:ring-2 hover:ring-white/40"
                              )}
                            >
                              <Image
                                src={image.image_url}
                                alt={`${itemDetail.name} thumbnail ${
                                  index + 1
                                }`}
                                fill
                                sizes="64px"
                                className="object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-[50vw]  border-0 h-[80vh] p-0">
                  <DialogTitle className="sr-only">
                    {itemDetail.name} Image View
                  </DialogTitle>
                  <div className=" w-[50vw] aspect-[2/1] ">
                    <Image
                      src={
                        allImages[selectedImage]?.image_url ||
                        "/placeholder.jpg"
                      }
                      alt={itemDetail.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Right side - Item Details */}
            <div className="flex-1 flex flex-col justify-between">
              <div className=" space-y-6">
                <h1 className="text-3xl font-semibold">{itemDetail.name}</h1>

                {/* Categories */}
                <div className="flex gap-2">
                  {itemDetail.categories.map((category) => (
                    <span
                      key={category.id}
                      className="px-3 py-1 bg-neutral-100 rounded-full text-sm"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
                <p className="text-2xl font-bold mt-2">${itemDetail.price}</p>

                {/* Description */}
                {itemDetail.description && (
                  <p className="text-neutral-600">{itemDetail.description}</p>
                )}

                {/* Color */}
                {itemDetail.details?.color && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Color:</span>
                    <div
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: itemDetail.details.color }}
                    />
                    <span className="text-sm">{itemDetail.details.color}</span>
                  </div>
                )}

                {/* Delete Button */}
                {/* <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      Delete Item
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the item "{itemDetail.name}" and all its
                        associated data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async () => {
                          try {
                            setIsDeleting(true);
                            await deleteItem(
                              Number(resolvedParams["item-id"])
                            ).unwrap();
                            router.push("/items");
                          } catch (error) {
                            console.error("Failed to delete item:", error);
                          } finally {
                            setIsDeleting(false);
                          }
                        }}
                        disabled={isDeleting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog> */}
              </div>

              <div className="space-y-6">
                {/* Quantity */}
                {selectedSize && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Quantity</h3>
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setQuantity((prev) => Math.max(1, prev - 1))
                        }
                        disabled={quantity <= 1}
                        className="h-10 w-10 rounded-full border-border shadow-sm"
                      >
                        <p className="text-xl mb-0.5">-</p>
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setQuantity((prev) =>
                            Math.min(selectedSizeObj?.quantity || 1, prev + 1)
                          )
                        }
                        disabled={quantity >= (selectedSizeObj?.quantity || 1)}
                        className="h-10 w-10 rounded-full border-border shadow-sm"
                      >
                        <p className="text-lg mb-0.5">+</p>
                      </Button>
                    </div>
                    {selectedSizeObj && (
                      <p className="text-sm text-neutral-500">
                        {selectedSizeObj.quantity} items available
                      </p>
                    )}
                  </div>
                )}

                {/* Sizes */}
                {itemDetail.sizes.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Available Sizes</h3>
                    <div className="grid grid-cols-6 gap-2">
                      {itemDetail.sizes.map((size) => (
                        <div
                          key={size.size}
                          onClick={() =>
                            size.quantity > 0 && setSelectedSize(size.size)
                          }
                          className={cn(
                            "relative flex cursor-pointer items-center justify-center p-2 border border-muted-foreground/1 shadow-md rounded-md transition-all",
                            size.quantity === 0 &&
                              "opacity-50 cursor-not-allowed bg-neutral-100",
                            selectedSize === size.size &&
                              "border-2 border-neutral-800",
                            size.quantity > 0 && "hover:border-neutral-800"
                          )}
                        >
                          <span className="font-medium">{size.size}</span>
                          {size.quantity === 0 && (
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-medium text-neutral-500 bg-white px-1">
                              Sold Out
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add to Cart Button */}
                <Button
                  className="w-full h-12 bg-neutral-800 text-lg"
                  disabled={!selectedSize || isAddingToCart}
                  onClick={async () => {
                    if (!user) {
                      router.push("/login");
                      return;
                    }

                    if (!selectedSize || !itemDetail) return;

                    try {
                      const selectedSizeObj = itemDetail.sizes.find(
                        (size) => size.size === selectedSize
                      );

                      if (!selectedSizeObj) return;

                      await addToCart({
                        item_id: itemDetail.id,
                        size_id: selectedSizeObj.id,
                        quantity: quantity,
                      }).unwrap();

                      toast.success("Added to cart successfully");
                    } catch (error) {
                      toast.error("Failed to add to cart");
                      console.error("Add to cart error:", error);
                    }
                  }}
                >
                  {isAddingToCart ? (
                    <div className="flex items-center gap-2">
                      <LoadingSpin />
                      <span>Adding...</span>
                    </div>
                  ) : (
                    "Add to Cart"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* Details (Color and Additional Details) */}
        {itemDetail.details && (
          <div className="pt-10 -mb-16">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="details">
                <AccordionTrigger className="text-2xl font-medium">
                  Details
                </AccordionTrigger>
                <AccordionContent>
                  {itemDetail.details.detail && (
                    <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none leading-8 text-neutral-600 [&_p]:whitespace-pre-line">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          table: ({ node, ...props }) => (
                            <div className="overflow-x-auto">
                              <table
                                className="min-w-full divide-y border my-4 border-gray-200"
                                {...props}
                              />
                            </div>
                          ),
                          th: ({ node, ...props }) => (
                            <th
                              className="px-6 py-3 bg-gray-50 border-b  text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              {...props}
                            />
                          ),
                          td: ({ node, ...props }) => (
                            <td
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-b"
                              {...props}
                            />
                          ),
                          p: ({ node, ...props }) => (
                            <p className="whitespace-pre-line" {...props} />
                          ),
                          h3: ({ node, ...props }) => (
                            <h3
                              className="mt-8 mb-4 text-xl font-semibold"
                              {...props}
                            />
                          ),
                          hr: ({ node, ...props }) => (
                            <hr
                              className="my-8 border-t border-gray-200"
                              {...props}
                            />
                          ),
                        }}
                      >
                        {itemDetail.details.detail}
                      </ReactMarkdown>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
        {/* detail iamges */}
        {itemDetail.detail_images.length > 0 && (
          <div className="space-y-2 w-full pt-10">
            <Image
              src={itemDetail.detail_images[0].image_url}
              alt={itemDetail.name}
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
      {/* related items */}
      <RecentItems name="You might also like" cat_id={categoryId} />
    </div>
  );
}
