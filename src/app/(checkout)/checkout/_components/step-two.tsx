import React from "react";
import { Button } from "@/components/ui/button";
import {
  useGetCartQuery,
  useCreateOrderMutation,
} from "@/services/endpoints/account-endpoints";
import { CreateOrderResponse } from "@/services/endpoints/account-endpoints";
import { z } from "zod";
import { toast } from "sonner";

const formSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  shipping_email: z.string().email("Invalid email address"),
  shipping_phone: z.string().min(10, "Phone number must be at least 10 digits"),
  shipping_address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  zip_code: z.string().min(5, "Zip code must be at least 5 characters"),
});

type FormData = z.infer<typeof formSchema>;

interface StepTwoProps {
  onNext: () => void;
  onBack: () => void;
  formData: FormData;
  cartId: number;
  setOrderData: (data: CreateOrderResponse) => void;
}

export default function StepTwo({
  onNext,
  onBack,
  formData,
  cartId,
  setOrderData,
}: StepTwoProps) {
  const { data: cartData } = useGetCartQuery();
  const [createOrder] = useCreateOrderMutation();

  const totalPrice =
    cartData?.items.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    ) ?? 0;

  const handleProceedToPayment = async () => {
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
    <div className="bg-card rounded-lg shadow-sm p-4 md:p-6">
      <h3 className="mb-4 text-foreground">Order Confirmation</h3>

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
          {cartData?.items.map((item) => (
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
        <Button onClick={handleProceedToPayment} className="w-full md:w-auto">
          Proceed to Payment
        </Button>
      </div>
    </div>
  );
}
