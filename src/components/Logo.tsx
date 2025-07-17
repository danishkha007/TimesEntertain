
"use client";

import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({ className, width, height }: LogoProps) {
  // When basePath is removed, assets are served from the root.
  const logoPath = '/logo.png';
  
  return (
    <img
      src={logoPath}
      alt="TimesEntertain Logo"
      width={width}
      height={height} 
      className={cn(className)}
    />
  );
}
