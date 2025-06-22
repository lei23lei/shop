import React from "react";
import { Button } from "@/components/ui/button";
import {
  useGetCartQuery,
  useCreateOrderMutation,
  useGuestCheckoutMutation,
  CartItem,
} from "@/services/endpoints/account-endpoints";
import { CreateOrderResponse } from "@/services/endpoints/account-endpoints";
import { toast } from "sonner";
import { CheckoutFormData } from "./schemas";
import { LocalCartItem, clearLocalCart } from "@/lib/cart-utils";

// Unified cart item type
type UnifiedCartItem = CartItem | LocalCartItem;

interface StepTwoProps {
  onNext: () => void;
  onBack: () => void;
  formData: CheckoutFormData;
  cartId: number;
  setOrderData: (data: CreateOrderResponse) => void;
  isGuestUser?: boolean;
  cartData?: {
    items: UnifiedCartItem[];
    total_items: number;
  };
}

export default function StepTwo({
  onNext,
  onBack,
  formData,
  cartId,
  setOrderData,
  isGuestUser = false,
  cartData: propCartData,
}: StepTwoProps) {
  // Use provided cart data or fetch from API for logged-in users
  const { data: apiCartData } = useGetCartQuery(undefined, {
    skip: isGuestUser,
  });
  const cartData = isGuestUser ? propCartData : apiCartData;

  const [createOrder, { isLoading: isCreatingOrder }] =
    useCreateOrderMutation();
  const [guestCheckout, { isLoading: isGuestCheckoutLoading }] =
    useGuestCheckoutMutation();

  const isLoading = isCreatingOrder || isGuestCheckoutLoading;

  const totalPrice =
    cartData?.items.reduce(
      (sum: number, item: UnifiedCartItem) =>
        sum + parseFloat(item.price) * item.quantity,
      0
    ) ?? 0;

  const handleProceedToPayment = async () => {
    if (isGuestUser) {
      try {
        // Prepare guest checkout data
        const guestCheckoutData = {
          cart: {
            items:
              cartData?.items.map((item) => ({
                id: item.id,
                size_id: "size_id" in item ? item.size_id : 0,
                quantity: item.quantity,
              })) || [],
          },
          shipping_address: formData.shipping_address,
          shipping_phone: formData.shipping_phone,
          shipping_email: formData.shipping_email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          zip_code: formData.zip_code,
          city: formData.city,
        };

        const response = await guestCheckout(guestCheckoutData).unwrap();

        // Clear localStorage cart after successful order
        clearLocalCart();

        // Convert guest checkout response to match CreateOrderResponse format
        const orderData: CreateOrderResponse = {
          message: response.message,
          order: {
            id: response.order.id,
            status: response.order.status as
              | "Pending"
              | "Processing"
              | "Shipped"
              | "Delivered",
            total_price: response.order.total_price,
            shipping_address: response.order.shipping_address,
            shipping_phone: response.order.shipping_phone,
            shipping_email: response.order.shipping_email,
            first_name: response.order.first_name,
            last_name: response.order.last_name,
            zip_code: response.order.zip_code,
            city: response.order.city,
            created_at: response.order.created_at,
            items: response.order.items.map((item) => ({
              id: item.id,
              item_name: item.item_name,
              size: item.size,
              quantity: item.quantity,
              price: item.price,
              image_url: item.image_url,
            })),
          },
        };

        setOrderData(orderData);
        toast.success(
          "Order created successfully! Check your email for payment instructions."
        );
        onNext();
      } catch (error) {
        console.error("Failed to create guest order:", error);
        toast.error("Failed to create order. Please try again.");
      }
      return;
    }

    try {
      const response = await createOrder({
        cart_id: cartId,
        ...formData,
      }).unwrap();
      setOrderData(response);
      toast.success("Order created successfully");
      onNext();
    } catch (error) {
      console.error("Failed to create order:", error);
      toast.error("Failed to create order. Please try again.");
    }
  };

  return (
    <div className="w-[95%] md:max-w-2xl mx-auto bg-card rounded-lg shadow-sm p-4 md:p-6">
      <h3 className="mb-4 text-foreground">Order Confirmation</h3>

      {/* Guest User Notice */}
      {isGuestUser && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            You are checking out as a guest. You will receive order confirmation
            and payment instructions via email.
          </p>
        </div>
      )}

      {/* Shipping Information */}
      <div className="mb-8">
        <h3 className="text-base md:text-lg font-medium mb-4 text-foreground">
          Shipping Information
        </h3>
        <div className="space-y-2 text-muted-foreground text-sm md:text-base">
          <p>{`${formData.first_name} ${formData.last_name}`}</p>
          <p>{formData.shipping_address}</p>
          <p>
            {formData.city}, {formData.zip_code}
          </p>
          <p>{formData.shipping_phone}</p>
          <p>{formData.shipping_email}</p>
        </div>
      </div>

      {/* Order Summary */}
      <div className="mb-8">
        <h4 className="text-foreground">Order Summary</h4>
        <div className="space-y-4 mt-2">
          {cartData?.items.map((item: UnifiedCartItem) => (
            <div
              key={item.cart_item_id}
              className="flex flex-col  md:justify-between md:items-start gap-1"
            >
              <div className="flex items-center gap-2 md:gap-4">
                <span className="text-muted-foreground text-sm md:text-base">
                  {item.quantity}x
                </span>
                <span className="text-xs md:text-sm line-clamp-1 text-foreground">
                  {item.name}
                </span>
              </div>
              <div className="flex justify-between w-full items-center">
                <span className="text-muted-foreground text-sm md:text-base">
                  Size: {item.size}
                </span>
                <span className="font-medium text-sm md:text-base text-foreground">
                  ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex w-full border-t border-border pt-2 mt-2 justify-between items-center">
          <span className="font-medium text-sm md:text-base text-foreground">
            Total
          </span>
          <span className="text-lg md:text-xl font-semibold text-foreground">
            ${totalPrice.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <Button variant="outline" onClick={onBack} className="w-full md:w-auto">
          Edit
        </Button>
        <Button
          onClick={handleProceedToPayment}
          className="w-full md:w-auto"
          disabled={isLoading}
        >
          {isLoading
            ? "Processing..."
            : isGuestUser
            ? "Place Order"
            : "Proceed to Payment"}
        </Button>
      </div>
    </div>
  );
}
