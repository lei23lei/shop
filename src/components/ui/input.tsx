import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-zinc-300 dark:border-zinc-500 focus:border-none bg-background px-3 py-2 text-sm ring-offset-background file:border-0" +
            "file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none " +
            "focus-visible:ring-1  focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:text-header-font disabled:bg-zinc-100 dark:disabled:bg-zinc-900 disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
