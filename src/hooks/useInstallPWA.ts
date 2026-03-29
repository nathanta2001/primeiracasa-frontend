import { useState, useEffect } from 'react';

export function useInstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault(); 
      setDeferredPrompt(e); 
    });
  }, []);

  const instalar = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); 
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
    }
  };

  return { canInstall: !!deferredPrompt, instalar };
}