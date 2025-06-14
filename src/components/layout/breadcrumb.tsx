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
  console.log("catId", catId);
  for (const category of categories) {
    const subcategory = category.subcategories.find((sub) => sub.id === catId);
    if (subcategory) {
      return {
        category: category.name,
        subcategory: subcategory.name,
        categoryId: category.id,
        subcategoryId: subcategory.id,
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
          <BreadcrumbLink href="/">
            <p className="font-medium">Home</p>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {categoryInfo && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/items/${categoryInfo.categoryId}`}>
                <p className="font-medium">{categoryInfo.category}</p>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {categoryInfo.subcategory && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/items/${categoryInfo.subcategoryId}`}>
                    <p className="font-medium">{categoryInfo.subcategory}</p>
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
