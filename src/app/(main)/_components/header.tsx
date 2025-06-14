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
      src: "/images/clothes.jpg",
      phone: "/images/clothes-phone.jpg",
      alt: "clothes",
      title: "Style Redefined",
      subtitle: "Elevate Your Wardrobe",
      description:
        "Discover premium fashion that speaks your language. From timeless classics to cutting-edge trends.",
      link: "/items/1",
    },
    {
      src: "/images/food.png",
      phone: "/images/food-phone.png",
      alt: "food",
      title: "Taste Excellence",
      subtitle: "Gourmet Delights Await",
      description:
        "Indulge in carefully curated flavors and premium ingredients that transform every meal into an experience.",
      link: "/items/3",
    },
    {
      src: "/images/others.png",
      phone: "/images/others-phone.png",
      alt: "others",
      title: "Life Enhanced",
      subtitle: "Everything You Need & More",
      description:
        "Transform your space and lifestyle with our handpicked collection of home essentials and unique finds.",
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
                      {/* Mobile/Tablet Image (up to md) */}
                      <Image
                        src={image.phone}
                        alt={image.alt}
                        fill
                        className="object-cover md:hidden"
                        priority={index === 0}
                        sizes="100vw"
                      />
                      {/* Desktop Image (md and up) */}
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover hidden md:block"
                        priority={index === 0}
                        sizes="100vw"
                      />
                      {/* Enhanced gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/20"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"></div>

                      {/* Text overlay with improved layout */}
                      <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4 sm:px-8 md:px-16 lg:px-24">
                        <div className="max-w-4xl space-y-4 sm:space-y-6">
                          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight drop-shadow-2xl shadow-black/90">
                            {image.title}
                          </h1>
                          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-light italic opacity-90 drop-shadow-xl shadow-black/80">
                            {image.subtitle}
                          </h2>
                          <div className="w-16 sm:w-20 md:w-24 h-1 bg-white/80 mx-auto my-4 sm:my-6"></div>
                          <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-light leading-relaxed max-w-3xl mx-auto opacity-95 drop-shadow-lg shadow-black/70">
                            {image.description}
                          </p>
                          <div className="pt-4 sm:pt-6 md:pt-8">
                            <Link href={image.link}>
                              <Button
                                size="lg"
                                className="bg-white/95 text-black hover:bg-white hover:scale-105 font-bold px-8 py-4 sm:px-10 sm:py-5 md:px-12 md:py-6 text-base sm:text-lg md:text-xl rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 border-2 border-white/20 backdrop-blur-sm"
                              >
                                Explore
                              </Button>
                            </Link>
                          </div>
                        </div>
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
