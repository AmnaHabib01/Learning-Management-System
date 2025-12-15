import React from "react";
import { LoaderIcon } from "lucide-react";

// NOTE: Replace the cn function with your actual class merging utility 
// or use simple template literals if you don't need conditional merging.
// Example: import { cn } from "@/lib/utils";
const cn = (...classes) => classes.filter(Boolean).join(' '); 

/**
 * A reusable spinner component based on LoaderIcon from lucide-react.
 * * @param {object} props - Component props, including optional className.
 * @returns {JSX.Element}
 */
function Spinner({ className, ...props }) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

/**
 * An example component demonstrating the use of Spinner.
 * * @returns {JSX.Element}
 */
export function SpinnerCustom() {
  return (
    <div className="flex items-center gap-4">
      <Spinner className="size-6 text-blue-500" />
      <span className="text-gray-700">Please wait...</span>
    </div>
  );
}

export default Spinner;