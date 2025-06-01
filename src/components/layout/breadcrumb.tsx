import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { categories } from "@/lib/data";

interface BreadcrumbNavigationProps {
  categoryId?: number;
  showItemName?: boolean;
  itemName?: string;
}

// Helper function to find category info
const findCategoryInfo = (catId: number) => {
  for (const category of categories) {
    const subcategory = category.subcategories.find((sub) => sub.id === catId);
    if (subcategory) {
      return {
        category: category.name,
        subcategory: subcategory.name,
        categoryId: category.id,
      };
    }
  }
  return null;
};

export default function BreadcrumbNavigation({
  categoryId,
  showItemName = false,
  itemName,
}: BreadcrumbNavigationProps) {
  const categoryInfo = categoryId ? findCategoryInfo(categoryId) : null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>

        {categoryInfo && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/items/${categoryInfo.categoryId}`}>
                {categoryInfo.category}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {categoryInfo.subcategory !== "All" && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/items/${categoryId}`}>
                    {categoryInfo.subcategory}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
          </>
        )}

        {showItemName && itemName && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{itemName}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
