"use client";

import React from "react";
import Image from "next/image";
import { useGetItemDetailQuery } from "@/services/endpoints/items-endpoints";
import LoadingSpin from "@/components/loading-spin";
import BreadcrumbNavigation from "@/components/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ItemDetailPage({
  params,
}: {
  params: Promise<{ "item-id": string }>;
}) {
  const resolvedParams = React.use(params);
  const { data: itemDetail, isLoading } = useGetItemDetailQuery(
    Number(resolvedParams["item-id"])
  );

  const [selectedImage, setSelectedImage] = React.useState<number>(0);

  // Combine primary images and detail images for the gallery
  const allImages = React.useMemo(() => {
    if (!itemDetail) return [];

    const sortedImages = [...itemDetail.images].sort((a, b) =>
      b.is_primary ? 1 : -1
    );

    const sortedDetailImages = [...itemDetail.detail_images].sort(
      (a, b) => a.display_order - b.display_order
    );

    return [...sortedImages, ...sortedDetailImages];
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
    <div className="container mx-auto py-2 px-0 lg:px-6 xl:px-10 2xl:px-16">
      <div className="flex flex-col gap-4 py-4 px-4 lg:px-0">
        <BreadcrumbNavigation
          categoryId={categoryId}
          showItemName={true}
          itemName={itemDetail.name}
        />

        <div className="flex flex-col lg:flex-row gap-8 mt-4">
          {/* Left side - Image Gallery */}
          <div className="w-full lg:w-[600px]">
            {/* Main Image Container */}
            <div className="w-full aspect-square relative bg-neutral-100 rounded-lg overflow-hidden">
              {/* Main Image */}
              <Image
                src={allImages[selectedImage]?.image_url || "/placeholder.jpg"}
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
                        onClick={() => setSelectedImage(index)}
                        className={cn(
                          "relative w-[82px] aspect-square bg-neutral-100 rounded-md overflow-hidden transition-all",
                          selectedImage === index
                            ? "ring-2 ring-foreground/50 "
                            : "hover:ring-2 hover:ring-foreground/50"
                        )}
                      >
                        <Image
                          src={image.image_url}
                          alt={`${itemDetail.name} thumbnail ${index + 1}`}
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
          </div>

          {/* Right side - Item Details */}
          <div className="flex-1 space-y-6">
            <div>
              <h1 className="text-3xl font-semibold">{itemDetail.name}</h1>
              <p className="text-2xl font-bold mt-2">${itemDetail.price}</p>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <h3 className="font-medium">Categories</h3>
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
            </div>

            {/* Description */}
            {itemDetail.description && (
              <div className="space-y-2">
                <h3 className="font-medium">Description</h3>
                <p className="text-neutral-600">{itemDetail.description}</p>
              </div>
            )}

            {/* Details (Color and Additional Details) */}
            {itemDetail.details && (
              <div className="space-y-2">
                <h3 className="font-medium">Details</h3>

                {itemDetail.details.detail && (
                  <p className="text-neutral-600">
                    {itemDetail.details.detail}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-sm">Color:</span>
                  <div
                    className="w-6 h-6 rounded-full border"
                    style={{ backgroundColor: itemDetail.details.color }}
                  />
                  <span className="text-sm">{itemDetail.details.color}</span>
                </div>
              </div>
            )}

            {/* Sizes */}
            {itemDetail.sizes.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium">Available Sizes</h3>
                <div className="grid grid-cols-4 gap-2">
                  {itemDetail.sizes.map((size) => (
                    <div
                      key={size.size}
                      className={cn(
                        "flex flex-col items-center justify-center p-2 border rounded-md",
                        size.quantity === 0 && "opacity-50"
                      )}
                    >
                      <span className="font-medium">{size.size}</span>
                      <span className="text-sm text-neutral-500">
                        {size.quantity > 0
                          ? `${size.quantity} left`
                          : "Out of stock"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <Button className="w-full h-12 text-lg">Add to Cart</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
