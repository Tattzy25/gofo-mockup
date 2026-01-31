import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";

interface TattooStylesProps {
  onClick?: () => void;
  isActive?: boolean;
}

export function TattooStyles({ onClick, isActive }: Readonly<TattooStylesProps>) {
  return (
    <LiquidMetalButton
      label="Styles"
      onClick={onClick}
      viewMode="text"
      animate={isActive}
    />
  );
}
