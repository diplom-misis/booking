import { cn } from '@/utils/cn';

type Props = {
  className?: string;
};

export const Arrow = ({ className }: Props) => (
  <svg
    width='32'
    height='18'
    viewBox='0 0 32 18'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className={cn(className)}
  >
    <path
      d='M7.83333 16L2 9M2 9L7.83333 2M2 9L30 9'
      stroke='#1F2937'
      strokeWidth='3'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);
