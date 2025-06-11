import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
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

interface CartItem {
  id: number;
  cart_item_id: number;
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
  cartData: { items: CartItem[] } | undefined;
  localQuantities: Record<number, number>;
  localTotalPrice: number;
  handleDeleteItem: (cartItemId: number) => Promise<void>;
  handleUpdateQuantity: (
    cartItemId: number,
    newQuantity: number
  ) => Promise<void>;
  user: any;
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
  return (
    <div className="relative">
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetTrigger asChild>
          <ShoppingCart className="h-5 w-5 text-header-font cursor-pointer" />
        </SheetTrigger>
        <SheetHeader>
          <SheetTitle>{""}</SheetTitle>
        </SheetHeader>
        <SheetContent className="w-full  sm:w-[540px]  border-l-0">
          <div className="flex flex-col h-full overflow-hidden ">
            <ScrollArea className="flex-1 pr-4">
              <div className="flex flex-col gap-4 mt-4">
                {cartData && cartData.items.length > 0 ? (
                  <>
                    {cartData.items.map((item) => (
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
                            <div className="font-medium line-clamp-1">
                              {item.name}
                            </div>
                            <div>
                              <Trash2
                                className="w-4 h-4 cursor-pointer hover:text-primary"
                                onClick={() =>
                                  handleDeleteItem(item.cart_item_id)
                                }
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
                              value={
                                localQuantities[item.cart_item_id] ??
                                item.quantity
                              }
                              onChange={(newQuantity) =>
                                handleUpdateQuantity(
                                  item.cart_item_id,
                                  newQuantity
                                )
                              }
                              max={item.total_available}
                            />
                            <div className="font-medium mt-1">
                              $
                              {(
                                parseFloat(item.price) *
                                (localQuantities[item.cart_item_id] ??
                                  item.quantity)
                              ).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="text-center py-8 text-neutral-500">
                    Your cart is empty
                  </div>
                )}
              </div>
            </ScrollArea>
            {cartData && cartData.items.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">Total Price:</span>
                  <span className="font-medium">
                    ${localTotalPrice.toFixed(2)}
                  </span>
                </div>
                <Link href="/checkout">
                  <Button className="w-full font-extrabold bg-zinc-950/80 hover:bg-zinc-950/60 dark:bg-zinc-950 dark:hover:bg-zinc-950/60 text-zinc-100">
                    Checkout
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
      {user && cartCount && cartCount.total_items > 0 && (
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
