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
import LoadingSpin from "@/components/loading-spin";

export default function RecentItems() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  const { data: itemsData, isLoading } = useGetItemsQuery({});

  if (isLoading || !itemsData?.results) {
    return (
      <div className="mx-auto mt-10 lg:pt-20 mb-8">
        <h2 className="px-14 mb-4">Recent Items</h2>
        <div className="flex justify-center min-h-[300px] items-center">
          <LoadingSpin />
        </div>
      </div>
    );
  }

  if (itemsData.results.length === 0) {
    return (
      <div className="mx-auto mt-10 lg:pt-20 mb-10">
        <h2 className="px-14 mb-4">Recent Items</h2>
        <p className="px-14">No items found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-10 lg:pt-20 mb-8">
      <h2 className="px-14 mb-4">Recent Items</h2>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[plugin.current]}
        className="w-full"
      >
        <CarouselContent className="mx-0 pb-4 mr-4 md:mr-0 md:mx-2 lg:mx-4">
          {itemsData.results.map((item) => (
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
                      <h4 className="font-semibold">{item.name}</h4>
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
        <CarouselPrevious className="absolute top-1/2 left-2 -translate-y-1/2" />
        <CarouselNext className="absolute top-1/2 right-2 -translate-y-1/2" />
      </Carousel>
    </div>
  );
}
