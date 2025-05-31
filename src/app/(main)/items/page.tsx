"use client";

import React from "react";
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { categories } from "@/lib/data";
import { useGetItemsQuery } from "@/services/endpoints/items-endpoints";

export default function ItemsPage() {
  const { data: itemsData, isLoading } = useGetItemsQuery({});

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-2 px-0 lg:px-6 xl:px-10 2xl:px-16">
      <div className="flex flex-col gap-4 py-4 px-4 lg:px-0">
        <h2>Men collections</h2>
        <p className="text-sm text-muted-foreground">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
          quos.
        </p>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Items</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex border-t border-border pt-2">
        <div className=" hidden lg:block pl-4 w-60 py-2 space-y-2">
          {categories[0].subcategories.map((subcategory) => (
            <div
              key={subcategory.id}
              className="group relative cursor-pointer w-fit"
            >
              <h4 className="font-medium pb-1">{subcategory.name}</h4>
              <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-black transition-all duration-300 group-hover:w-full" />
            </div>
          ))}
        </div>
        <div className="flex-1 p-4">
          <div className="grid  grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4">
            {itemsData?.results.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden transition-shadow duration-200 hover:shadow-lg cursor-pointer"
              >
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <Image
                      src={item.image || "/placeholder.jpg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <h4 className="font-medium line-clamp-1">{item.name}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {item.categories[0]}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {item.description}
                    </p>
                    <p className="font-medium">${item.price}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
