import { useState, useEffect, type JSX } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Detecta se está rodando como PWA instalado
const isStandalone = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
};

// Detecta iOS
const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as Window & { MSStream?: unknown }).MSStream;
};

const InstallPrompt = (): JSX.Element | null => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState<boolean>(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState<boolean>(false);
  const [visible, setVisible] = useState(true); // vê se o usuário fechou o aviso

  useEffect(() => {
    // Se já está rodando como app instalado, não mostra nada
    if (isStandalone()) {
      return;
    }

    // Se for iOS, mostra instruções manuais
    if (isIOS()) {
      // Verifica se o usuário já dispensou o prompt antes
      const dismissed = localStorage.getItem('ios-install-dismissed');
      if (!dismissed) {
        setShowIOSPrompt(true);
      }
      return;
    }

    // Para outros navegadores (Chrome, Edge, etc.)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstall(true);
      console.log('Instalação do PWA está disponivel!');
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Install button click handler
  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    // Trigger the saved install prompt
    deferredPrompt.prompt();

    // Wait for the user's choice
    const { outcome } = await deferredPrompt.userChoice;

    console.log(`User choice: ${outcome}`);
    // outcome is either 'accepted' or 'dismissed'

    if (outcome === 'accepted') {
      console.log('Instalação do PWA concluída!');
    } else {
      console.log('Instalação do PWA cancelada');
    }

    // The prompt can only be used once, so reset it
    setDeferredPrompt(null);
    setShowInstall(false);
  };

  // controla se o usuário fechou manualmente ou não há o que mostrar
  if (!visible || (!showInstall && !showIOSPrompt)) {
    return null;
  }

  // Don't render anything if we shouldn't show the install button
  if (!showInstall && !showIOSPrompt) {
    return null;
  }

  // Instruções para iOS
  if (showIOSPrompt) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        right: '20px',
        zIndex: 1000,
        backgroundColor: '#fff',
        padding: '16px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span style={{ fontSize: '24px' }}>📱</span>
        <div style={{ flex: 1 }}>
          <strong>Instale o App</strong>
          <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#666' }}>
            Toque em <span style={{ fontSize: '16px' }}>⎙</span> e depois em "Adicionar à Tela de Início"
          </p>
        </div>
        <button
          onClick={() => {
            localStorage.setItem('ios-install-dismissed', 'true');
            setShowIOSPrompt(false);
          }}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          ✕
        </button>
      </div>
    );
  }

  if (showInstall) {
    return (
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, display: 'flex', gap: '8px' }}>
        <button
          onClick={handleInstall}
          style={{
            backgroundColor: '#4CAF50', color: 'white', padding: '12px 24px',
            border: 'none', borderRadius: '25px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
        >
          📱 Instalar App
        </button>
        <button 
          onClick={() => setVisible(false)}
          style={{ backgroundColor: '#ccc', border: 'none', borderRadius: '50%', width: '30px', cursor: 'pointer' }}
        >
          ✕
        </button>
      </div>
    );
  }

  return null;
};
export default InstallPrompt;