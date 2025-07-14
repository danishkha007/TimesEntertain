import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={cn('size-8 text-primary', className)}
      viewBox="0 0 100 100"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="50" fill="currentColor" />
      <text
        x="50"
        y="50"
        fontFamily="Arial, sans-serif"
        fontSize="50"
        textAnchor="middle"
        dy=".1em"
        fill="hsl(var(--primary-foreground))"
      >
        <tspan x="50" dy="-0.2em">
          T
        </tspan>
        <tspan x="50" dy="1em">
          E
        </tspan>
      </text>
    </svg>
  );
}
