import React from "react";
import clsx from "clsx";

interface PrimaryButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  type = "button",
  onClick = () => {},
  children,
  className = "",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white py-2 px-4 rounded-lg font-bold transition-all duration-200 ease-in-out",
        {
          "opacity-50 cursor-not-allowed": disabled,
        },
        className,
      )}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
