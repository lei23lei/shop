import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetCartQuery } from "@/services/endpoints/account-endpoints";

interface StepThreeProps {
  onBack: () => void;
}

export default function StepThree({ onBack }: StepThreeProps) {
  const { data: cartData } = useGetCartQuery();

  const totalPrice =
    cartData?.items.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    ) ?? 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-semibold mb-6">Payment Information</h2>

      {/* Payment Form */}
      <div className="mb-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Card Number
            </label>
            <Input
              type="text"
              placeholder="1234 5678 9012 3456"
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Expiry Date
              </label>
              <Input type="text" placeholder="MM/YY" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">CVV</label>
              <Input type="text" placeholder="123" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Name on Card
            </label>
            <Input type="text" placeholder="John Doe" />
          </div>
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
          Back to Confirmation
        </Button>
        <Button>Complete Payment</Button>
      </div>
    </div>
  );
}
