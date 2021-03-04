import { useEffect } from 'react';

export const useScrollLock = (isActive: boolean): void => {
  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'scroll';
    }
  }, [isActive]);
};
