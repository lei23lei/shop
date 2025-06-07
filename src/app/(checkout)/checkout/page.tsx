"use client";

import React, { useState } from "react";
import ProgressBar from "./_components/progress-bar";
import StepOne from "./_components/step-one";
import StepTwo from "./_components/step-two";
import StepThree from "./_components/step-three";
import { CartSummary } from "./_components/cart-summary";
import { useGetCartQuery } from "@/services/endpoints/account-endpoints";

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const { data: cartData } = useGetCartQuery();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne onNext={() => setCurrentStep(2)} />;
      case 2:
        return (
          <StepTwo
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        );
      case 3:
        return <StepThree onBack={() => setCurrentStep(2)} />;
      default:
        return null;
    }
  };

  const totalPrice =
    cartData?.items.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    ) ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <ProgressBar currentStep={currentStep} />
      <div className="flex mt-14 items-start justify-center gap-10">
        <div className="w-[600px]">{renderStep()}</div>
        <CartSummary cartData={cartData} totalPrice={totalPrice} />
      </div>
    </div>
  );
}
