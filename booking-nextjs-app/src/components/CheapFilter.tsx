interface CheapFilterProps {
  filterTitle: string
  onRemove: () => void
}

export default function CheapFilter({ filterTitle, onRemove }: CheapFilterProps) {
  return (
    <div className="h-7 flex flex-row gap-3 items-center border py-1 px-3 rounded-[20px] border-blue-500 whitespace-nowrap">
      <p className="text-blue-500 text-xs">{filterTitle}</p>
      <button onClick={onRemove}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-blue-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}