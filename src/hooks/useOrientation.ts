import { useEffect, useState } from 'react';

export const useOrientation = () => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    // Detectar se é tablet
    const detectTablet = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isTabletDevice = /ipad|android(?!.*mobile)/i.test(userAgent) || 
                            (window.innerWidth >= 768 && window.innerWidth <= 1024);
      return isMobile && isTabletDevice;
    };

    setIsTablet(detectTablet());

    // Detectar orientação
    const updateOrientation = () => {
      const newOrientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
      setOrientation(newOrientation);
    };

    // Verificar orientação inicial
    updateOrientation();

    // Event listeners
    window.addEventListener('resize', updateOrientation);
    window.addEventListener('orientationchange', updateOrientation);

    return () => {
      window.removeEventListener('resize', updateOrientation);
      window.removeEventListener('orientationchange', updateOrientation);
    };
  }, []);

  // Forçar orientação landscape
  const forceLandscape = async () => {
    if (isTablet && orientation === 'portrait') {
      try {
        // Tentar forçar landscape via Screen Orientation API
        const screenOrientation = (screen as any).orientation;
        if (screenOrientation && screenOrientation.lock) {
          await screenOrientation.lock('landscape');
        }
      } catch (error) {
        console.warn('Não foi possível forçar orientação landscape:', error);
      }
    }
  };

  return {
    orientation,
    isTablet,
    forceLandscape,
    isPortrait: orientation === 'portrait',
    isLandscape: orientation === 'landscape'
  };
}; 