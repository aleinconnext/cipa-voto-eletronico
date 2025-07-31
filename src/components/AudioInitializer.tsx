import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioInitializerProps {
  children: React.ReactNode;
}

export const AudioInitializer = ({ children }: AudioInitializerProps) => {
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Verificar se o áudio já foi inicializado
    const checkAudioContext = () => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        if (audioContext.state === 'running') {
          setAudioInitialized(true);
          setShowPrompt(false);
        } else {
          setShowPrompt(true);
        }
      } catch (error) {
        setShowPrompt(true);
      }
    };

    // Aguardar um pouco para verificar o estado do áudio
    const timer = setTimeout(checkAudioContext, 1000);
    return () => clearTimeout(timer);
  }, []);

  const initializeAudio = async () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      // Criar um beep de teste
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);

      setAudioInitialized(true);
      setShowPrompt(false);
    } catch (error) {
      console.warn('Erro ao inicializar áudio:', error);
    }
  };

  if (showPrompt && !audioInitialized) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md mx-4 text-center">
          <div className="flex justify-center mb-4">
            <VolumeX className="w-12 h-12 text-jurunense-secondary" />
          </div>
          <h3 className="text-lg font-semibold text-jurunense-primary mb-2">
            Ativar Sons da Urna
          </h3>
          <p className="text-gray-600 mb-4">
            Para uma melhor experiência, ative os sons da urna eletrônica.
            Clique no botão abaixo para inicializar o áudio.
          </p>
          <Button 
            onClick={initializeAudio}
            className="bg-jurunense-primary hover:bg-jurunense-primary/90 w-full"
          >
            <Volume2 className="w-4 h-4 mr-2" />
            Ativar Sons
          </Button>
          <button 
            onClick={() => setShowPrompt(false)}
            className="text-jurunense-secondary hover:underline text-sm mt-2"
          >
            Pular (sem som)
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}; 