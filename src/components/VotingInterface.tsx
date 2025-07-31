import { useState } from "react";
import { UrnaScreen } from "./UrnaScreen";
import { UrnaKeypad } from "./UrnaKeypad";
import { useUrnaAudio } from "@/hooks/useUrnaAudio";
import { Candidate } from "@/types/voting";

interface VotingInterfaceProps {
  onVoteConfirm: (candidateNumber: string) => void;
  onBack: () => void;
}

// Mock data - em produção viria do Supabase
const mockCandidates: Candidate[] = [
  {
    id: '1',
    number: '10',
    name: 'MARIA SILVA SANTOS',
    position: 'Representante dos Funcionários',
    department: 'Produção',
    photo: 'https://images.unsplash.com/photo-1494790108755-2616b332c859?w=300'
  },
  {
    id: '2',
    number: '20',
    name: 'JOÃO CARLOS OLIVEIRA',
    position: 'Representante dos Funcionários',
    department: 'Administração',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300'
  },
  {
    id: '3',
    number: '30',
    name: 'ANA PAULA FERREIRA',
    position: 'Representante dos Funcionários',
    department: 'Qualidade',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300'
  }
];

export const VotingInterface = ({ onVoteConfirm, onBack }: VotingInterfaceProps) => {
  const [candidateNumber, setCandidateNumber] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { playErrorSound, playConfirmSound } = useUrnaAudio();

  const handleNumberClick = (number: string) => {
    if (candidateNumber.length < 2) {
      const newNumber = candidateNumber + number;
      setCandidateNumber(newNumber);
      
      // Se completou 2 dígitos, procura o candidato
      if (newNumber.length === 2) {
        const candidate = mockCandidates.find(c => c.number === newNumber);
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
    setCandidateNumber('');
    setSelectedCandidate(null);
    setShowConfirmation(false);
  };

  const handleConfirm = () => {
    if (selectedCandidate && !showConfirmation) {
      setShowConfirmation(true);
      playConfirmSound();
    } else if (showConfirmation) {
      onVoteConfirm(candidateNumber);
    }
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
                    className="w-24 h-24 rounded-full object-cover border-2 border-yellow-400"
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
                      className="w-20 h-20 rounded-full object-cover border-2 border-green-400"
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