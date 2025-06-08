import React from "react";
import { CreateOrderResponse } from "@/services/endpoints/account-endpoints";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Mail } from "lucide-react";

interface StepThreeProps {
  onBack: () => void;
  orderData: CreateOrderResponse;
}

export default function StepThree({ onBack, orderData }: StepThreeProps) {
  return (
    <div className="bg-white  rounded-lg shadow-sm p-6">
      <div className="flex flex-col items-center text-center space-y-6">
        <CheckCircle2 className="w-16 h-16 text-green-500" />
        <h2 className="text-2xl font-semibold">Order Placed Successfully!</h2>

        <div className="w-full max-w-md space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Order Details</h3>
            <p>Order ID: #{orderData.order.id}</p>
            <p>Total Amount: ${orderData.order.total_price}</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Payment Instructions</h3>
            <p className="mb-2">
              Please complete your payment via E-transfer to:
            </p>
            <p className="font-mono bg-white p-2 rounded">
              lei232lei91@gmail.com
            </p>
            <p className="text-sm mt-2">
              Important: Include your Order ID (#{orderData.order.id}) in the
              transfer message
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Need Help?</h3>
            <p className="flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              Contact us at: lei23lei91@gmail.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
