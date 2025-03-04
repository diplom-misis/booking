import { Field, Checkbox as HeadlessCheckbox, Label } from "@headlessui/react";

interface CheckboxProps {
  title: string
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function Checkbox(props: CheckboxProps) {
  const { title, checked, onChange } = props
  return (
    <Field className="flex items-center gap-2">
      <HeadlessCheckbox
        checked={checked}
        onChange={onChange}
        className="group flex items-center justify-center size-4 rounded-sm border border-blue-500 bg-white"
      >
        {checked && (
          <div className="absolute  size-[10px] bg-blue-500 rounded-sm"></div>
        )}
      </HeadlessCheckbox>
      <Label className="text-sm text-gray-800">{title}</Label>
    </Field>
  )
}