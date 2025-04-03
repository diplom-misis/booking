<<<<<<< HEAD
import { cn } from '@/utils/cn';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Field,
  Label,
} from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
=======
import { cn } from "@/utils/cn";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Field, Label } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
>>>>>>> 767ed520b7cdbc78b94be2223036b54e5c0600a7

export type selectData = { id: string; name: string };
export type selectDataAirport = {
  id: string
  name: string
  code: string
}

interface SelectInputProps {
  className?: string;
  title?: string
  data: selectData[] | selectDataAirport[]
  disabled?: boolean
  height?: string
  widthSize?: string
  defaultValue?: string
  typeCombobox: boolean
  placeholder?: string
  required?: boolean,
  value: selectData | selectDataAirport | null;
  onChange: (value: selectData | selectDataAirport  | null) => void;
}

export default function SelectInput(props: SelectInputProps) {
  const {
    className,
    title,
    data,
    disabled = false,
    typeCombobox,
    placeholder,
    required,
    value,
    onChange
  } = props
  const [query, setQuery] = useState('')

  const filteredData: selectData[] | selectDataAirport[] =
  query === ''
    ? data
    : data.filter((item) => {
        return item.name.toLowerCase().includes(query.toLowerCase())
      })

  return (
    <div>
    <Field>
    <Label className="text-gray-400 text-s">{title}</Label>
    <Combobox value={value} onChange={onChange} onClose={() => setQuery('')}>
        <div className="relative">
          <ComboboxInput
            className={cn(
              `rounded-[4px] border border-gray-300 bg-white text-sm`, className
            )}
            disabled={disabled}
            placeholder={placeholder}
            displayValue={(item: selectData | selectDataAirport | null) => {
              if (item && 'code' in item) {
                return item.code;
              }
              return item?.name || "";
            }}
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
            anchor='bottom'
            className={cn(
              'w-[var(--input-width)] rounded-xl mt-1 border bg-white py-2 empty:invisible',
              'transition duration-100 ease-in'
            )}
          >
<<<<<<< HEAD
            {filteredData.map((item) => (
              <ComboboxOption
                key={item.id}
                value={item}
                className='h-9 flex items-center justify-center data-[focus]:bg-gray-100'
              >
                {item.name}
=======
            {filteredData.map((item: selectData | selectDataAirport) => (
              <ComboboxOption key={item.id} value={item} className="h-9 flex items-center justify-center data-[focus]:bg-gray-100">
                {item && 'code' in item ? item.code : item.name}
>>>>>>> 767ed520b7cdbc78b94be2223036b54e5c0600a7
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Combobox>
      </Field>
    </div>
  );
}
