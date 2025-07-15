import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({ className, width = 32, height = 32 }: LogoProps) {
  return (
    <Image
      src="/TimesEntertain/logo.png"
      alt="TimesEntertain Logo"
      width={width}
      height={height}
      className={cn(className)}
    />
  );
}
