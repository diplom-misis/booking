import React from 'react';

interface PrimaryButtonProps {
<<<<<<< HEAD
=======
  type: 'button' | 'submit' | 'reset' | undefined;
>>>>>>> 47537556e7febe9b005b42f30b803c2ba06cab56
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

<<<<<<< HEAD
const PrimaryButton: React.FC<PrimaryButtonProps> = ({ onClick = () => {}, children, className = '' }) => {
  return (
    <button
      type='button'
      onClick={onClick}
=======
const PrimaryButton: React.FC<PrimaryButtonProps> = ({ type = 'button', onClick = () => {}, children, className = '' }) => {
  return (
    <button
      type={type}
      // onClick={onClick}
>>>>>>> 47537556e7febe9b005b42f30b803c2ba06cab56
      className={`bg-blue-500 text-gray-100 py-2 rounded-lg font-bold ${className}`}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
