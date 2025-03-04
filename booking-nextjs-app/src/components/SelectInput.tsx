import { cn } from "@/utils/cn";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Field, Label } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

type selectData = { id: number; name: string };

interface SelectInputProps {
  className?: string;
  title?: string
  data: selectData[]
  disabled?: boolean
  height?: string
  widthSize?: string
  defaultValue?: string
  typeCombobox: boolean
  placeholder?: string
  paddingY: string
  paddingX: string
  required?: boolean,
  value: selectData | null;
  onChange: (value: selectData | null) => void;
}

export default function SelectInput(props: SelectInputProps) {
  const {
    className,
    title,
    data,
    disabled = false,
    height,
    widthSize,
    defaultValue = '',
    typeCombobox,
    placeholder,
    paddingY,
    paddingX,
    required,
    value,
    onChange
  } = props
  const [query, setQuery] = useState('')
  // const [selectedData, setSelectedData] = useState<selectData | null>(null)

  const filteredData =
  query === ''
    ? data
    : data.filter((item) => {
        return item.name.toLowerCase().includes(query.toLowerCase())
      })
  
  // useEffect(() => {
  //   if (defaultValue) {
  //     const defaultItem = data.find(item => item.name === defaultValue)
  //     if (defaultItem) {
  //       setSelectedData(defaultItem)
  //     }
  //   }
  // }, [defaultValue, data])

  // useEffect(() => {
  //   onChange(selectedData);
  // }, [selectedData, onChange]);

  const handleChange = (item: selectData | null) => {
    onChange(item);
  };

  return (
    <div>
    <Field>
    <Label className="text-gray-400 text-s">{title}</Label>
    <Combobox value={value} onChange={handleChange} onClose={() => setQuery('')}>
        <div className="relative">
          <ComboboxInput
            className={cn(
              `rounded-[4px] border border-gray-300 bg-white py-${paddingY} px-${paddingX} text-sm`, className
            )}
            disabled={disabled}
            placeholder={placeholder}
            displayValue={(item: selectData | null) => item?.name || ""}
            // displayValue={(item) => item?.name}
            // onChange={(event) => setQuery(event.target.value)}
            style={{
              backgroundColor: disabled ? '#F9FAFB' : '',
            }}
            required={required}
          />
          {typeCombobox &&
            <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
              <ChevronDownIcon className="size-4 text-gray-500" />
            </ComboboxButton>
          }
        </div>

          <ComboboxOptions
            anchor="bottom"
            className={cn(
              'w-[var(--input-width)] rounded-xl mt-1 border bg-white py-2 empty:invisible',
              'transition duration-100 ease-in'
            )}
          >
            {filteredData.map((item) => (
              <ComboboxOption key={item.id} value={item} className="h-9 flex items-center justify-center data-[focus]:bg-gray-100">
                {item.name}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Combobox>
    </Field>
    </div>
  )
}