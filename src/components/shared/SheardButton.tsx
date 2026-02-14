import React, { ButtonHTMLAttributes } from "react";
import { Button } from "@/src/components/ui/button";

interface SheardButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
}

function SheardButton({ children, className, type = "button", ...props }: SheardButtonProps) {
  return (
    <Button
      type={type}
      size="sm"
      className={`group relative overflow-hidden cursor-pointer select-none ${className} bg-[#ff9D4D] rounded-none font-semibold transition-all hover:bg-[#ea9753] `}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </Button>
  );
}
export default SheardButton;
