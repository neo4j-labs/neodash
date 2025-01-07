import { useEffect, useState } from 'react';

const useUltraWide = (): boolean => {
  const [isUltraWide, setIsUltraWide] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = '(min-aspect-ratio: 21/9)';

    const updateUltraWideStatus = () => {
      const ultraWideQuery = window.matchMedia(mediaQuery);
      setIsUltraWide(ultraWideQuery.matches);
    };

    updateUltraWideStatus();
    window.addEventListener('resize', updateUltraWideStatus);

    return () => {
      window.removeEventListener('resize', updateUltraWideStatus);
    };
  }, []);

  return isUltraWide;
};

export default useUltraWide;
