import { useCallback, useRef, useEffect } from 'react';
import { Howl } from 'howler';

export const useUrnaAudio = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const soundsRef = useRef<{ [key: string]: Howl }>({});

  // Função para garantir que o contexto de áudio está ativo
  const ensureAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  }, []);

  // Inicializar sons com Howler
  useEffect(() => {
    const initSounds = () => {
      ensureAudioContext();
      
      console.log('Inicializando sons com Howler...');
      
      // Inicializar sons MP3 com Howler
      if (!soundsRef.current.fim) {
        soundsRef.current.fim = new Howl({
          src: ['/sounds/fim.mp3'],
          volume: 1.0,
          preload: true,
          html5: false, // Usar Web Audio API
          onload: () => {
            console.log('✅ Som fim.mp3 carregado com sucesso');
          },
          onloaderror: (id, error) => {
            console.warn('❌ Erro ao carregar som fim.mp3:', error);
          },
          onplay: () => {
            console.log('🔊 Reproduzindo fim.mp3');
          }
        });
      }
      
      if (!soundsRef.current.inter) {
        soundsRef.current.inter = new Howl({
          src: ['/sounds/inter.mp3'],
          volume: 1.0,
          preload: true,
          html5: false, // Usar Web Audio API
          onload: () => {
            console.log('✅ Som inter.mp3 carregado com sucesso');
          },
          onloaderror: (id, error) => {
            console.warn('❌ Erro ao carregar som inter.mp3:', error);
          },
          onplay: () => {
            console.log('🔊 Reproduzindo inter.mp3');
          }
        });
      }
    };

    // Inicializar quando o usuário interagir pela primeira vez
    const handleUserInteraction = () => {
      console.log('🎵 Interação do usuário detectada - inicializando áudio');
      initSounds();
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

  // Função para tocar sons MP3 com Howler
  const playMP3Sound = useCallback((soundKey: 'fim' | 'inter') => {
    try {
      ensureAudioContext();
      
      const sound = soundsRef.current[soundKey];
      if (sound) {
        console.log(`🎵 Tentando tocar ${soundKey}, estado:`, sound.state());
        
        if (sound.state() === 'loaded') {
          sound.play();
          return true;
        } else {
          console.warn(`⚠️ Som ${soundKey} não está carregado, estado:`, sound.state());
          return false;
        }
      } else {
        console.warn(`⚠️ Som ${soundKey} não encontrado`);
        return false;
      }
    } catch (error) {
      console.warn(`❌ Erro ao tocar som ${soundKey}:`, error);
      return false;
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
    console.log('🎯 Tentando tocar som CONFIRMA');
    const success = playMP3Sound('inter');
    if (!success) {
      console.warn('🔄 Fallback para beep sintético - CONFIRMA');
      // Fallback para beep sintético
      createBeep(1000, 0.2, 'sine');
    }
  }, [playMP3Sound, createBeep]);

  const playFinalizarSound = useCallback(() => {
    // Som para botão finalizar votação - fim.mp3 com fallback para beep
    console.log('🎯 Tentando tocar som FINALIZAR');
    const success = playMP3Sound('fim');
    if (!success) {
      console.warn('🔄 Fallback para beep sintético - FINALIZAR');
      // Fallback para beep sintético mais grave
      createBeep(600, 0.4, 'square');
    }
  }, [playMP3Sound, createBeep]);

  const playErrorSound = useCallback(() => {
    // Som de erro (beep mais grave e longo)
    createBeep(300, 0.3, 'square');
  }, [createBeep]);

  const playSuccessSound = useCallback(() => {
    // Som oficial do TSE para finalização - fim.mp3 com fallback para beep
    console.log('🎯 Tentando tocar som SUCCESS');
    const success = playMP3Sound('fim');
    if (!success) {
      console.warn('🔄 Fallback para beep sintético - SUCCESS');
      // Fallback para beep sintético de sucesso
      createBeep(800, 0.3, 'sine');
    }
  }, [playMP3Sound, createBeep]);

  const playInterSound = useCallback(() => {
    // Som intermediário - inter.mp3 com fallback para beep
    console.log('🎯 Tentando tocar som INTER');
    const success = playMP3Sound('inter');
    if (!success) {
      console.warn('🔄 Fallback para beep sintético - INTER');
      // Fallback para beep sintético
      createBeep(900, 0.15, 'sine');
    }
  }, [playMP3Sound, createBeep]);

  return {
    playKeySound,
    playConfirmSound,
    playFinalizarSound,
    playErrorSound,
    playSuccessSound,
    playInterSound
  };
};