import { useState, useEffect } from 'react';
import { registerSW } from 'virtual:pwa-register';

export function useUpdatePrompt() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [updateSW, setUpdateSW] = useState<((reloadPage?: boolean) => Promise<void>) | null>(null);

  useEffect(() => {
    const update = registerSW({
      onNeedRefresh() {
        setShowUpdate(true);
      },
    });
    setUpdateSW(() => update);
  }, []);

  const applyUpdate = () => {
    updateSW?.(true);
  };

  const dismissUpdate = () => {
    setShowUpdate(false);
  };

  return { showUpdate, applyUpdate, dismissUpdate };
}
