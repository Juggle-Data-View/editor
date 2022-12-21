import { useState, useEffect } from 'react';

export const useFontLoad = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (document as any).fonts.ready.then(function (event: any) {
      setIsLoaded(true);
    });
  }, []);

  return isLoaded;
};
