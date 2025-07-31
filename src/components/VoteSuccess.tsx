import { useEffect } from "react";
import { UrnaScreen } from "./UrnaScreen";
import { UrnaKeypad } from "./UrnaKeypad";
import { useUrnaAudio } from "@/hooks/useUrnaAudio";

interface VoteSuccessProps {
  onNewVoter: () => void;
}

export const VoteSuccess = ({ onNewVoter }: VoteSuccessProps) => {
  const { playSuccessSound } = useUrnaAudio();

  useEffect(() => {
    playSuccessSound();
    
    // Automaticamente volta para tela inicial após 5 segundos
    const timer = setTimeout(() => {
      onNewVoter();
    }, 5000);

    return () => clearTimeout(timer);
  }, [playSuccessSound, onNewVoter]);

  // Obter data e hora atual
  const now = new Date();
  const dateStr = now.toLocaleDateString('pt-BR', { 
    weekday: 'short', 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  }).toUpperCase();
  const timeStr = now.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-start max-w-7xl mx-auto">
      <UrnaScreen className="min-h-[400px] md:min-h-[450px] max-h-[500px]">
        <div className="text-center space-y-3 md:space-y-4">
          {/* Top Bar - Data, TREINAMENTO e Bateria */}
          <div className="flex justify-between items-center text-sm text-gray-400 border-b border-gray-600 pb-2">
            <div className="font-mono">
              {dateStr} {timeStr}
            </div>
            <div className="text-yellow-400 font-semibold">
              TREINAMENTO
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-6 h-3 bg-green-500 rounded-sm relative">
                <div className="absolute inset-0.5 bg-green-400 rounded-sm"></div>
              </div>
              <span className="text-xs">⚡</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="relative min-h-[200px] flex items-center justify-center">
            {/* FIM Text */}
            <div className="text-6xl md:text-8xl font-bold text-green-400 tracking-wider">
              FIM
            </div>
            
            {/* VOTOU Watermark */}
            <div className="absolute bottom-4 right-4 text-2xl md:text-3xl font-bold text-gray-600 opacity-30">
              VOTOU
            </div>
          </div>

          {/* Bottom Bar - Informações do município */}
          <div className="border-t border-gray-600 pt-2">
            <div className="text-xs text-gray-400 font-mono text-center">
              Município: 99999 - Minha Cidade Zona: 9999 Seção: 9999
            </div>
          </div>

          {/* Mensagem de retorno */}
          <div className="text-gray-400 text-sm">
            <p>Retornando à tela inicial em alguns segundos...</p>
          </div>
        </div>
      </UrnaScreen>

      {/* Teclado desabilitado */}
      <div className="flex justify-center">
        <UrnaKeypad
          onNumberClick={() => {}} // Desabilitado
          onCorrect={() => {}} // Desabilitado
          onConfirm={() => {}} // Desabilitado
          confirmDisabled={true} // Sempre desabilitado
          hideConfirmButton={true} // Esconde o botão CONFIRMA
          hideActionButtons={true} // Esconde todos os botões de ação
        />
      </div>
    </div>
  );
};