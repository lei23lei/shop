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

export default function Header() {
  const images = [
    { src: "/images/image1.avif", alt: "Image 1" },
    { src: "/images/image2.avif", alt: "Image 2" },
    { src: "/images/image3.avif", alt: "Image 3" },
  ];

  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  return (
    <div>
      <Carousel
        className="w-full overflow-x-hidden"
        plugins={[plugin.current]}
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index} className="pl-0">
              <div>
                <Card className=" border-0">
                  <CardContent className="flex items-center justify-center p-0 h-[600px]  md:h-[650px] lg:h-[700px] xl:h-[750px] 2xl:h-[800px] ">
                    <div className="relative w-full h-full">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover "
                        priority={index === 0}
                        sizes="100vw"
                      />
                      {/* Dark gradient overlay from top */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-transparent"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
