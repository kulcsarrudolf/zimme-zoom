import React from "react";

interface NavigationActionButtonProps {
  icon: string;
  onClick?: (e?: React.MouseEvent) => void;
  transform?: string;
}

export const NavigationActionButton: React.FC<NavigationActionButtonProps> = ({
  icon,
  onClick,
  transform,
}) => {
  return (
    <div
      style={{
        width: "24px",
        height: "24px",
        backgroundImage: icon,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        cursor: "pointer",
        transform,
      }}
      onClick={onClick}
    />
  );
};

export default NavigationActionButton;
