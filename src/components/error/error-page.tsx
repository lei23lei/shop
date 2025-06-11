import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

interface ErrorPageProps {
  title?: string;
  message?: string;
  showRetry?: boolean;
  onRetry?: () => void;
}

const ErrorPage = ({
  title = "Something went wrong",
  message = "We encountered an unexpected error. Please try again later.",
  showRetry = false,
  onRetry,
}: ErrorPageProps) => {
  const router = useRouter();

  return (
    <div className="container min-h-[500px] md:min-h-[600px] lg:min-h-[750px] flex items-center justify-center mx-auto p-4">
      <div className="text-center -mt-40 space-y-4 md:space-y-6 max-w-[280px] sm:max-w-md">
        <div className="flex justify-center">
          <AlertCircle className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-destructive" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground">
            {title}
          </h3>
          <p className="text-muted-foreground text-xs sm:text-sm md:text-base">
            {message}
          </p>
        </div>
        <div className="flex flex-row gap-2 sm:gap-4 justify-center">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="w-full sm:w-auto text-sm md:text-base"
          >
            Go Back
          </Button>
          {showRetry && (
            <Button
              onClick={onRetry}
              className="w-full sm:w-auto text-sm md:text-base"
            >
              Try Again
            </Button>
          )}
          <Button
            onClick={() => router.push("/")}
            className="w-full sm:w-auto text-sm md:text-base"
          >
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
