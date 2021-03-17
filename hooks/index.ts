import { useEffect, useState, useRef } from 'react';

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

export const useWindowSize = (): {
  windowWidth: number;
  isMobile: boolean;
} => {
  const isSSR = typeof window === 'undefined';
  const [windowWidth, setWindowWidth] = useState(
    isSSR ? 1200 : window.innerWidth
  );
  const [isMobile, setIsMobile] = useState(
    isSSR ? false : window.innerWidth < 600
  );

  function changeWindowSize() {
    setWindowWidth(window.innerWidth);
    if (window.innerWidth < 600) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }

  useEffect(() => {
    window.addEventListener('resize', changeWindowSize);

    return () => {
      window.removeEventListener('resize', changeWindowSize);
    };
  }, []);

  return { windowWidth, isMobile };
};
