import React from "react";
import BaseButton from "./BaseButton";

interface LightButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const LightButton: React.FC<LightButtonProps> = (props) => {
  return <BaseButton {...props} variant="light" />;
};

export default LightButton;
