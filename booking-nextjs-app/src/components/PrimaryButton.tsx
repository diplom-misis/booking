import React from "react";
import BaseButton from "./BaseButton";

interface PrimaryButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = (props) => {
  return <BaseButton {...props} variant="primary" />;
};

export default PrimaryButton;
