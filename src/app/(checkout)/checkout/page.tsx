"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "./_components/progress-bar";
import StepOne from "./_components/step-one";
import StepTwo from "./_components/step-two";
import StepThree from "./_components/step-three";
import { CartSummary } from "./_components/cart-summary";
import { useGetCartQuery } from "@/services/endpoints/account-endpoints";
import { useAuth } from "@/contexts/auth-context";
import { CreateOrderResponse } from "@/services/endpoints/account-endpoints";
import { z } from "zod";

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

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [orderData, setOrderData] = useState<CreateOrderResponse | null>(null);
  const [formData, setFormData] = useState<FormData>({
    first_name: user?.first_name ?? "",
    last_name: user?.last_name ?? "",
    shipping_email: user?.email ?? "",
    shipping_phone: user?.phone_number ?? "",
    shipping_address: user?.address ?? "",
    city: "",
    zip_code: "",
  });
  const { data: cartData, isLoading: isCartLoading } = useGetCartQuery();

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login?redirect=/checkout");
    }
  }, [user, isAuthLoading, router]);

  // Show loading state while checking auth or loading cart
  if (isAuthLoading || isCartLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // If not authenticated, don't render anything (will redirect)
  if (!user) {
    return null;
  }

  const totalPrice =
    cartData?.items.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    ) ?? 0;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepOne
            onNext={() => setCurrentStep(2)}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 2:
        return (
          <StepTwo
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
            formData={formData}
            cartId={cartData?.cart_id ?? 0}
            setOrderData={setOrderData}
          />
        );
      case 3:
        if (!orderData) return null;
        return (
          <StepThree onBack={() => setCurrentStep(2)} orderData={orderData} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProgressBar currentStep={currentStep} />
      <div className="flex flex-col-reverse md:flex-row mt-14 items-start justify-center gap-10">
        <div className="w-full md:w-[600px]">{renderStep()}</div>
        {currentStep !== 3 && (
          <CartSummary cartData={cartData} totalPrice={totalPrice} />
        )}
      </div>
    </div>
  );
}
