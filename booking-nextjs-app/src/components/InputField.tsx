import React from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
<<<<<<< HEAD
<<<<<<< HEAD
  type?: string;
  placeholder?: string;
  width: string;
  value?: string;
=======
  placeholder: string;
=======
  placeholder?: string;
>>>>>>> 31c5d0f445f6c01f63b611ffddd055e7dd793f69
  width?: string;
>>>>>>> 47537556e7febe9b005b42f30b803c2ba06cab56
  linkComponent?: React.ReactNode;
  className?: string;
  error?: { message?: string };
  helpText?: string;
}

export default function InputField({
  label,
<<<<<<< HEAD
  type = 'text',
  placeholder = '',
  width,
  value = '',
=======
  type = "text",
  placeholder = "",
  width = "w-full",
>>>>>>> 47537556e7febe9b005b42f30b803c2ba06cab56
  linkComponent,
  className = "",
  id,
  error,
  helpText = "",
  ...inputProps
}: InputFieldProps) {
  return (
    <div className={`flex flex-col gap-1 ${width}`}>
<<<<<<< HEAD
      <p className='text-gray-400 text-xs'>{label}</p>
=======
      <label htmlFor={id} className="text-gray-400 text-xs">
        {label}
      </label>
>>>>>>> 47537556e7febe9b005b42f30b803c2ba06cab56
      <input
        id={id}
        type={type}
<<<<<<< HEAD
        className='border border-gray-300 rounded px-3.5 py-2 w-full'
        placeholder={placeholder}
        value={value}
=======
        placeholder={placeholder}
        className={`border ${error ? "border-red-500" : "border-gray-300"} rounded px-3.5 py-2 w-full ${className}`}
        {...inputProps}
>>>>>>> 47537556e7febe9b005b42f30b803c2ba06cab56
      />
      {(error && error.message) ? (
        <p className="text-red-500 text-xs">{error.message}</p>
      ): helpText && (
        <p className="text-gray-500 text-xs">{helpText}</p>
      )}
      {linkComponent && <div className="text-right">{linkComponent}</div>}
    </div>
  );
}
