import React from "react";
import LoadingSpin from "./loading-spin";

interface LoadingPageProps {
  minHeight?: string;
  className?: string;
}

export default function LoadingPage({
  minHeight = "min-h-[750px]",
  className = "",
}: LoadingPageProps) {
  return (
    <div
      className={`container ${minHeight} flex items-center justify-center mx-auto p-4 ${className}`}
    >
      <LoadingSpin />
    </div>
  );
}
