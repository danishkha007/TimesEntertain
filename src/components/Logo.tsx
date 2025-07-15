import { cn } from '@/lib/utils';
import { useRouter } from 'next/router';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({ className, width = 32, height = 32 }: LogoProps) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  
  return (
    <img
      src={`${basePath}/logo.png`}
      alt="TimesEntertain Logo"
      width={width}
      height={height}
      className={cn(className)}
    />
  );
}