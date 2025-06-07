import React from "react";
import { Button } from "@/components/ui/button";
import { useGetCartQuery } from "@/services/endpoints/account-endpoints";

interface StepTwoProps {
  onNext: () => void;
  onBack: () => void;
}

export default function StepTwo({ onNext, onBack }: StepTwoProps) {
  const { data: cartData } = useGetCartQuery();

  const totalPrice =
    cartData?.items.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    ) ?? 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-semibold mb-6">Order Confirmation</h2>

      {/* Shipping Information */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Shipping Information</h3>
        <div className="space-y-2 text-neutral-600">
          <p>John Doe</p>
          <p>123 Main Street</p>
          <p>Apt 4B</p>
          <p>New York, NY 10001</p>
          <p>United States</p>
          <p>+1 (555) 123-4567</p>
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
          Back to Shipping
        </Button>
        <Button onClick={onNext}>Proceed to Payment</Button>
      </div>
    </div>
  );
}
