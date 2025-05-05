import { cn } from "@/utils/cn";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Field,
  Label,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { selectDataAirport, selectData } from "@/types/Search";

interface SelectInputProps {
  className?: string;
  title?: string;
  data: selectData[] | selectDataAirport[];
  disabled?: boolean;
  height?: string;
  widthSize?: string;
  defaultValue?: string;
  typeCombobox: boolean;
  placeholder?: string;
  required?: boolean;
  value: selectData | selectDataAirport | null;
  onChange: (value: selectData | selectDataAirport | null) => void;
  onSearch?: (query: string) => void;
  error?: boolean;
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
    onChange,
    onSearch,
    error,
  } = props;
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (onSearch && query) {
      onSearch(query);
    }
  }, [query, onSearch]);

  const filteredData: selectData[] | selectDataAirport[] =
    query === ""
      ? data
      : data.filter((item) => {
          return item.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <div>
      <Field className="flex flex-col gap-1">
        <Label className="text-gray-400 text-xs">{title}</Label>
        <Combobox
          value={value}
          onChange={onChange}
          onClose={() => setQuery("")}
        >
          <div className="relative">
            <ComboboxInput
              className={cn(
                `rounded-[4px] border bg-white text-m 
     focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
     ${error ? "border-red-500" : "border-gray-300"}`,
                className,
              )}
              disabled={disabled}
              placeholder={placeholder}
              displayValue={(item: selectData | selectDataAirport | null) => {
                if (item && "code" in item) {
                  return item.code;
                }
                return item?.name || "";
              }}
              style={{
                backgroundColor: disabled ? "#F9FAFB" : "",
              }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const inputValue = event.target.value;
                setQuery(inputValue);
                if (onSearch) {
                  onSearch(inputValue);
                }
              }}
              onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                const regex = /^[a-zA-Zа-яА-ЯёЁ\s]$/;
                if (!regex.test(event.key) && event.key !== "Backspace") {
                  event.preventDefault();
                }
              }}
              required={required}
            />
            {typeCombobox && (
              <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                <ChevronDownIcon className="size-4 text-gray-500" />
              </ComboboxButton>
            )}
          </div>

          <ComboboxOptions
            anchor="bottom"
            className={cn(
              "w-[var(--input-width)] rounded-xl mt-1 border bg-white py-2 empty:invisible",
              "transition duration-100 ease-in",
              filteredData.length >= 4 ? "h-[160px] overflow-y-auto" : "",
            )}
          >
            {filteredData.map((item: selectData | selectDataAirport) => (
              <ComboboxOption
                key={item.id}
                value={item}
                className="group flex min-h-9 items-center justify-center px-3 data-[focus]:bg-gray-100"
              >
                <span className="text-center whitespace-normal break-words">
                  {"code" in item ? item.code : item.name}
                </span>
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Combobox>
      </Field>
    </div>
  );
}
