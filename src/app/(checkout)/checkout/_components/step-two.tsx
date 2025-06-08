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
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-semibold mb-6">Order Confirmation</h2>

      {/* Shipping Information */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Shipping Information</h3>
        <div className="space-y-2 text-neutral-600">
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
        <h3 className="text-lg font-medium mb-4">Order Summary</h3>
        <div className="space-y-4">
          {cartData?.items.map((item) => (
            <div
              key={item.cart_item_id}
              className="flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <span className="text-neutral-600">{item.quantity}x</span>
                <span>{item.name}</span>
              </div>
              <span className="font-medium">
                ${(parseFloat(item.price) * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total</span>
            <span className="text-xl font-semibold">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onBack}>
          Edit
        </Button>
        <Button onClick={handleProceedToPayment}>Proceed to Payment</Button>
      </div>
    </div>
  );
}
