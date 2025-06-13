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
import LoadingPage from "@/components/loading/loading-page";
import { CheckoutFormData } from "./_components/schemas";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [orderData, setOrderData] = useState<CreateOrderResponse | null>(null);
  const [formData, setFormData] = useState<CheckoutFormData>({
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
    if (!cartData || !cartData.items || cartData.items.length === 0) {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login?redirect=/checkout");
    }
  }, [user, isAuthLoading, router]);

  // Show loading state while checking auth or loading cart
  if (isAuthLoading || isCartLoading) {
    return <LoadingPage />;
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
        return <StepThree orderData={orderData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ProgressBar currentStep={currentStep} />
      <div className="flex flex-col-reverse md:flex-row mt-14 items-start justify-center gap-4 md:gap-10">
        <div className="w-full md:w-[600px]">{renderStep()}</div>
        {currentStep !== 3 && (
          <CartSummary cartData={cartData} totalPrice={totalPrice} />
        )}
      </div>
    </div>
  );
}
