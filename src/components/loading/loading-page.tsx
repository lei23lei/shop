import React from "react";
import LoadingSpin from "./loading-spin";

export default function LoadingPage() {
  return (
    <div className="container min-h-[750px] flex items-center justify-center mx-auto p-4">
      <LoadingSpin />
    </div>
  );
}
