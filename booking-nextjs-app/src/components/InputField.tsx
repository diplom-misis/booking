interface InputFieldProps {
  label: string;
  type?: string;
  placeholder: string;
  width: string;
  linkComponent?: React.ReactNode;
}

export default function InputField({
  label,
  type = 'text',
  placeholder,
  width,
  linkComponent,
}: InputFieldProps) {
  return (
    <div className={`flex flex-col gap-1 ${width}`}>
      <p className="text-gray-400 text-xs">{label}</p>
      <input
        type={type}
        className="border border-gray-300 rounded px-3.5 py-2 w-full"
        placeholder={placeholder}
      />
      {linkComponent && <>{linkComponent}</>}
    </div>
  );
}
