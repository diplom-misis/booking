type SeparatorProps = {
  extraClass?: string
}


export const Separator = ({extraClass}: SeparatorProps) => (
  <div className={`bg-gray-300 h-px ${extraClass}`}></div>
);
