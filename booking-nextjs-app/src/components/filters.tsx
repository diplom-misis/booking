import { Field, Label, Button, Input } from "@headlessui/react";
import Checkbox from "./Checkbox";
import SelectInput from "./SelectInput";

interface LayoversState {
  id: number
  name: string
  state: string
}

interface AirlinesState {
  id: number
  name: string
  state: string
}

interface FiltersProps {
  layovers: LayoversState[]
  airlines: AirlinesState[]
  transfersCheckboxes: { [key: string]: boolean }
  airlineCheckboxes: { [key: string]: boolean }
  priceRange: { from: string, to: string }
  selectedSort: { id: number, name: string }
  onCheckboxChange: (key: string) => (checked: boolean) => void
  onPriceChange: (key: "from" | "to", value: string) => void
  onSortChange: (value: any) => void
  onClearFilters: () => void
}

const typeSort = [
  { id: 1, name: 'дешевые → дорогие' },
  { id: 2, name: 'дорогие → дешевые' },
]

export default function Filters(props: FiltersProps) {
  const {
    layovers,
    airlines,
    transfersCheckboxes,
    airlineCheckboxes,
    priceRange,
    selectedSort,
    onCheckboxChange,
    onPriceChange,
    onSortChange,
    onClearFilters
  } = props;

  return (
    <div className="bg-white rounded-xl shadow-[rgba(0,0,0,0.15)_0px_4px_8px]">
      <form className="flex px-6 pt-8 flex-col gap-4">
        <h2 className="font-bold text-base">Сортировка</h2>
        <SelectInput
          className="h-10 w-[230px] px-[10px] py-[10px]"
          disabled
          data={typeSort}
          value={selectedSort}
          onChange={onSortChange}
          typeCombobox={true}
        />
        <h2 className="font-bold">Цена</h2>
        <div className="flex flex-row gap-2">
          <Field className="flex flex-col gap-[2px]">
            <Label className="text-xs text-gray-400">От</Label>
            <Input
              value={priceRange.from}
              name="full_name"
              type="text"
              className="border border-gray-300 w-28 rounded-[4px] text-base h-10 py-2 px-[14px]"
              placeholder="2 000 ₽"
              onChange={(e) => onPriceChange("from", e.target.value)}
            />
          </Field>
          <Field className="flex flex-col gap-[2px]">
            <Label className="text-xs text-gray-400">До</Label>
            <Input
              value={priceRange.to}
              name="full_name"
              type="text"
              className="border border-gray-300 w-28 rounded-[4px] text-base h-10 py-2 px-[14px]"
              placeholder="140 000 ₽"
              onChange={(e) => onPriceChange("to", e.target.value)}
            />
          </Field>
        </div>
        <h2 className="font-bold">Пересадки</h2>
        <div className="flex flex-col gap-2">
          {layovers.map((layover) => (
            <Checkbox
              key={layover.id}
              title={layover.name}
              checked={transfersCheckboxes[layover.state as keyof typeof transfersCheckboxes]}
              onChange={onCheckboxChange(layover.state)}
            />
          ))}
        </div>
        <h2 className="font-bold">Авиакомпании</h2>
        <div className="flex flex-col gap-2">
          {airlines.map((airline) => (
            <Checkbox
              key={airline.id}
              title={airline.name}
              checked={airlineCheckboxes[airline.state as keyof typeof airlineCheckboxes]}
              onChange={onCheckboxChange(airline.state)}
            />
          ))}
        </div>
      </form>
      <div className="flex justify-center px-6 pb-8 pt-6">
        <Button onClick={onClearFilters} className="w-full border border-gray-300 rounded-lg bg-white py-2 px-4 text-m font-bold text-black">
          Очистить фильтры
        </Button>
      </div>
    </div>
  )
}
