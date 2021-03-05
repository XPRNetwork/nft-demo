import { useEffect, useRef } from 'react';

export const useScrollLock = (isActive: boolean): void => {
  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'scroll';
    }
  }, [isActive]);
};

export const usePrevious = (value: string): string => {
  const ref = useRef<string>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current as string;
};
