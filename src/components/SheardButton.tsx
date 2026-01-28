import { Button } from "@/src/components/ui/button";

interface SheardButtonProps {
  children?: React.ReactNode;
  className?: string;
}

function SheardButton({ children, className }: SheardButtonProps) {
  return (
    <Button
      size="lg"
      className={`group relative overflow-hidden cursor-pointer select-none ${className} bg-[#ff9D4D] rounded-none px-4 py-5 text-sm font-semibold transition-all hover:bg-[#ea9753] lg:px-8 lg:py-7 lg:text-base`}
    >
      <span className="relative z-10">{children}</span>
    </Button>
  );
}
export default SheardButton;
