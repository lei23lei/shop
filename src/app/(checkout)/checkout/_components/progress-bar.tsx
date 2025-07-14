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
    <div className="w-full pt-8 md:pt-16 max-w-4xl mx-auto px-4 md:py-8">
      <div className="relative">
        {/* Progress bar background */}
        <div className="absolute top-1/2 left-8 right-8 h-1 bg-gradient-to-r from-muted-foreground/10 to-muted-foreground/20 rounded-full -translate-y-1/2 shadow-inner">
          {/* Active progress line */}
          <div
            className="h-full bg-gradient-to-r from-primary via-primary/90 to-primary/80 rounded-full transition-all duration-700 ease-out shadow-lg relative overflow-hidden"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          >
            {/* Animated shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </div>
        </div>

        {/* Steps */}
        <div className="flex justify-between relative">
          {steps.map((step, index) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            const isUpcoming = step.id > currentStep;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center relative group"
              >
                {/* Step circle container with glow effect */}
                <div className="relative">
                  {/* Glow effect for current step */}
                  {isCurrent && (
                    <div className="absolute inset-0 rounded-full bg-primary/20 blur-lg scale-150 animate-pulse" />
                  )}

                  {/* Step circle */}
                  <div
                    className={`relative top-2 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-500 ease-out shadow-lg transform ${
                      isCompleted
                        ? "bg-gradient-to-br from-primary to-primary/90 border-2 border-primary/50 scale-105 hover:scale-110"
                        : isCurrent
                        ? "bg-gradient-to-br from-background to-background/90 border-3 border-primary shadow-primary/25 scale-110 hover:scale-115"
                        : "bg-gradient-to-br from-muted to-muted/80 border-2 border-muted-foreground/30 hover:scale-105"
                    }`}
                  >
                    {/* Inner ring for current step */}
                    {isCurrent && (
                      <div className="absolute inset-1 rounded-full border border-primary/20" />
                    )}

                    {isCompleted ? (
                      <Check className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground drop-shadow-sm animate-in fade-in zoom-in duration-300" />
                    ) : (
                      <span
                        className={`text-sm md:text-base font-semibold transition-colors duration-300 ${
                          isCurrent
                            ? "text-primary"
                            : isUpcoming
                            ? "text-muted-foreground/60"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step.id}
                      </span>
                    )}
                  </div>
                </div>

                {/* Step label */}
                <div className="mt-3 md:mt-4 text-center">
                  <span
                    className={`text-xs md:text-sm font-medium transition-all duration-300 ${
                      isCurrent
                        ? "text-primary font-semibold"
                        : isCompleted
                        ? "text-foreground/80"
                        : "text-muted-foreground/70"
                    }`}
                  >
                    {step.name}
                  </span>

                  {/* Progress indicator dot */}
                  <div
                    className={`mt-1 mx-auto w-1 h-1 rounded-full transition-all duration-300 ${
                      isCurrent
                        ? "bg-primary animate-pulse"
                        : isCompleted
                        ? "bg-primary/60"
                        : "bg-transparent"
                    }`}
                  />
                </div>

                {/* Connection line to next step */}
                {index < steps.length - 1 && (
                  <div className="absolute top-4 md:top-5 left-4 md:left-5 w-full h-0.5 bg-transparent" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress percentage indicator */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-muted/50 rounded-full">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-medium text-muted-foreground">
            Step {currentStep} of {steps.length}
          </span>
        </div>
      </div>
    </div>
  );
}
