import { useState, useEffect } from 'react';
import emitter, { eventName } from 'utils/events';

function useRecivers() {
  const [recivers, setRecivers] = useState<AutoDV.Recivers>({});

  const handleRecivers = (recivers: AutoDV.Recivers) => {
    setRecivers(recivers);
  };

  useEffect(() => {
    emitter.on(eventName.autoDVEventUpdate, handleRecivers);
    return () => {
      emitter.off(eventName.autoDVEventUpdate, handleRecivers);
    };
  }, []);

  return recivers;
}

export default useRecivers;
