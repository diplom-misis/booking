import { Field, Label, Button, Input } from "@headlessui/react";
import { useState } from "react";
import Checkbox from "./Checkbox";
import SelectInput from "./SelectInput";

const typeSort = [
  { id: 1, name: 'дешевые → дорогие' },
  { id: 2, name: 'дорогие → дешевые' },
]

const transfers = [
  { id: "noTransfers", label: "Без пересадок" },
  { id: "oneTransfer", label: "1 пересадка" },
  { id: "twoTransfers", label: "2 пересадки" },
  { id: "threeTransfers", label: "3 пересадки" },
];

const airlines = [
  { id: "aeroflot", label: "Аэрофлот" },
  { id: "s7", label: "S7 Airlines" },
  { id: "utair", label: "Utair" },
  { id: "pobeda", label: "Победа" },
];

export default function Filters() {
  const [selectedSort, setSelectedSort] = useState(typeSort[0])
  const [transfersCheckboxes, setTransfersCheckboxes] = useState({
    noTransfers: false,
    oneTransfer: false,
    twoTransfers: false,
    threeTransfers: false,
  });

  const [airlineCheckboxes, setAirlineCheckboxes] = useState({
    aeroflot: false,
    s7: false,
    utair: false,
    pobeda: false,
  });

  const handleSortChange = (value: any) => {
    setSelectedSort(value);
  };

  const handleCheckboxChange = (key: string, setState: React.Dispatch<React.SetStateAction<any>>) => 
    (checked: boolean) => {
      setState((prev) => ({ ...prev, [key]: checked }));
    };

  return (
    <div className="bg-white rounded-xl shadow-[rgba(0,0,0,0.15)_0px_4px_8px]">
      <form className="flex px-6 pt-8 flex-col gap-4">
        <h2 className="font-bold text-base">Сортировка</h2>
        <SelectInput className="h-10 w-[230px]" disabled data={typeSort} value={selectedSort} onChange={handleSortChange} paddingX="[10px]" paddingY="[10px]" typeCombobox={true} />
        <h2 className="font-bold">Цена</h2>
        <div className="flex flex-row gap-2">
          <Field className="flex flex-col gap-[2px]">
            <Label className="text-xs text-gray-400">От</Label>
            <Input name="full_name" type="text" className="border border-gray-300 w-28 rounded-[4px] text-base h-10 py-2 px-[14px]" placeholder="2 000 ₽" />
          </Field>
          <Field className="flex flex-col gap-[2px]">
            <Label className="text-xs text-gray-400">До</Label>
            <Input name="full_name" type="text" className="border border-gray-300 w-28 rounded-[4px] text-base h-10 py-2 px-[14px]" placeholder="140 000 ₽" />
          </Field>
        </div>
        <h2 className="font-bold">Пересадки</h2>
        <div className="flex flex-col gap-2">
          {transfers.map((transfer) => (
            <Checkbox
              key={transfer.id}
              title={transfer.label}
              checked={transfersCheckboxes[transfer.id as keyof typeof transfersCheckboxes]}
              onChange={handleCheckboxChange(transfer.id, setTransfersCheckboxes)}
            />
          ))}
        </div>
        <h2 className="font-bold">Авиакомпании</h2>
        <div className="flex flex-col gap-2">
          {airlines.map((airline) => (
            <Checkbox
              key={airline.id}
              title={airline.label}
              checked={airlineCheckboxes[airline.id as keyof typeof airlineCheckboxes]}
              onChange={handleCheckboxChange(airline.id, setAirlineCheckboxes)}
            />
          ))}
        </div>
      </form>
      <div className="flex justify-center px-6 pb-8 pt-6">
        <Button className="w-full border border-gray-300 rounded-lg bg-white py-2 px-4 text-m font-bold text-black">
          Очистить фильтры
        </Button>
      </div>
    </div>
  )
}