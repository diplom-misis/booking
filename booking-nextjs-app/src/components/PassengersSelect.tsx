import { cn } from "@/utils/cn";
import { Button, Field, Label, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

const passengers: PassengerType[] = [
  { id: 1, name: 'Взрослые' },
  { id: 2, name: 'Дети' },
  { id: 3, name: 'Младенцы' },
]

type PassengerType = {
  id: number;
  name: keyof PassengersCount;
};

type PassengersCount = {
  Взрослые: number;
  Дети: number;
  Младенцы: number;
};

interface PassengersSelectProps {
  className?: string;
  value: PassengersCount;
  onChange: (value: PassengersCount) => void;
}

const getPassengersLabel = (count: number) => {
  if (count === 1) {
    return 'пассажир';
  } else if (count >= 2 && count <= 4) {
    return 'пассажира';
  } else {
    return 'пассажиров';
  }
};

export default function PassengersSelect({ value, onChange, className }: PassengersSelectProps) {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const totalPassengers: number = Object.values(value).reduce((acc, count) => acc + count, 0);

  const handleIncrement = (type: keyof PassengersCount) => {
    const updatedValue = { ...value, [type]: (value[type] || 0) + 1 };
    onChange(updatedValue);
  };

  const handleDecrement = (type: keyof PassengersCount) => {
    const updatedValue = { ...value, [type]: Math.max((value[type] || 0) - 1, type === 'Взрослые' ? 1 : 0) };
    onChange(updatedValue);
  };

  return (
    <Menu>
      <Field className="flex flex-col">
      <Label className="text-gray-400 text-xs mb-1">Пассажиры</Label>
      <MenuButton className={cn('h-11 px-[14px] py-[10px] rounded-[4px] border border-gray-300 bg-white text-sm text-left', className)}>
        <p>{totalPassengers} {getPassengersLabel(totalPassengers)}</p>
      </MenuButton>
      <MenuItems anchor="bottom" className={cn('w-[var(--button-width)] rounded-xl mt-1 border bg-white empty:invisible transition duration-100 ease-in px-4 py-4 flex flex-col gap-3')}>
        {passengers.map((item) => (
          <MenuItem key={item.id} as="div" onClick={handleClick} className="flex flex-row justify-between">
            <p className="text-sm">
              {item.name}
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => handleDecrement(item.name)}
                className={`rounded-full w-5 h-5 ${value[item.name] <= (item.name === 'Взрослые' ? 1 : 0) ? 'bg-gray-200' : 'bg-blue-500 hover:bg-blue-600'}`}
                disabled={value[item.name] <= (item.name === 'Взрослые' ? 1 : 0)}
              >
                -
              </Button>
              <span>{value[item.name] || 0}</span>
              <Button
                onClick={() => handleIncrement(item.name)}
                className={`rounded-full w-5 h-5 ${value[item.name] >= 9 ? 'bg-gray-200' : 'bg-blue-500 hover:bg-blue-600'}`}
                disabled={value[item.name] >= 9}
              >
                +
              </Button>          
            </div>
          </MenuItem>
        ))}
      </MenuItems>
      </Field>
    </Menu>
  )
}