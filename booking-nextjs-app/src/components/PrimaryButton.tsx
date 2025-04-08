import React from 'react';

interface PrimaryButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ onClick = () => {}, children, className = '' }) => {
  return (
    <button
      type='button'
      onClick={onClick}
      className={`bg-blue-500 text-gray-100 py-2 rounded-lg font-bold ${className}`}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
