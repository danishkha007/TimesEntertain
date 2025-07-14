"use client";

import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';

export function ScrollProgressBar() {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.body.offsetHeight;
      
      const totalDocScrollLength = docHeight - windowHeight;
      if (totalDocScrollLength <= 0) {
        setScroll(100);
        return;
      }
      
      const scrollPercentage = (scrollPosition / totalDocScrollLength) * 100;
      setScroll(scrollPercentage);
    };

    window.addEventListener('scroll', handleScroll);

    // Call it once to set initial state
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Progress 
      value={scroll} 
      className="fixed top-0 left-0 right-0 h-1 w-full rounded-none z-[99]"
      style={{ background: 'transparent' }}
    />
  );
}
