import { useCallback } from 'react';

export const useUrnaAudio = () => {
  // Função para tocar arquivos de áudio
  const playAudioFile = useCallback((audioPath: string, volume: number = 0.7) => {
    const audio = new Audio(audioPath);
    audio.volume = volume;
    audio.play().catch(error => {
      console.warn('Erro ao reproduzir áudio:', error);
    });
  }, []);

  // Criar sons usando Web Audio API para simular os sons da urna
  const createBeep = useCallback((frequency: number, duration: number, type: 'sine' | 'square' = 'sine') => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  }, []);

  const playKeySound = useCallback(() => {
    // Som de tecla pressionada (beep curto)
    createBeep(800, 0.1);
  }, [createBeep]);

  const playConfirmSound = useCallback(() => {
    // Som oficial do TSE para confirmação
    playAudioFile('/sounds/confirma.mp3');
  }, [playAudioFile]);

  const playErrorSound = useCallback(() => {
    // Som de erro (beep mais grave e longo)
    createBeep(300, 0.3, 'square');
  }, [createBeep]);

  const playSuccessSound = useCallback(() => {
    // Som oficial do TSE para finalização
    playAudioFile('/sounds/fim.mp3');
  }, [playAudioFile]);

  return {
    playKeySound,
    playConfirmSound,
    playErrorSound,
    playSuccessSound
  };
};