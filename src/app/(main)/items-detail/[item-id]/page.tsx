"use client";

import React from "react";
import Image from "next/image";
import { useGetItemDetailQuery } from "@/services/endpoints/items-endpoints";
import { useAddToCartMutation } from "@/services/endpoints/account-endpoints";
import { useRouter } from "next/navigation";
import LoadingSpin from "@/components/loading/loading-spin";
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
import LoadingPage from "@/components/loading/loading-page";
import ItemNotFound from "@/components/notfound/item-notfound";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Quantity } from "@/components/cart/quantity";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { addToLocalCart } from "@/lib/cart-utils";

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
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

  const [selectedImage, setSelectedImage] = React.useState<number>(0);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [quantity, setQuantity] = React.useState(1);
  const [selectedSize, setSelectedSize] = React.useState<string | null>(null);

  // Get the selected size object to access its quantity
  const selectedSizeObj = React.useMemo(() => {
    if (!selectedSize || !itemDetail) return null;
    return itemDetail.sizes.find((size) => size.size === selectedSize);
  }, [selectedSize, itemDetail]);

  // Auto-select size if there's only one size available
  React.useEffect(() => {
    if (itemDetail?.sizes.length === 1 && itemDetail.sizes[0].quantity > 0) {
      setSelectedSize(itemDetail.sizes[0].size);
    }
  }, [itemDetail]);

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

    return [...sortedImages];
  }, [itemDetail]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!itemDetail) {
    return <ItemNotFound />;
  }

  const categoryId =
    itemDetail.categories[itemDetail.categories.length - 1]?.id;

  return (
    <div className="py-4 sm:py-6">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-10 2xl:px-16">
        <div className="flex flex-col gap-3 sm:gap-4 lg:px-0">
          <div className="py-1 md:py-4">
            <BreadcrumbNavigation
              categoryId={categoryId}
              showItemName={true}
              itemName={itemDetail.name}
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
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
                      <div className="absolute left-0 bottom-0 bg-white/30 backdrop-blur-sm p-1 sm:p-1.5 rounded-sm">
                        <div className="flex gap-1 sm:gap-2">
                          {allImages.map((image, index) => (
                            <button
                              key={image.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImage(index);
                              }}
                              className={cn(
                                "relative w-[60px] sm:w-[82px] aspect-square bg-neutral-100 rounded-md overflow-hidden transition-all",
                                selectedImage === index
                                  ? "ring-2 ring-white/60"
                                  : "hover:ring-2 hover:ring-white/40"
                              )}
                            >
                              <Image
                                src={image.image_url}
                                alt={`${itemDetail.name} thumbnail ${
                                  index + 1
                                }`}
                                fill
                                sizes="(max-width: 640px) 60px, 82px"
                                className="object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </DialogTrigger>
                <DialogContent className="w-[95vw] md:w-[80vw] lg:w-[50vw] border-0 min-w-[280px] max-w-[800px] aspect-square p-0">
                  <DialogTitle className="sr-only">
                    {itemDetail.name} Image View
                  </DialogTitle>
                  <div className="w-full aspect-square">
                    <Image
                      src={
                        allImages[selectedImage]?.image_url ||
                        "/placeholder.jpg"
                      }
                      alt={itemDetail.name}
                      fill
                      sizes="(max-width: 768px) 95vw, (max-width: 1024px) 80vw, 50vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Right side - Item Details */}
            <div className="flex-1 flex flex-col justify-between">
              <div className="space-y-4 sm:space-y-6">
                <div className="space-y-2 sm:space-y-3">
                  <h3>{itemDetail.name}</h3>

                  {/* Categories */}
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <h4>Category: </h4>
                    {itemDetail.categories.map((category) => (
                      <Badge
                        key={category.id}
                        variant="category"
                        className="text-xs sm:text-sm"
                      >
                        {category.name}
                      </Badge>
                    ))}
                  </div>

                  <p className="text-xl sm:text-2xl font-bold">
                    ${itemDetail.price}
                  </p>
                </div>

                {/* Description */}
                {itemDetail.description && (
                  <div className="border-t border-muted-foreground/50 pt-3 sm:pt-4">
                    <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                      {itemDetail.description}
                    </p>
                  </div>
                )}

                {/* Color */}
                {itemDetail.details?.color &&
                  itemDetail.details.color !== "null" && (
                    <div className="border-t border-muted-foreground/50 pt-3 sm:pt-4">
                      <div className="flex items-center gap-2">
                        <h4>Color: </h4>
                        <div
                          className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border"
                          style={{ backgroundColor: itemDetail.details.color }}
                        />
                        <span className="text-sm sm:text-base">
                          {itemDetail.details.color}
                        </span>
                      </div>
                    </div>
                  )}
              </div>

              <div className="mt-6 sm:mt-8 space-y-6 sm:space-y-8">
                {/* Sizes */}
                {itemDetail.sizes.length > 0 && (
                  <div className="space-y-2 sm:space-y-3">
                    <h4>Available Sizes</h4>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {itemDetail.sizes.map((size) => (
                        <TooltipProvider key={size.size}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                onClick={() =>
                                  size.quantity > 0 &&
                                  setSelectedSize(size.size)
                                }
                                className={cn(
                                  "relative flex cursor-pointer items-center justify-center p-2 border border-muted-foreground/1 shadow-sm rounded-md transition-all min-w-[50px] sm:min-w-[60px]",
                                  size.quantity === 0
                                    ? "opacity-100 cursor-not-allowed bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 border-neutral-200 dark:border-neutral-700"
                                    : selectedSize === size.size
                                    ? "border-2 bg-neutral-900 text-white"
                                    : "hover:border-foreground/70"
                                )}
                              >
                                <span className="text-sm sm:text-base font-medium">
                                  {size.size}
                                </span>
                                {size.quantity === 0 && (
                                  <X className="absolute inset-0 w-full h-full text-neutral-400 dark:text-neutral-500 opacity-50" />
                                )}
                              </div>
                            </TooltipTrigger>
                            {size.quantity === 0 && (
                              <TooltipContent>
                                <p>Sold Out</p>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="space-y-2 sm:space-y-3">
                  <h4 className="text-sm sm:text-base font-medium">Quantity</h4>
                  <Quantity
                    value={quantity}
                    onChange={setQuantity}
                    max={selectedSizeObj?.quantity}
                    disabled={!selectedSize}
                  />
                  {selectedSizeObj ? (
                    <p className="text-xs sm:text-sm text-foreground/90">
                      {selectedSizeObj.quantity} items available
                    </p>
                  ) : (
                    <p className="text-xs sm:text-sm text-foreground/90">
                      Please select a size
                    </p>
                  )}
                </div>

                {/* Add to Cart Button */}
                <Button
                  className="w-full max-w-[600px] h-10 sm:h-[44px]  text-sm sm:text-base font-medium"
                  disabled={!selectedSize || isAddingToCart}
                  variant="default"
                  onClick={async () => {
                    if (!user) {
                      if (!selectedSize || !itemDetail) return;

                      const selectedSizeObj = itemDetail.sizes.find(
                        (size) => size.size === selectedSize
                      );

                      if (!selectedSizeObj) return;

                      // Format categories string
                      const categoriesString = itemDetail.categories
                        .map((cat) => cat.name)
                        .join(", ");

                      // Get the last image URL (as per the format specification)
                      const imageUrl =
                        itemDetail.images.length > 0
                          ? itemDetail.images[itemDetail.images.length - 1]
                              .image_url
                          : null;

                      addToLocalCart({
                        id: itemDetail.id,
                        name: itemDetail.name,
                        price: itemDetail.price,
                        size: selectedSize,
                        size_id: selectedSizeObj.id,
                        quantity: quantity,
                        total_available: selectedSizeObj.quantity,
                        image_url: imageUrl,
                        categories: categoriesString,
                      });

                      toast.success("Added to cart successfully");
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
                      <span className="text-xs sm:text-sm">Adding...</span>
                    </div>
                  ) : (
                    <p className="text-xs font-extrabold sm:text-sm">
                      ADD TO CART
                    </p>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* Details (Color and Additional Details) */}
        {itemDetail.details && (
          <div className="pt-6 sm:pt-10 mb-4 sm:mb-8 md:-mb-16">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="details">
                <AccordionTrigger className="text-lg sm:text-xl md:text-2xl font-medium">
                  Details
                </AccordionTrigger>
                <AccordionContent>
                  {itemDetail.details.detail && (
                    <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none leading-6 sm:leading-8 dark:prose-invert [&_p]:whitespace-pre-line">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          table: ({ ...props }) => (
                            <div className="overflow-x-auto">
                              <table
                                className="min-w-full divide-y border my-2 sm:my-4 border-border"
                                {...props}
                              />
                            </div>
                          ),
                          th: ({ ...props }) => (
                            <th
                              className="px-3 sm:px-6 py-2 sm:py-3 bg-muted border-b text-left text-xs font-medium text-foreground/80 uppercase tracking-wider"
                              {...props}
                            />
                          ),
                          td: ({ ...props }) => (
                            <td
                              className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-foreground/80 border-b"
                              {...props}
                            />
                          ),
                          p: ({ ...props }) => (
                            <p
                              className="text-sm sm:text-base whitespace-pre-line text-foreground/80"
                              {...props}
                            />
                          ),
                          h3: ({ ...props }) => (
                            <h3
                              className="mt-6 sm:mt-8 mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-foreground/80"
                              {...props}
                            />
                          ),
                          hr: ({ ...props }) => (
                            <hr
                              className="my-6 sm:my-8 border-t border-border"
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
          <div className="space-y-2 w-full pt-6 sm:pt-10">
            <Image
              src={itemDetail.detail_images[0].image_url}
              alt={itemDetail.name}
              width={100}
              height={100}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        )}
      </div>
      {/* related items */}
      <RecentItems
        name="You might also like"
        cat_id={categoryId}
        item_id={itemDetail.id}
      />
    </div>
  );
}
