"use client";

import React from "react";
import { useGetItemDetailQuery } from "@/services/endpoints/items-endpoints";
import LoadingSpin from "@/components/loading-spin";
import BreadcrumbNavigation from "@/components/layout/breadcrumb";

export default function ItemDetailPage({
  params,
}: {
  params: Promise<{ "item-id": string }>;
}) {
  const resolvedParams = React.use(params);
  const { data: itemDetail, isLoading } = useGetItemDetailQuery(
    Number(resolvedParams["item-id"])
  );

  if (isLoading) {
    return (
      <div className="container mx-auto min-h-[600px] flex items-center justify-center">
        <LoadingSpin />
      </div>
    );
  }

  if (!itemDetail) {
    return (
      <div className="container mx-auto min-h-[600px] flex items-center justify-center">
        <h2>Item not found</h2>
      </div>
    );
  }

  // Get the first category's ID if it exists
  const categoryId = itemDetail.categories[0]?.id;

  return (
    <div className="container mx-auto py-2 px-0 lg:px-6 xl:px-10 2xl:px-16">
      <div className="flex flex-col gap-4 py-4 px-4 lg:px-0">
        <BreadcrumbNavigation
          categoryId={categoryId}
          showItemName={true}
          itemName={itemDetail.name}
        />
        <h1 className="text-2xl font-semibold">{itemDetail.name}</h1>
        <pre>{JSON.stringify(itemDetail, null, 2)}</pre>
      </div>
    </div>
  );
}
