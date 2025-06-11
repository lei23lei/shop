import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { PackageX } from "lucide-react";

export default function ItemNotFound() {
  const router = useRouter();

  return (
    <div className="container min-h-[500px] md:min-h-[600px] lg:min-h-[750px] flex items-center justify-center mx-auto p-4">
      <div className="text-center -mt-40 space-y-4 md:space-y-6 max-w-[280px] sm:max-w-md">
        <div className="flex justify-center">
          <PackageX className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3>Item Not Found</h3>
          <p className="text-muted-foreground text-xs sm:text-sm md:text-base">
            We couldn't find the item you're looking for. It might have been
            removed or is no longer available.
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
}
