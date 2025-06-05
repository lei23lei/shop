"use client";

import React from "react";
import Image from "next/image";
import {
  useGetItemDetailQuery,
  useDeleteItemMutation,
} from "@/services/endpoints/items-endpoints";
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

export default function ItemDetailPage({
  params,
}: {
  params: Promise<{ "item-id": string }>;
}) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const { data: itemDetail, isLoading } = useGetItemDetailQuery(
    Number(resolvedParams["item-id"])
  );
  const [deleteItem] = useDeleteItemMutation();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const [selectedImage, setSelectedImage] = React.useState<number>(0);
  const [dialogOpen, setDialogOpen] = React.useState(false);

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
                  // <p className="text-neutral-600">{itemDetail.description}</p>
                  <p className="text-muted-foreground">
                    Introducing the Quantum Widget, a revolutionary device that
                    harnesses zero-point energy to power your entire home with a
                    single button press. Its sleek, futuristic design blends
                    seamlessly into any decor while silently generating
                    limitless clean energy. Available now for pre-order, this
                    game-changer promises to redefine sustainability for the
                    modern age.
                  </p>
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
                <AlertDialog>
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
                </AlertDialog>
              </div>

              <div className="space-y-6">
                {/* Sizes */}
                {itemDetail.sizes.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Available Sizes</h3>
                    <div className="grid grid-cols-6 gap-2">
                      {itemDetail.sizes.map((size) => (
                        <div
                          key={size.size}
                          className={cn(
                            "flex cursor-pointer  items-center justify-center p-2 border border-muted-foreground/1 shadow-md rounded-md",
                            size.quantity === 0 && "opacity-50"
                          )}
                        >
                          <span className="font-medium">{size.size}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add to Cart Button */}
                <Button className="w-full h-12 bg-neutral-800 text-lg">
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* Details (Color and Additional Details) */}
        {itemDetail.details && (
          <div className="pt-10">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="details">
                <AccordionTrigger className="text-2xl font-medium">
                  Details
                </AccordionTrigger>
                <AccordionContent>
                  {itemDetail.details.detail && (
                    <div className="prose prose-sm max-w-none leading-8">
                      <ReactMarkdown>{itemDetail.details.detail}</ReactMarkdown>
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
      <RecentItems name="Related Items" cat_id={categoryId} />
    </div>
  );
}
