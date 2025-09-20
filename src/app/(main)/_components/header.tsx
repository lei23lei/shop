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
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  return (
    <div className="relative overflow-hidden">
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <div className="absolute top-20 left-10 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-white/40 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 right-10 w-1 h-1 bg-white/30 rounded-full animate-pulse delay-500"></div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes typewriter {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        @keyframes blink {
          50% {
            border-color: transparent;
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fade-in-scale {
          animation: fadeInScale 0.6s ease-out forwards;
        }

        .animate-slide-in-left {
          animation: slideInFromLeft 0.7s ease-out forwards;
        }

        .animate-slide-in-down {
          animation: slideInDown 1s ease-out forwards;
        }

        .animate-zoom-in {
          animation: zoomIn 0.8s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }

        .animate-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }

        .animate-delay-600 {
          animation-delay: 0.6s;
          opacity: 0;
        }

        .animate-delay-800 {
          animation-delay: 0.8s;
          opacity: 0;
        }

        .animate-delay-1000 {
          animation-delay: 1s;
          opacity: 0;
        }

        .animate-delay-1200 {
          animation-delay: 1.2s;
          opacity: 0;
        }

        .shimmer-effect {
          position: relative;
          overflow: hidden;
        }

        .shimmer-effect::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          animation: shimmer 2s infinite;
        }
      `}</style>

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
                <Card className="border-0 shimmer-effect">
                  <CardContent className="flex items-center justify-center p-0 h-[85vh] xl:h-[90vh] relative group">
                    <div className="relative w-full h-full overflow-hidden">
                      {/* Mobile/Tablet Image */}
                      <Image
                        src={image.phone}
                        alt={image.alt}
                        fill
                        className="object-cover md:hidden transition-transform duration-700 group-hover:scale-105"
                        priority={index === 0}
                        sizes="100vw"
                      />
                      {/* Desktop Image */}
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover hidden md:block transition-transform duration-700 group-hover:scale-105"
                        priority={index === 0}
                        sizes="100vw"
                      />

                      {/* Enhanced gradient overlays */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/30 transition-opacity duration-500 group-hover:opacity-90"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40"></div>

                      {/* Text overlay with improved layout and animations */}
                      <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4 sm:px-8 md:px-16 lg:px-24 z-20 animate-fade-in-scale">
                        <div className="max-w-4xl space-y-4 sm:space-y-6">
                          <h1 className="animate-slide-in-down  text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium leading-tight tracking-wide text-white/95 drop-shadow-lg">
                            {image.title}
                          </h1>

                          <div className="animate-slide-in-left animate-delay-600 w-16 sm:w-20 md:w-24 lg:w-32 h-0.5 bg-white/60 mx-auto my-4 sm:my-6 rounded-full"></div>
                          <p className="animate-zoom-in animate-delay-800 text-base px-2 sm:text-sm md:text-md lg:text-lg leading-relaxed max-w-3xl mx-auto text-white/75 font-light">
                            {image.description}
                          </p>
                          <div className="animate-fade-in-scale animate-delay-1200 pt-4 sm:pt-6 md:pt-8">
                            <Link href={image.link}>
                              <Button
                                size="lg"
                                variant="glass"
                                className="  !rounded-full dark:bg-white/10 text-white  hover:scale-105 hover:-translate-y-0.5 font-semibold px-8 py-4 sm:px-10 sm:py-5 md:px-12 md:py-6 text-base sm:text-lg md:text-xl shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm transform relative overflow-hidden group"
                              >
                                <p className="relative z-10 text-sm sm:text-md ">
                                  Explore Collection
                                </p>
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
