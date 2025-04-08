import React from 'react';

interface PrimaryButtonProps {
  type: 'button' | 'submit' | 'reset' | undefined;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ type = 'button', onClick = () => {}, children, className = '' }) => {
  return (
    <button
      type={type}
      // onClick={onClick}
      className={`bg-blue-500 text-gray-100 py-2 rounded-lg font-bold ${className}`}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
