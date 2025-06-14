"use client";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function Header() {
  const images = [
    {
      src: "/images/clothes.png",
      alt: "clothes",
      title: "Fashion & Style",
      subtitle: "Discover the latest trends in clothing and accessories",
      description: "From casual wear to formal attire, find your perfect style",
      link: "/items/1",
    },
    {
      src: "/images/food.png",
      alt: "food",
      title: "Fresh & Delicious",
      subtitle: "Premium quality food and beverages",
      description: "Taste the difference with our carefully selected products",
      link: "/items/3",
    },
    {
      src: "/images/others.png",
      alt: "others",
      title: "Everything Else",
      subtitle: "Home, electronics, and accessories products",
      description: "Complete your shopping with our diverse collection",
      link: "/items/4",
    },
  ];

  const plugin = React.useRef(
    Autoplay({ delay: 30000, stopOnInteraction: true })
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
                  {/* h-[600px]  md:h-[650px] lg:h-[700px] xl:h-[750px] 2xl:h-[800px]  */}
                  <CardContent className="flex items-center justify-center p-0 h-[85vh] xl:h-[90vh] ">
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
                      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-transparent"></div>

                      {/* Text overlay */}
                      <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4 sm:px-8 md:px-16">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-4 drop-shadow-2xl shadow-black/80">
                          {image.title}
                        </h1>
                        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium mb-2 sm:mb-4 drop-shadow-xl shadow-black/70">
                          {image.subtitle}
                        </h2>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mb-4 sm:mb-6 md:mb-8 drop-shadow-lg shadow-black/60">
                          {image.description}
                        </p>
                        <Link href={image.link}>
                          <Button
                            size="lg"
                            className="bg-white text-black hover:bg-gray-300 font-semibold px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            Shop Now
                          </Button>
                        </Link>
                      </div>
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
