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
    } else if (showConfirmation) {
      onVoteConfirm(candidateNumber);
    }
  };

  const handleFinalizar = () => {
    playFinalizarSound();
    // Aqui você pode adicionar lógica para finalizar a votação
    console.log('Finalizando votação...');
    onBack(); // Volta para a tela inicial
  };

  const canConfirm = candidateNumber.length === 2 && selectedCandidate;

  if (showConfirmation) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <UrnaScreen>
          <div className="text-center space-y-6">
            <h1 className="text-2xl font-bold text-yellow-400">CONFIRME SEU VOTO</h1>
            
            <div className="bg-gray-800 p-6 rounded border-2 border-yellow-600">
              <div className="flex items-center space-x-6">
                {selectedCandidate?.photo && (
                  <img 
                    src={selectedCandidate.photo} 
                    alt={selectedCandidate.name}
                    className="w-32 h-40 object-cover border-2 border-yellow-400 rounded"
                  />
                )}
                <div className="text-left">
                  <div className="text-4xl font-bold text-green-400 mb-2">
                    {selectedCandidate?.number}
                  </div>
                  <div className="text-xl font-semibold text-white">
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

            <div className="bg-yellow-900 border border-yellow-600 p-4 rounded animate-vote-confirm">
              <p className="text-yellow-200 font-bold text-lg">
                ATENÇÃO: Confirme seu voto pressionando CONFIRMA
              </p>
              <p className="text-yellow-300 text-sm mt-2">
                Após confirmar, não será possível alterar seu voto
              </p>
            </div>
          </div>
        </UrnaScreen>

        <div className="flex justify-center">
          <UrnaKeypad
            onNumberClick={() => {}} // Disabled during confirmation
            onCorrect={handleCorrect}
            onConfirm={handleConfirm}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <UrnaScreen>
        <div className="text-center space-y-6">
          <div className="border-b border-gray-600 pb-4">
            <h1 className="text-2xl font-bold text-yellow-400">
              ELEIÇÃO CIPA 2024
            </h1>
            <p className="text-sm text-gray-300 mt-2">
              Representante dos Funcionários
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              Digite o número do candidato:
            </h2>
            
            <div className="bg-gray-800 p-4 rounded border-2 border-gray-600">
              <div className="text-6xl font-mono font-bold tracking-wider">
                <span className="text-green-400">
                  {candidateNumber || '__'}
                </span>
                <span className="animate-pulse">|</span>
              </div>
            </div>

            {selectedCandidate ? (
              <div className="bg-gray-800 p-6 rounded border-2 border-green-600">
                <div className="flex items-center space-x-6">
                  {selectedCandidate.photo && (
                    <img 
                      src={selectedCandidate.photo} 
                      alt={selectedCandidate.name}
                      className="w-28 h-36 object-cover border-2 border-green-400 rounded"
                    />
                  )}
                  <div className="text-left">
                    <div className="text-2xl font-bold text-green-400 mb-1">
                      {selectedCandidate.number}
                    </div>
                    <div className="text-lg font-semibold text-white">
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
              <div className="bg-red-900 border border-red-600 p-4 rounded">
                <p className="text-red-300 font-semibold">
                  NÚMERO INVÁLIDO
                </p>
                <p className="text-red-400 text-sm">
                  Candidato não encontrado
                </p>
              </div>
            ) : null}

            <div className="text-sm text-gray-400 mt-4 space-y-1">
              <p>• Digite 2 números para o candidato</p>
              <p>• Use CORRIGE para apagar</p>
              <p>• Use CONFIRMA para votar</p>
            </div>
          </div>
        </div>
      </UrnaScreen>

      <div className="flex flex-col items-center space-y-6">
        <UrnaKeypad
          onNumberClick={handleNumberClick}
          onCorrect={handleCorrect}
          onConfirm={handleConfirm}
          confirmDisabled={!canConfirm}
        />
        
        {/* Botão de Finalizar Votação */}
        <div className="mt-8">
          <UrnaButton variant="finalizar" onClick={handleFinalizar}>
            FINALIZAR VOTAÇÃO
          </UrnaButton>
        </div>
      </div>
    </div>
  );
};