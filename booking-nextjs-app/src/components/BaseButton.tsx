import React from "react";
import clsx from "clsx";

interface BaseButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: "primary" | "light";
}

const BaseButton: React.FC<BaseButtonProps> = ({
  type = "button",
  onClick = () => {},
  children,
  className = "",
  disabled = false,
  variant = "primary",
}) => {
  const baseClasses = clsx(
    "h-[40px] rounded-[8px] border py-[8px] px-[16px] font-bold",
    "transition-all duration-200 ease-in-out",
    "flex items-center justify-center gap-[2px]",
    {
      "opacity-50 cursor-not-allowed": disabled,
    },
    className,
  );

  const variantClasses = {
    primary:
      "bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white border-transparent",
    light:
      "bg-white hover:border-white active:bg-gray-100 text-gray-800 border-gray-300",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(baseClasses, variantClasses[variant])}
    >
      {children}
    </button>
  );
};

export default BaseButton;
