import React from "react";

export default function LoadingSpin() {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-8 h-8 rounded-full border-4 border-gray-300 animate-[spin_1.5s_linear_infinite]" />
        {/* Inner ring */}
        <div className="absolute top-0 left-0 w-8 h-8 rounded-full border-t-4 border-primary animate-[spin_1s_linear_infinite]" />
        {/* Center dot */}
        {/* <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-black rounded-full -translate-x-1/2 -translate-y-1/2" /> */}
      </div>
    </div>
  );
}
