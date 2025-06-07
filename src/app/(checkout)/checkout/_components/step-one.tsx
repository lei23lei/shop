import React from "react";

interface StepOneProps {
  onNext: () => void;
}

export default function StepOne({ onNext }: StepOneProps) {
  return (
    <div>
      <h2>Shipping Information</h2>
      <button onClick={onNext}>Next</button>
    </div>
  );
}
