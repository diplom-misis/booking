import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { DayPicker } from 'react-day-picker';
import { DateTime } from 'luxon';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { ru } from "react-day-picker/locale";
import 'react-day-picker/dist/style.css';

interface CalendarInputProps {
  disabled?: boolean
  placeholder: string
  hideCalendarIcon?: boolean
  required?: boolean
  value: Date | null;
  onChange: (date: Date | null) => void;
}

export default function CalendarInput(props: CalendarInputProps) {
  const { disabled, placeholder, hideCalendarIcon, required, value, onChange } = props

  const handleDateChange = (date: Date | undefined) => {
    onChange(date || null);
  };

  return (
    <Popover className="relative">
      <PopoverButton
        disabled={disabled}
        className="border p-2 rounded-[4px] flex items-center w-[262px] justify-between bg-white"
        style={{
          backgroundColor: disabled ? '#F9FAFB' : '',
        }}
      >
        <span className={`${!value ? 'text-gray-300' : 'text-gray-800'}`}>
          {value ? DateTime.fromJSDate(value).toFormat('d MMMM yyyy', { locale: 'ru' }) : placeholder}
        </span>
        {!hideCalendarIcon && <CalendarIcon className="w-5 h-5 text-gray-500" />}
      </PopoverButton>

      <PopoverPanel transition className="absolute z-10 mt-2 bg-white p-4 shadow-lg rounded-lg">
        <DayPicker
          locale={ru}
          mode="single"
          selected={value || undefined}
          onSelect={handleDateChange}
          classNames={{
            nav_button: 'text-gray-800',
          }}
          required={required}
        />
      </PopoverPanel>
    </Popover>
  );
}
