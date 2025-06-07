"use client";

import React, { useState } from "react";
import ProgressBar from "./_components/progress-bar";
import StepOne from "./_components/step-one";
import StepTwo from "./_components/step-two";
import StepThree from "./_components/step-three";

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);

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

  return (
    <div className="min-h-screen  bg-gray-50">
      <ProgressBar currentStep={currentStep} />
      <div className="flex mt-14  items-center justify-center gap-10">
        <div className="">{renderStep()}</div>
        <div className="">asd</div>
      </div>
    </div>
  );
}
