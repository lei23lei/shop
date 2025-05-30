"use client";

import * as React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const recentItems = [
  {
    id: 1,
    name: "Item 1",
    category: "Category 1",
    price: 100,
    images: [
      "/images/shoes-1-1.webp",
      "/images/shoes-1-2.webp",
      "/images/shoes-1-3.webp",
      "/images/shoes-1-4.webp",
    ],
  },
  {
    id: 2,
    name: "Item 2",
    category: "Category 2",
    price: 150,
    images: [
      "/images/shoes-2-1.webp",
      "/images/shoes-2-2.webp",
      "/images/shoes-2-3.webp",
      "/images/shoes-2-4.webp",
    ],
  },
  {
    id: 3,
    name: "Item 3",
    category: "Category 3",
    price: 200,
    images: [
      "/images/shoes-3-1.webp",
      "/images/shoes-3-2.webp",
      "/images/shoes-3-3.webp",
      "/images/shoes-3-4.webp",
    ],
  },
  {
    id: 4,
    name: "Item 4",
    category: "Category 4",
    price: 250,
    images: [
      "/images/shoes-4-1.webp",
      "/images/shoes-4-2.webp",
      "/images/shoes-4-3.webp",
      "/images/shoes-4-4.webp",
    ],
  },
  {
    id: 5,
    name: "Item 5",
    category: "Category 5",
    price: 300,
    images: [
      "/images/shoes-5-1.webp",
      "/images/shoes-5-2.webp",
      "/images/shoes-5-3.webp",
      "/images/shoes-5-4.webp",
    ],
  },
];

export default function RecentItems() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  return (
    <div className="mx-auto mt-10 lg:pt-20 mb-10">
      <h2 className="px-14 mb-4">Recent Items</h2>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[plugin.current]}
        className="w-full"
      >
        <CarouselContent className="mx-0 mr-4 md:mr-0 md:mx-2 lg:mx-4">
          {recentItems.map((item) => (
            <CarouselItem
              key={item.id}
              className="basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              <div className="p-1">
                <Card>
                  <CardContent className="flex flex-col p-2 md:p-4">
                    <div className="relative aspect-square overflow-hidden rounded-lg">
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="mt-4 space-y-1">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-gray-500">{item.category}</p>
                      <p className="font-medium">${item.price}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" /> */}
      </Carousel>
    </div>
  );
}
