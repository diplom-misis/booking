import React from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
<<<<<<< HEAD
  type?: string;
  placeholder?: string;
  width: string;
  value?: string;
=======
  placeholder: string;
  width?: string;
>>>>>>> 47537556e7febe9b005b42f30b803c2ba06cab56
  linkComponent?: React.ReactNode;
  className?: string;
  error?: { message?: string }; // Для отображения ошибки
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
  placeholder,
  width = "w-full",
>>>>>>> 47537556e7febe9b005b42f30b803c2ba06cab56
  linkComponent,
  className = "",
  id,
  error,
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
      {error && error.message && (
        <p className="text-red-500 text-xs">{error.message}</p>
      )}
      {linkComponent && <div className="text-right">{linkComponent}</div>}
    </div>
  );
}
