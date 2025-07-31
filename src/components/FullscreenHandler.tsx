import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Maximize2, X, RotateCcw } from 'lucide-react';
import { useOrientation } from '@/hooks/useOrientation';

interface FullscreenHandlerProps {
  children: React.ReactNode;
}

export const FullscreenHandler = ({ children }: FullscreenHandlerProps) => {
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { orientation, isTablet, forceLandscape, isPortrait } = useOrientation();

  // Verificar se está em tela cheia
  const checkFullscreen = () => {
    const fullscreenElement = document.fullscreenElement || 
                            (document as any).webkitFullscreenElement || 
                            (document as any).mozFullScreenElement || 
                            (document as any).msFullscreenElement;
    setIsFullscreen(!!fullscreenElement);
  };

  // Entrar em tela cheia
  const enterFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else if ((document.documentElement as any).webkitRequestFullscreen) {
        await (document.documentElement as any).webkitRequestFullscreen();
      } else if ((document.documentElement as any).mozRequestFullScreen) {
        await (document.documentElement as any).mozRequestFullScreen();
      } else if ((document.documentElement as any).msRequestFullscreen) {
        await (document.documentElement as any).msRequestFullscreen();
      }
      setShowFullscreenPrompt(false);
    } catch (error) {
      console.warn('Erro ao entrar em tela cheia:', error);
    }
  };

  // Sair da tela cheia
  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        await (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen();
      }
    } catch (error) {
      console.warn('Erro ao sair da tela cheia:', error);
    }
  };

  useEffect(() => {
    // Verificar se é tablet e mostrar prompt
    if (isTablet) {
      const timer = setTimeout(() => {
        setShowFullscreenPrompt(true);
      }, 1000); // Aguardar 1 segundo após carregar

      return () => clearTimeout(timer);
    }
  }, [isTablet]);

  useEffect(() => {
    // Event listeners para mudanças de tela cheia
    const handleFullscreenChange = () => {
      checkFullscreen();
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    // Verificar estado inicial
    checkFullscreen();

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Botão flutuante para alternar tela cheia
  const FloatingFullscreenButton = () => (
    <div className="fixed top-4 right-4 z-50 flex space-x-2">
      {/* Botão de orientação landscape */}
      {isTablet && isPortrait && (
        <button
          onClick={forceLandscape}
          className="bg-jurunense-secondary text-white p-2 rounded-full shadow-lg hover:bg-jurunense-secondary/90 transition-colors"
          title="Girar para landscape"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      )}
      
      {/* Botão de tela cheia */}
      <button
        onClick={isFullscreen ? exitFullscreen : enterFullscreen}
        className="bg-jurunense-primary text-white p-2 rounded-full shadow-lg hover:bg-jurunense-primary/90 transition-colors"
        title={isFullscreen ? "Sair da tela cheia" : "Entrar em tela cheia"}
      >
        {isFullscreen ? <X className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
      </button>
    </div>
  );

  return (
    <>
      {children}
      
      {/* Prompt de tela cheia para tablets */}
      {showFullscreenPrompt && !isFullscreen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 text-center">
            <div className="flex justify-center mb-4">
              <Maximize2 className="w-12 h-12 text-jurunense-primary" />
            </div>
            <h3 className="text-lg font-semibold text-jurunense-primary mb-2">
              Tela Cheia Recomendada
            </h3>
            <p className="text-gray-600 mb-4">
              Para uma melhor experiência de votação, recomendamos usar a tela cheia.
              Isso garante que a urna eletrônica funcione perfeitamente.
            </p>
            
            {/* Aviso de orientação */}
            {isPortrait && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <div className="flex items-center">
                  <RotateCcw className="w-5 h-5 text-yellow-600 mr-2" />
                  <span className="text-yellow-800 text-sm">
                    Recomendamos girar o tablet para landscape
                  </span>
                </div>
              </div>
            )}
            
            <div className="flex space-x-3">
              <Button 
                onClick={enterFullscreen}
                className="bg-jurunense-primary hover:bg-jurunense-primary/90 flex-1"
              >
                <Maximize2 className="w-4 h-4 mr-2" />
                Tela Cheia
              </Button>
              <Button 
                onClick={() => setShowFullscreenPrompt(false)}
                variant="outline"
                className="flex-1"
              >
                Continuar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Botão flutuante para tablets */}
      {isTablet && <FloatingFullscreenButton />}
    </>
  );
}; 