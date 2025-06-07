import React from "react";

interface StepTwoProps {
  onNext: () => void;
  onBack: () => void;
}

export default function StepTwo({ onNext, onBack }: StepTwoProps) {
  return (
    <div>
      <h2>Order Confirmation</h2>
      <div className="flex gap-4">
        <button onClick={onBack}>Back</button>
        <button onClick={onNext}>Proceed to Payment</button>
      </div>
    </div>
  );
}
