import { PassengersCount, PassengerType } from "@/types/Search";
import { cn } from "@/utils/cn";
import {
  Button,
  Field,
  Label,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";

const passengers: PassengerType[] = [
  { id: 1, name: "Взрослые" },
  { id: 2, name: "Дети" },
  { id: 3, name: "Младенцы" },
];

interface PassengersSelectProps {
  className?: string;
  value: PassengersCount;
  onChange: (value: PassengersCount) => void;
}

const getPassengersLabel = (count: number) => {
  if (count === 1) {
    return "пассажир";
  } else if (count >= 2 && count <= 4) {
    return "пассажира";
  } else {
    return "пассажиров";
  }
};

export default function PassengersSelect({
  value,
  onChange,
  className,
}: PassengersSelectProps) {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const totalPassengers: number = Object.values(value).reduce(
    (acc, count) => acc + count,
    0,
  );

  const handleIncrement = (type: keyof PassengersCount) => {
    const updatedValue = { ...value, [type]: (value[type] || 0) + 1 };
    onChange(updatedValue);
  };

  const handleDecrement = (type: keyof PassengersCount) => {
    const updatedValue = {
      ...value,
      [type]: Math.max((value[type] || 0) - 1, type === "Взрослые" ? 1 : 0),
    };
    onChange(updatedValue);
  };

  return (
    <Menu>
      {({ open }) => (
        <Field className="flex flex-col">
          <Label className="text-gray-400 text-xs mb-1 font-inter">
            Пассажиры
          </Label>
          <MenuButton
            className={cn(
              "border h-11 px-[14px] py-[10px] rounded-[4px] bg-white text-base text-left focus:outline-none font-inter",
              open ? "border-blue-500 ring-blue-500" : "border-gray-300",
              className,
            )}
          >
            <p>
              {totalPassengers} {getPassengersLabel(totalPassengers)}
            </p>
          </MenuButton>
          <MenuItems
            anchor="bottom"
            className={cn(
              "w-[var(--button-width)] rounded-xl mt-1 border bg-white empty:invisible transition duration-100 ease-in px-4 py-4 flex flex-col gap-3",
            )}
          >
            {passengers.map((item) => (
              <MenuItem
                key={item.id}
                as="div"
                onClick={handleClick}
                className="flex flex-row justify-between"
              >
                <p className="text-sm">{item.name}</p>
                <div className="flex gap-2 items-center">
                  <Button
                    onClick={() => handleDecrement(item.name)}
                    disabled={
                      value[item.name] <= (item.name === "Взрослые" ? 1 : 0)
                    }
                    className="group"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className={`w-7 h-7 transition-colors ${
                        value[item.name] <= (item.name === "Взрослые" ? 1 : 0)
                          ? "fill-gray-200"
                          : "fill-blue-500 group-hover:fill-blue-600"
                      }`}
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm3 10.5a.75.75 0 0 0 0-1.5H9a.75.75 0 0 0 0 1.5h6Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Button>
                  <span>{value[item.name] || 0}</span>
                  <Button
                    onClick={() => handleIncrement(item.name)}
                    disabled={value[item.name] >= 9}
                    className="group"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className={`w-7 h-7 transition-colors ${
                        value[item.name] >= 9
                          ? "fill-gray-200"
                          : "fill-blue-500 group-hover:fill-blue-600"
                      }`}
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Button>
                </div>
              </MenuItem>
            ))}
          </MenuItems>
        </Field>
      )}
    </Menu>
  );
}
