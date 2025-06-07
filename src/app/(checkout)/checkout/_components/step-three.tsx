import React from "react";

interface StepThreeProps {
  onBack: () => void;
}

export default function StepThree({ onBack }: StepThreeProps) {
  return (
    <div>
      <h2>Payment Information</h2>
      <div className="flex gap-4">
        <button onClick={onBack}>Back</button>
        <button>Complete Payment</button>
      </div>
    </div>
  );
}
