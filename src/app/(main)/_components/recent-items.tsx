"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useGetItemsQuery } from "@/services/endpoints/items-endpoints";
import LoadingSpin from "@/components/loading/loading-spin";

interface RecentItemsProps {
  name?: string;
  cat_id?: number;
  item_id?: number;
}

export default function RecentItems({
  name = "Recent Items",
  cat_id,
  item_id,
}: RecentItemsProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  const { data: itemsData, isLoading } = useGetItemsQuery({
    category: cat_id,
  });

  // Filter out the current item if item_id is provided
  const filteredItems = React.useMemo(() => {
    if (!itemsData?.results) return [];
    return itemsData.results.filter((item) => item.id !== item_id);
  }, [itemsData?.results, item_id]);

  if (isLoading || !itemsData?.results) {
    return (
      <div className="mx-auto mt-2 lg:pt-20 mb-8">
        <h2 className="px-14 mb-4">{name}</h2>
        <div className="flex justify-center min-h-[300px] items-center">
          <LoadingSpin />
        </div>
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto mt-2 md:pt-28   mb-8">
      <div className="px-4 md:px-14 mb-4 text-xl md:text-2xl font-medium">
        {name}
      </div>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[plugin.current]}
        className="w-full"
      >
        <CarouselContent className="mx-0 pb-4 mr-4 md:mr-0 md:mx-2 lg:mx-4">
          {filteredItems.map((item) => (
            <CarouselItem
              key={item.id}
              className="basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              <Link href={`/items-detail/${item.id}`}>
                <Card className="overflow-hidden transition-shadow duration-200 hover:shadow-lg cursor-pointer">
                  <CardContent className="flex flex-col p-2 md:p-3">
                    <div className="relative aspect-square overflow-hidden rounded-lg">
                      <Image
                        src={item.image || "/placeholder.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="mt-4 space-y-1">
                      <h4 className="font-semibold line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {item.categories[0]}
                      </p>
                      <p className="font-medium">${item.price}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute text-header-font border-muted-foreground/50 top-1/2 left-2 -translate-y-1/2" />
        <CarouselNext className="absolute text-header-font border-muted-foreground/50 top-1/2 right-2 -translate-y-1/2" />
      </Carousel>
    </div>
  );
}
