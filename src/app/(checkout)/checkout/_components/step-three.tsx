import React from "react";
import { CreateOrderResponse } from "@/services/endpoints/account-endpoints";
import {
  CheckCircle2,
  Mail,
  Copy,
  Package,
  CreditCard,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface StepThreeProps {
  orderData: CreateOrderResponse;
}

export default function StepThree({ orderData }: StepThreeProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="w-[95%] md:max-w-2xl mx-auto space-y-2 md:space-y-4 mb-6">
      {/* Success Header */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl p-6 md:p-8 border border-green-200 dark:border-green-800">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-green-800 dark:text-green-200">
              Order Confirmed!
            </h2>
            <p className="text-green-700 dark:text-green-300 text-sm md:text-base">
              We&apos;ll send you a confirmation email in the next 5 minutes. If
              you don&apos;t receive it, please check your spam folder.
            </p>
          </div>
        </div>
      </div>

      {/* Order Summary Card */}
      <div className="bg-card rounded-xl shadow-sm border p-6 space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">
              Order Details
            </h3>
            <p className="text-sm text-muted-foreground">
              Your order has been placed successfully
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium text-muted-foreground">
                Order ID
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-semibold text-foreground">
                  #{orderData.order.id}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => copyToClipboard(orderData.order.id.toString())}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium text-muted-foreground">
                Status
              </span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-semibold text-foreground">
                  {orderData.order.status}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium text-muted-foreground">
                Total Amount
              </span>
              <span className="text-lg font-bold text-foreground">
                ${orderData.order.total_price}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium text-muted-foreground">
                Items
              </span>
              <span className="text-sm font-semibold text-foreground">
                {orderData.order.items.length} item(s)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Instructions Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-blue-200 dark:border-blue-800 p-6 space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-blue-200 dark:border-blue-700">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-blue-900 dark:text-blue-200">
              Payment Instructions
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Complete your payment to process your order
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white/80 dark:bg-blue-950/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">
                Next Step: Send E-transfer
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Send an E-transfer for{" "}
                <span className="font-semibold">
                  ${orderData.order.total_price}
                </span>{" "}
                to:
              </p>

              <div className="flex items-center gap-2 p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg border">
                <code className="flex-1 font-mono text-sm font-semibold text-blue-900 dark:text-blue-200">
                  lei232lei91@gmail.com
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                  onClick={() => copyToClipboard("lei232lei91@gmail.com")}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">
                🚨 Important: Include this in your transfer message
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 font-mono text-sm font-semibold text-amber-900 dark:text-amber-100 bg-amber-100 dark:bg-amber-900/50 px-2 py-1 rounded">
                  Order #{orderData.order.id}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200"
                  onClick={() =>
                    copyToClipboard(`Order #${orderData.order.id}`)
                  }
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Information */}
      <div className="bg-card rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-lg text-foreground mb-4">
          Shipping Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div>
              <span className="text-muted-foreground">Name:</span>
              <p className="font-medium text-foreground">
                {orderData.order.first_name} {orderData.order.last_name}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Address:</span>
              <p className="font-medium text-foreground">
                {orderData.order.shipping_address}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <span className="text-muted-foreground">City & ZIP:</span>
              <p className="font-medium text-foreground">
                {orderData.order.city}, {orderData.order.zip_code}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Contact:</span>
              <p className="font-medium text-foreground">
                {orderData.order.shipping_phone}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Support Card */}
      <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950/30 dark:to-slate-950/30 rounded-xl border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-900/50 rounded-lg flex items-center justify-center">
            <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">
              Need Help?
            </h3>
            <p className="text-sm text-muted-foreground">
              We&apos;re here to assist you
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <p className="text-sm text-muted-foreground">
            Have questions about your order? Contact us at:
          </p>
          <div className="flex items-center gap-2">
            <code className="font-mono text-sm font-medium text-foreground bg-muted px-2 py-1 rounded">
              lei23lei91@gmail.com
            </code>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              onClick={() => copyToClipboard("lei23lei91@gmail.com")}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-card rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-lg text-foreground mb-4">
          Order Items
        </h3>
        <div className="space-y-3">
          {orderData.order.items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium text-foreground">{item.item_name}</p>
                <p className="text-sm text-muted-foreground">
                  Size: {item.size} • Qty: {item.quantity}
                </p>
              </div>
              <p className="font-semibold text-foreground">
                ${(parseFloat(item.price) * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
