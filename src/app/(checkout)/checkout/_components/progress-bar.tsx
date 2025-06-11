import React from "react";
import { Check } from "lucide-react";

interface ProgressBarProps {
  currentStep: number;
}

export default function ProgressBar({ currentStep = 1 }: ProgressBarProps) {
  const steps = [
    { id: 1, name: "Shipping" },
    { id: 2, name: "Confirmation" },
    { id: 3, name: "Payment" },
  ];

  return (
    <div className="w-full pt-8 md:pt-14 max-w-3xl mx-auto px-4 md:py-8">
      <div className="relative">
        {/* Progress bar line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted-foreground/20 -translate-y-1/2">
          <div
            className="h-full bg-foreground transition-all duration-300"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps */}
        <div className="absolute -top-3 md:-top-4 left-0 w-full flex justify-between">
          {steps.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;

            return (
              <div key={step.id} className="flex flex-col items-center">
                {/* Step circle */}
                <div
                  className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                    isCompleted
                      ? "bg-foreground border-foreground"
                      : isCurrent
                      ? "border-foreground border-[2.5px] bg-background"
                      : "border-muted-foreground/20 bg-background"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-background" />
                  ) : (
                    <span
                      className={`text-sm font-medium ${
                        isCurrent ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step.id}
                    </span>
                  )}
                </div>

                {/* Step label */}
                <span
                  className={`mt-2 text-xs md:text-sm font-medium ${
                    isCurrent ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
