
"use client";

import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({ className, width, height }: LogoProps) {
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
