import { Button } from "@/src/components/ui/button";

interface SheardButtonProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

function SheardButton({ children, className, onClick }: SheardButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="sm"
      className={`group relative overflow-hidden cursor-pointer select-none ${className} bg-[#ff9D4D] rounded-none font-semibold transition-all hover:bg-[#ea9753] `}
    >
      <span className="relative z-10">{children}</span>
    </Button>
  );
}
export default SheardButton;
