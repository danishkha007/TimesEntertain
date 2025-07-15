import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({ className, width = 32, height }: LogoProps) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  
  // If only width is provided, we can't auto-calculate height for a standard img tag without more info.
  // The browser will handle it if height is omitted.
  return (
    <img
      src={`${basePath}/logo.png`}
      alt="TimesEntertain Logo"
      width={width}
      height={height} // Let browser calculate height to maintain aspect ratio if not provided
      className={cn(className)}
    />
  );
}
