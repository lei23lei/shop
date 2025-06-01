"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useGetItemsQuery } from "@/services/endpoints/items-endpoints";
import LoadingItems from "@/components/items-loading";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ItemsPage() {
  const searchParams = useSearchParams();
  const [page, setPage] = React.useState(1);

  const search = searchParams.get("search");
  console.log("Search query:", search);

  const { data: itemsData, isLoading } = useGetItemsQuery({
    page,
    search: search || undefined,
    page_size: 12,
  });

  const totalPages = itemsData ? Math.ceil(itemsData.count / 12) : 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto py-2 px-0 lg:px-6 xl:px-10 2xl:px-16">
      <div className="flex flex-col gap-4 py-4 px-4 lg:px-0">
        <h2>{search ? `Search Results for "${search}"` : "All Items"}</h2>
        <p className="text-sm text-muted-foreground">
          {search
            ? `Showing results for "${search}"`
            : "Browse our collection of items."}
        </p>
      </div>

      {/* loading */}
      {isLoading && <LoadingItems />}

      {/* no items */}
      {!isLoading &&
        (itemsData?.results.length === 0 || itemsData?.count === 0) && (
          <div className="flex justify-center items-center border-t min-h-[600px] border-border pt-2">
            <h2>No items found</h2>
          </div>
        )}

      {/* items */}
      {!isLoading && itemsData && itemsData?.count > 0 && (
        <div className="flex border-t min-h-[600px] border-border pt-2">
          <div className="flex-1 p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4">
              {itemsData?.results.map((item) => (
                <Link href={`/items-detail/${item.id}`} key={item.id}>
                  <Card className="overflow-hidden transition-shadow duration-200 hover:shadow-lg cursor-pointer">
                    <CardContent className="p-0">
                      <div className="relative aspect-square">
                        <Image
                          src={item.image || "/placeholder.jpg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-2 md:p-4 space-y-2">
                        <h4 className="font-medium line-clamp-1">
                          {item.name}
                        </h4>
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
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {!isLoading && totalPages >= 1 && (
        <div className="my-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) handlePageChange(page - 1);
                  }}
                  aria-disabled={page === 1}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map(
                (pageNum) => (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(pageNum);
                      }}
                      isActive={page === pageNum}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < totalPages) handlePageChange(page + 1);
                  }}
                  aria-disabled={page === (totalPages || 1)}
                  className={
                    page === (totalPages || 1)
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
