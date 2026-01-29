import { Button } from "@/components/ui/button";

interface TattooStylesProps {
  onClick?: () => void;
  isActive?: boolean;
}

export function TattooStyles({ onClick, isActive }: Readonly<TattooStylesProps>) {
  return (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="default"
      className="rounded-full"
      onClick={onClick}
    >
      Styles
    </Button>
  );
}
