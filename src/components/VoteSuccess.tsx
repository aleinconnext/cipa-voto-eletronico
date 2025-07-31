import { useEffect } from "react";
import { UrnaScreen } from "./UrnaScreen";
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

  return (
    <div className="flex justify-center">
      <UrnaScreen className="max-w-2xl mx-auto">
        <div className="text-center space-y-6 md:space-y-8">
          <div className="animate-vote-confirm">
            <div className="text-4xl md:text-6xl mb-4">✅</div>
            <h1 className="text-2xl md:text-3xl font-bold text-green-400 mb-2">
              VOTO REGISTRADO
            </h1>
            <h2 className="text-lg md:text-xl text-green-300">
              COM SUCESSO!
            </h2>
          </div>

          <div className="bg-green-900 border border-green-600 p-4 md:p-6 rounded">
            <p className="text-green-200 text-base md:text-lg font-semibold mb-2">
              Obrigado por participar da eleição da CIPA!
            </p>
            <p className="text-green-300 text-sm md:text-base">
              Seu voto foi registrado e será contabilizado na apuração final.
            </p>
          </div>

          <div className="bg-gray-800 border border-gray-600 p-3 md:p-4 rounded">
            <p className="text-yellow-400 font-semibold">
              IMPORTANTE:
            </p>
            <p className="text-gray-300 text-sm mt-2">
              • Guarde seu comprovante de votação
            </p>
            <p className="text-gray-300 text-sm">
              • A apuração será realizada ao final do período eleitoral
            </p>
            <p className="text-gray-300 text-sm">
              • Os resultados serão divulgados conforme cronograma
            </p>
          </div>

          <div className="text-gray-400 text-sm">
            <p>Retornando à tela inicial em alguns segundos...</p>
          </div>
        </div>
      </UrnaScreen>
    </div>
  );
};