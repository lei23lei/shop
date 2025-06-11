"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useGetItemsQuery } from "@/services/endpoints/items-endpoints";
import LoadingItems from "@/components/loading/items-loading";
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
import Sort from "./_components/sort";
import ItemNotFound from "@/components/notfound/item-notfound";
import ErrorPage from "@/components/error/error-page";

function ItemsContent() {
  const searchParams = useSearchParams();
  const [page, setPage] = React.useState(1);
  const [sort, setSort] = React.useState<"created_at" | "price" | "name">(
    "created_at"
  );
  const [order, setOrder] = React.useState<"asc" | "desc">("desc");

  const search = searchParams.get("search");
  console.log("Search query:", search);

  const {
    data: itemsData,
    isLoading,
    isError,
  } = useGetItemsQuery({
    page,
    search: search || undefined,
    page_size: 12,
    sort,
    order,
  });

  console.log("isError", isError);

  const totalPages = itemsData ? Math.ceil(itemsData.count / 12) : 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (newSort: string, newOrder: "asc" | "desc") => {
    setSort(newSort as "created_at" | "price" | "name");
    setOrder(newOrder);
    setPage(1); // Reset to first page when sorting changes
  };

  return (
    <div className="container mx-auto py-2 px-0 lg:px-6 xl:px-10 2xl:px-16">
      <div className="flex flex-col gap-4 py-4 px-4 lg:px-0">
        <h3>{search ? `Search Results for "${search}"` : "All Items"}</h3>
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {search
              ? `Showing results for "${search}"`
              : "Browse our collection of items."}
          </p>
          <Sort
            onSortChange={handleSortChange}
            currentSort={sort}
            currentOrder={order}
          />
        </div>
      </div>

      {/* error */}
      {isError && (
        <ErrorPage
          title="Connection Error"
          message="Unable to connect to the server. Please check your internet connection and try again."
          showRetry={true}
          onRetry={() => window.location.reload()}
        />
      )}

      {/* loading */}
      {isLoading && <LoadingItems />}

      {/* no items */}
      {!isLoading &&
        !isError &&
        (itemsData?.results.length === 0 || itemsData?.count === 0) && (
          <ItemNotFound />
        )}

      {/* items */}
      {!isLoading && !isError && itemsData && itemsData?.count > 0 && (
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

export default function ItemsPage() {
  return (
    <Suspense fallback={<LoadingItems />}>
      <ItemsContent />
    </Suspense>
  );
}
