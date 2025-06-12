import React from "react";
import { CreateOrderResponse } from "@/services/endpoints/account-endpoints";
import { CheckCircle2, Mail } from "lucide-react";

interface StepThreeProps {
  orderData: CreateOrderResponse;
}

export default function StepThree({ orderData }: StepThreeProps) {
  return (
    <div className="bg-card rounded-lg shadow-sm p-4 md:p-6">
      <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
        <CheckCircle2 className="w-12 h-12 md:w-16 md:h-16 text-green-500" />
        <h2 className="text-xl md:text-2xl font-semibold text-foreground">
          Order Placed Successfully!
        </h2>

        <div className="w-full max-w-xl space-y-3 md:space-y-4">
          <div className="bg-muted p-3 md:p-4 rounded-lg">
            <h3 className="font-medium mb-2 text-sm md:text-base text-foreground">
              Order Details
            </h3>
            <div className="space-y-1 text-sm md:text-base text-muted-foreground">
              <p>Order ID: #{orderData.order.id}</p>
              <p>Total Amount: ${orderData.order.total_price}</p>
            </div>
          </div>

          <div className="bg-primary/10 p-3 md:p-4 rounded-lg">
            <h3 className="font-medium mb-2 text-sm md:text-base text-foreground">
              Payment Instructions
            </h3>
            <div className="space-y-2">
              <p className="text-sm md:text-base text-muted-foreground">
                Please complete your payment via E-transfer to:
              </p>
              <p className="font-mono bg-card p-2 rounded text-sm md:text-base break-all text-foreground">
                lei232lei91@gmail.com
              </p>
              <p className="text-xs md:text-sm text-muted-foreground">
                Important: Include your Order ID (#{orderData.order.id}) in the
                transfer message
              </p>
            </div>
          </div>

          <div className="bg-muted p-3 md:p-4 rounded-lg">
            <h3 className="font-medium mb-2 text-sm md:text-base text-foreground">
              Need Help?
            </h3>
            <p className="flex items-center justify-center gap-2 text-sm md:text-base text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span className="break-all">lei23lei91@gmail.com</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
