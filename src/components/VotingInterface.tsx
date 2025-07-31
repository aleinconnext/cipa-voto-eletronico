import { useState } from "react";
import { UrnaScreen } from "./UrnaScreen";
import { UrnaKeypad } from "./UrnaKeypad";
import { UrnaButton } from "./UrnaButton";
import { useUrnaAudio } from "@/hooks/useUrnaAudio";
import { Candidate } from "@/types/voting";
import { mockCandidates, findCandidateByNumber } from "@/data/mockData";

interface VotingInterfaceProps {
  onVoteConfirm: (candidateNumber: string) => void;
  onBack: () => void;
}

export const VotingInterface = ({ onVoteConfirm, onBack }: VotingInterfaceProps) => {
  const [candidateNumber, setCandidateNumber] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { playErrorSound, playConfirmSound, playFinalizarSound } = useUrnaAudio();

  const handleNumberClick = (number: string) => {
    if (candidateNumber.length < 2) {
      const newNumber = candidateNumber + number;
      setCandidateNumber(newNumber);
      
      // Se completou 2 dígitos, procura o candidato
      if (newNumber.length === 2) {
        const candidate = findCandidateByNumber(newNumber);
        if (candidate) {
          setSelectedCandidate(candidate);
          playConfirmSound();
        } else {
          playErrorSound();
        }
      }
    }
  };

  const handleCorrect = () => {
    // Se estiver na tela de confirmação, volta para a tela de votação
    if (showConfirmation) {
      setShowConfirmation(false);
    } else {
      // Se estiver na tela de votação, limpa o campo para nova pesquisa
      setCandidateNumber('');
      setSelectedCandidate(null);
    }
  };

  const handleConfirm = () => {
    if (selectedCandidate && !showConfirmation) {
      setShowConfirmation(true);
      playConfirmSound();
    }
  };

  const handleFinalizar = () => {
    playFinalizarSound();
    // Registra o voto e vai para a tela de sucesso
    onVoteConfirm(candidateNumber);
  };

  const canConfirm = candidateNumber.length === 2 && selectedCandidate;

  if (showConfirmation) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-start max-w-7xl mx-auto">
        <UrnaScreen className="min-h-[400px] md:min-h-[450px] max-h-[500px]">
          <div className="text-center space-y-3 md:space-y-4">
            <h1 className="text-lg md:text-xl font-bold text-yellow-400">CONFIRME SEU VOTO</h1>
            
            <div className="bg-gray-800 p-3 md:p-4 rounded border-2 border-yellow-600">
              <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-4">
                {selectedCandidate?.photo && (
                  <img 
                    src={selectedCandidate.photo} 
                    alt={selectedCandidate.name}
                    className="w-20 h-28 md:w-24 md:h-32 object-cover border-2 border-yellow-400 rounded"
                  />
                )}
                <div className="text-center md:text-left">
                  <div className="text-2xl md:text-3xl font-bold text-green-400 mb-1">
                    {selectedCandidate?.number}
                  </div>
                  <div className="text-base md:text-lg font-semibold text-white">
                    {selectedCandidate?.name}
                  </div>
                  <div className="text-sm text-gray-300">
                    {selectedCandidate?.position}
                  </div>
                  <div className="text-sm text-gray-400">
                    {selectedCandidate?.department}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-900 border border-yellow-600 p-2 md:p-3 rounded animate-vote-confirm">
              <p className="text-yellow-200 font-bold text-sm md:text-base">
                ATENÇÃO: Confirme seu voto pressionando FINALIZAR VOTAÇÃO
              </p>
              <p className="text-yellow-300 text-xs md:text-sm mt-1">
                Após confirmar, não será possível alterar seu voto
              </p>
            </div>
          </div>
        </UrnaScreen>

        <div className="flex flex-col items-center space-y-3 md:space-y-4">
          <UrnaKeypad
            onNumberClick={() => {}} // Disabled during confirmation
            onCorrect={handleCorrect}
            onConfirm={() => {}} // Desabilitado na confirmação
            confirmDisabled={true} // Sempre desabilitado
            hideConfirmButton={true} // Esconde o botão CONFIRMA
            hideActionButtons={true} // Esconde todos os botões de ação do keypad
          />
          
          {/* Botões lado a lado - apenas na tela de confirmação */}
          <div className="flex justify-center space-x-3 md:space-x-4 mt-2 md:mt-4">
            <UrnaButton variant="white" onClick={handleCorrect}>
              CORRIGE
            </UrnaButton>
            <UrnaButton variant="finalizar" onClick={handleFinalizar}>
              FINALIZAR VOTAÇÃO
            </UrnaButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-start max-w-7xl mx-auto">
      <UrnaScreen className="min-h-[400px] md:min-h-[450px] max-h-[500px]">
        <div className="text-center space-y-3 md:space-y-4">
          <div className="border-b border-gray-600 pb-3">
            <h1 className="text-lg md:text-xl font-bold text-yellow-400">
              ELEIÇÃO CIPA 2024
            </h1>
            <p className="text-sm text-gray-300 mt-1">
              Representante dos Funcionários
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base md:text-lg font-semibold">
              Digite o número do candidato:
            </h2>
            
            <div className="bg-gray-800 p-3 rounded border-2 border-gray-600">
              <div className="text-3xl md:text-4xl font-mono font-bold tracking-wider">
                <span className="text-green-400">
                  {candidateNumber || '__'}
                </span>
                <span className="animate-pulse">|</span>
              </div>
            </div>

            {selectedCandidate ? (
              <div className="bg-gray-800 p-3 md:p-4 rounded border-2 border-green-600">
                <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-4">
                  {selectedCandidate.photo && (
                    <img 
                      src={selectedCandidate.photo} 
                      alt={selectedCandidate.name}
                      className="w-16 h-24 md:w-20 md:h-28 object-cover border-2 border-green-400 rounded"
                    />
                  )}
                  <div className="text-center md:text-left">
                    <div className="text-lg md:text-xl font-bold text-green-400 mb-1">
                      {selectedCandidate.number}
                    </div>
                    <div className="text-sm md:text-base font-semibold text-white">
                      {selectedCandidate.name}
                    </div>
                    <div className="text-sm text-gray-300">
                      {selectedCandidate.position}
                    </div>
                    <div className="text-sm text-gray-400">
                      {selectedCandidate.department}
                    </div>
                  </div>
                </div>
              </div>
            ) : candidateNumber.length === 2 ? (
              <div className="bg-red-900 border border-red-600 p-2 md:p-3 rounded">
                <p className="text-red-300 font-semibold text-sm">
                  NÚMERO INVÁLIDO
                </p>
                <p className="text-red-400 text-xs md:text-sm">
                  Candidato não encontrado
                </p>
              </div>
            ) : null}

            <div className="text-xs md:text-sm text-gray-400 mt-3 space-y-1">
              <p>• Digite 2 números para o candidato</p>
              <p>• Use CORRIGE para apagar</p>
              <p>• Use CONFIRMA para votar</p>
            </div>
          </div>
        </div>
      </UrnaScreen>

      <div className="flex justify-center">
        <UrnaKeypad
          onNumberClick={handleNumberClick}
          onCorrect={handleCorrect}
          onConfirm={handleConfirm}
          confirmDisabled={!canConfirm}
        />
      </div>
    </div>
  );
};