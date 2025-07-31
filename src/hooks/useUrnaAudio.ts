import { useCallback, useRef, useEffect } from 'react';
import fimSound from '../assets/sons/fim.mp3';
import interSound from '../assets/sons/inter.mp3';

export const useUrnaAudio = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioFilesRef = useRef<{ [key: string]: HTMLAudioElement }>({});

  // Função para garantir que o contexto de áudio está ativo
  const ensureAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  }, []);

  // Inicializar contexto de áudio
  useEffect(() => {
    const initAudioContext = () => {
      ensureAudioContext();
      
      // Pré-carregar arquivos de áudio com volume máximo
      if (!audioFilesRef.current.fim) {
        audioFilesRef.current.fim = new Audio(fimSound);
        audioFilesRef.current.fim.preload = 'auto';
        audioFilesRef.current.fim.volume = 1.0; // Volume máximo
      }
      if (!audioFilesRef.current.inter) {
        audioFilesRef.current.inter = new Audio(interSound);
        audioFilesRef.current.inter.preload = 'auto';
        audioFilesRef.current.inter.volume = 1.0; // Volume máximo
      }
    };

    // Inicializar quando o usuário interagir pela primeira vez
    const handleUserInteraction = () => {
      initAudioContext();
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('mousedown', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };

    document.addEventListener('touchstart', handleUserInteraction);
    document.addEventListener('mousedown', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);

    return () => {
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('mousedown', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, [ensureAudioContext]);

  // Função para tocar arquivos de áudio com volume alto
  const playAudioFile = useCallback((audioPath: string, volume: number = 1.0) => {
    try {
      ensureAudioContext();
      
      // Se temos o arquivo pré-carregado, use-o
      const audioKey = audioPath.includes('fim') ? 'fim' : 'inter';
      if (audioFilesRef.current[audioKey]) {
        const audio = audioFilesRef.current[audioKey];
        audio.volume = volume;
        audio.currentTime = 0; // Reset para o início
        
        // Garantir que o áudio seja reproduzido
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.warn('Erro ao reproduzir áudio pré-carregado:', error);
            // Fallback: criar novo áudio
            const fallbackAudio = new Audio(audioPath);
            fallbackAudio.volume = volume;
            fallbackAudio.play().catch(e => console.warn('Erro no fallback:', e));
          });
        }
        return;
      }

      // Fallback para criação dinâmica
      const audio = new Audio(audioPath);
      audio.volume = volume;
      audio.play().catch(error => {
        console.warn('Erro ao reproduzir áudio:', error);
      });
    } catch (error) {
      console.warn('Erro ao tocar áudio:', error);
    }
  }, [ensureAudioContext]);

  // Criar sons usando Web Audio API para simular os sons da urna
  const createBeep = useCallback((frequency: number, duration: number, type: 'sine' | 'square' = 'sine') => {
    try {
      ensureAudioContext();

      const oscillator = audioContextRef.current!.createOscillator();
      const gainNode = audioContextRef.current!.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current!.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0.6, audioContextRef.current!.currentTime); // Volume ainda mais alto
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current!.currentTime + duration);
      
      oscillator.start(audioContextRef.current!.currentTime);
      oscillator.stop(audioContextRef.current!.currentTime + duration);
    } catch (error) {
      console.warn('Erro ao criar beep:', error);
    }
  }, [ensureAudioContext]);

  const playKeySound = useCallback(() => {
    // Som de tecla pressionada (beep curto)
    createBeep(800, 0.1);
  }, [createBeep]);

  const playConfirmSound = useCallback(() => {
    // Som para botão confirmar - inter.mp3 com fallback para beep
    try {
      playAudioFile(interSound, 1.0);
    } catch (error) {
      // Fallback para beep sintético
      createBeep(1000, 0.2, 'sine');
    }
  }, [playAudioFile, createBeep]);

  const playFinalizarSound = useCallback(() => {
    // Som para botão finalizar votação - fim.mp3 com fallback para beep
    try {
      playAudioFile(fimSound, 1.0);
    } catch (error) {
      // Fallback para beep sintético mais grave
      createBeep(600, 0.4, 'square');
    }
  }, [playAudioFile, createBeep]);

  const playErrorSound = useCallback(() => {
    // Som de erro (beep mais grave e longo)
    createBeep(300, 0.3, 'square');
  }, [createBeep]);

  const playSuccessSound = useCallback(() => {
    // Som oficial do TSE para finalização - fim.mp3 com fallback para beep
    try {
      playAudioFile(fimSound, 1.0);
    } catch (error) {
      // Fallback para beep sintético de sucesso
      createBeep(800, 0.3, 'sine');
    }
  }, [playAudioFile, createBeep]);

  const playInterSound = useCallback(() => {
    // Som intermediário - inter.mp3 com fallback para beep
    try {
      playAudioFile(interSound, 1.0);
    } catch (error) {
      // Fallback para beep sintético
      createBeep(900, 0.15, 'sine');
    }
  }, [playAudioFile, createBeep]);

  return {
    playKeySound,
    playConfirmSound,
    playFinalizarSound,
    playErrorSound,
    playSuccessSound,
    playInterSound
  };
};