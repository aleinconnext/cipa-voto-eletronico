import { useCallback } from 'react';

export const useUrnaAudio = () => {
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
    // Som de confirmação (dois beeps)
    createBeep(600, 0.15);
    setTimeout(() => createBeep(800, 0.15), 150);
  }, [createBeep]);

  const playErrorSound = useCallback(() => {
    // Som de erro (beep mais grave e longo)
    createBeep(300, 0.3, 'square');
  }, [createBeep]);

  const playSuccessSound = useCallback(() => {
    // Som de sucesso (sequência ascendente)
    createBeep(523, 0.2); // C
    setTimeout(() => createBeep(659, 0.2), 200); // E
    setTimeout(() => createBeep(784, 0.3), 400); // G
  }, [createBeep]);

  return {
    playKeySound,
    playConfirmSound,
    playErrorSound,
    playSuccessSound
  };
};