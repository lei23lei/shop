import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Quantity } from "@/components/cart/quantity";
import { User } from "@/contexts/auth-context";

// Unified cart item interface that can handle both types
interface UnifiedCartItem {
  id: number;
  cart_item_id: string | number;
  name: string;
  price: string;
  quantity: number;
  image_url: string | null;
  categories: string | null;
  size: string;
  total_available: number;
}

interface CartSheetProps {
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartData: { items: UnifiedCartItem[] } | undefined;
  localQuantities: Record<string | number, number>;
  localTotalPrice: number;
  handleDeleteItem:
    | ((cartItemId: number) => Promise<void>)
    | ((cartItemId: string) => void);
  handleUpdateQuantity:
    | ((cartItemId: number, newQuantity: number) => Promise<void>)
    | ((cartItemId: string, newQuantity: number) => void);
  user: User | null;
  cartCount: { total_items: number } | undefined;
}

export function CartSheet({
  isCartOpen,
  setIsCartOpen,
  cartData,
  localQuantities,
  localTotalPrice,
  handleDeleteItem,
  handleUpdateQuantity,
  user,
  cartCount,
}: CartSheetProps) {
  // Get quantity for an item
  const getItemQuantity = (item: UnifiedCartItem): number => {
    return localQuantities[item.cart_item_id] ?? item.quantity;
  };

  // Handle item deletion - pass the correct type based on user status
  const handleItemDelete = (item: UnifiedCartItem) => {
    if (user) {
      (handleDeleteItem as (cartItemId: number) => Promise<void>)(
        item.cart_item_id as number
      );
    } else {
      (handleDeleteItem as (cartItemId: string) => void)(
        item.cart_item_id as string
      );
    }
  };

  // Handle item quantity update - pass the correct type based on user status
  const handleItemQuantityUpdate = (
    item: UnifiedCartItem,
    newQuantity: number
  ) => {
    if (user) {
      (
        handleUpdateQuantity as (
          cartItemId: number,
          newQuantity: number
        ) => Promise<void>
      )(item.cart_item_id as number, newQuantity);
    } else {
      (
        handleUpdateQuantity as (
          cartItemId: string,
          newQuantity: number
        ) => void
      )(item.cart_item_id as string, newQuantity);
    }
  };

  const displayCartItems = cartData?.items || [];

  return (
    <div className="relative">
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetTrigger asChild>
          <ShoppingCart className="h-5 w-5 text-header-font cursor-pointer" />
        </SheetTrigger>
        <SheetHeader>
          <SheetTitle>{""}</SheetTitle>
        </SheetHeader>
        <SheetContent
          className="w-full  sm:w-[540px]  border-l-0"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="flex flex-col h-full overflow-hidden ">
            <ScrollArea className="flex-1 pr-4">
              <div className="flex flex-col gap-4 mt-4">
                {displayCartItems.length > 0 ? (
                  <>
                    {displayCartItems.map((item) => {
                      const quantity = getItemQuantity(item);

                      return (
                        <div
                          key={item.cart_item_id}
                          className="flex flex-row bg-header-background rounded-md p-2 gap-4"
                        >
                          <Link href={`/items-detail/${item.id}`}>
                            <div className="relative w-24 h-24 overflow-hidden rounded-md">
                              <Image
                                src={item.image_url ?? "/placeholder.jpg"}
                                alt={item.name}
                                fill
                                className="object-cover rounded-md transition-transform duration-300 hover:scale-110"
                              />
                            </div>
                          </Link>
                          <div className="flex flex-col pr-2 flex-1">
                            <div className="flex flex-row justify-between items-center">
                              <div className="font-medium text-sm line-clamp-1">
                                {item.name}
                              </div>
                              <div>
                                <Trash2
                                  className="w-4 h-4 cursor-pointer hover:text-primary"
                                  onClick={() => handleItemDelete(item)}
                                />
                              </div>
                            </div>
                            <div className="text-sm text-header-font">
                              {item.categories}
                            </div>
                            <div className="text-sm text-header-font">
                              {item.size}
                            </div>
                            <div className="flex border-t border-broder mt-2 pt-2 flex-row justify-between items-center">
                              <Quantity
                                value={quantity}
                                onChange={(newQuantity) =>
                                  handleItemQuantityUpdate(item, newQuantity)
                                }
                                max={item.total_available}
                              />
                              <div className="font-medium mt-1">
                                $
                                {(parseFloat(item.price) * quantity).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 px-6 space-y-6">
                    <div className="relative">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center shadow-inner">
                        <ShoppingCart className="w-8 h-8 md:w-10 md:h-10 text-gray-400 dark:text-gray-500" />
                      </div>
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="text-md md:text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Your cart is empty
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                        Discover amazing products and add them to your cart to
                        get started shopping!
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setIsCartOpen(false)}
                    >
                      Start Shopping
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
            {displayCartItems.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium text-sm">Total Price:</span>
                  <span className="font-medium text-sm">
                    ${localTotalPrice.toFixed(2)}
                  </span>
                </div>
                <Link href="/checkout">
                  <Button className="w-full font-extrabold bg-zinc-950/80 hover:bg-zinc-950/60 dark:bg-zinc-950 dark:hover:bg-zinc-950/60 text-zinc-100">
                    <p className="text-sm">Checkout</p>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
      {cartCount && cartCount.total_items > 0 && (
        <Badge
          variant="destructive"
          onClick={() => setIsCartOpen(true)}
          className="absolute -top-2 -right-3 cursor-pointer h-5 w-5 p-0 flex items-center justify-center"
        >
          <p className=""> {cartCount.total_items}</p>
        </Badge>
      )}
    </div>
  );
}
