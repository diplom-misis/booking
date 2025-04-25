import React from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  placeholder?: string;
  width?: string;
  linkComponent?: React.ReactNode;
  className?: string;
  error?: { message?: string };
  helpText?: string;
}

export default function InputField({
  label,
  type = "text",
  placeholder = "",
  width = "w-full",
  linkComponent,
  className = "",
  id,
  error,
  helpText = "",
  ...inputProps
}: InputFieldProps) {
  return (
    <div className={`flex flex-col gap-1 ${width}`}>
      <label htmlFor={id} className="text-gray-400 text-xs">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={`border ${error ? "border-red-500" : "border-gray-300"} rounded px-3.5 py-2 w-full ${className}`}
        {...inputProps}
      />
      {error && error.message ? (
        <p className="text-red-500 text-xs">{error.message}</p>
      ) : (
        helpText && <p className="text-gray-500 text-xs">{helpText}</p>
      )}
      {linkComponent && <div className="text-right">{linkComponent}</div>}
    </div>
  );
}
