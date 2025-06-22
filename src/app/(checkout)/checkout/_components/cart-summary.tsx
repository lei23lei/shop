import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CartItem } from "@/services/endpoints/account-endpoints";
import { LocalCartItem } from "@/lib/cart-utils";

// Unified cart item type
type UnifiedCartItem = CartItem | LocalCartItem;

interface CartSummaryProps {
  cartData: { items: UnifiedCartItem[] } | undefined;
  totalPrice: number;
}

export function CartSummary({ cartData, totalPrice }: CartSummaryProps) {
  const CartItems = () => (
    <div className="space-y-4">
      {cartData?.items.map((item) => (
        <div key={item.cart_item_id} className="flex gap-4">
          <Link href={`/items-detail/${item.id}`}>
            <div className="relative w-20 h-20 overflow-hidden rounded-md">
              <Image
                src={item.image_url ?? "/placeholder.jpg"}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
          </Link>
          <div className="flex-1">
            <div className="font-medium line-clamp-1 text-foreground">
              {item.name}
            </div>
            <div className="text-sm text-muted-foreground">
              {item.categories}
            </div>
            <div className="text-sm text-muted-foreground">{item.size}</div>
            <div className="flex justify-between items-center mt-1">
              <div className="text-sm text-muted-foreground">
                Qty: {item.quantity}
              </div>
              <div className="font-medium text-foreground">
                ${(parseFloat(item.price) * item.quantity).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block w-[400px] bg-card rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4 text-foreground">
          Order Summary
        </h2>
        <CartItems />
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium text-foreground">Total Price:</span>
            <span className="font-medium text-foreground">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden w-full bg-card rounded-lg shadow-sm">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="cart-summary" className="border-none">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex justify-between items-center w-full">
                <h4 className="text-foreground">Order Summary</h4>
                <span className="font-medium text-foreground">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <CartItems />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
}
