import { useCallback, useEffect, useRef, useState } from "react";
import { UrnaScreen } from "./UrnaScreen";
import { UrnaKeypad } from "./UrnaKeypad";
import { UrnaButton } from "./UrnaButton";
import { LoadingSpinner } from "./LoadingSpinner";
import { useUrnaAudio } from "@/hooks/useUrnaAudio";
import { Candidate } from "@/types/voting";
import { votingService } from "@/services/votingService";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface VotingInterfaceProps {
  onVoteConfirm: (candidateNumber: string) => void;
  onBack: () => void;
  voterCPF?: string;
}

export const VotingInterface = ({ onVoteConfirm, onBack, voterCPF }: VotingInterfaceProps) => {
  const DEFAULT_MAX_DIGITS = 10;
  const DEFAULT_MIN_DIGITS = 1;

  const [candidateNumber, setCandidateNumber] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingCandidate, setIsFetchingCandidate] = useState(false);
  const [candidateError, setCandidateError] = useState(false);
  const [maxDigits, setMaxDigits] = useState(DEFAULT_MAX_DIGITS);
  const [minDigitsForLookup, setMinDigitsForLookup] = useState(DEFAULT_MIN_DIGITS);
  const [candidatesList, setCandidatesList] = useState<Candidate[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const lastRequestIdRef = useRef(0);
  const lastSearchRef = useRef('');
  const isComponentMounted = useRef(true);
  const { playErrorSound, playConfirmSound, playFinalizarSound } = useUrnaAudio();

  useEffect(() => {
    isComponentMounted.current = true;

    const configurarCandidatos = async () => {
      try {
        const candidatos = await votingService.obterCandidatos();

        if (!isComponentMounted.current) {
          return;
        }

        const maiorQuantidadeDigitos = candidatos.reduce((max, candidato) => {
          const codigo = candidato.codigo?.trim() ?? '';
          return Math.max(max, codigo.length);
        }, 0);

        const menorQuantidadeDigitos = candidatos.reduce((min, candidato) => {
          const codigo = candidato.codigo?.trim() ?? '';
          if (!codigo) return min;
          return Math.min(min, codigo.length);
        }, Infinity);

        setMaxDigits(maiorQuantidadeDigitos || DEFAULT_MAX_DIGITS);
        setMinDigitsForLookup(Number.isFinite(menorQuantidadeDigitos) ? Math.max(DEFAULT_MIN_DIGITS, menorQuantidadeDigitos) : DEFAULT_MIN_DIGITS);

        // Mapear candidatos para o formato da interface
        const candidatosMapeados = candidatos.map(candidato => ({
          id: candidato.codigo,
          number: candidato.codigo,
          name: candidato.nome,
          position: 'Representante CIPA',
          department: candidato.departamento,
          photo: candidato.foto || `/fotos/${candidato.codigo}.jpg`
        }));

        setCandidatesList(candidatosMapeados);
      } catch (error) {
        console.error('💥 [VOTING INTERFACE] Erro ao carregar candidatos para configuração:', error);
        setMaxDigits(DEFAULT_MAX_DIGITS);
      }
    };

    configurarCandidatos();

    return () => {
      isComponentMounted.current = false;
    };
  }, []);

  const findCandidateByNumber = useCallback(async (number: string): Promise<Candidate | null> => {
    const currentRequestId = ++lastRequestIdRef.current;
    setCandidateError(false);
    setIsFetchingCandidate(true);

    try {
      const candidato = await votingService.buscarCandidato(number);
      if (!candidato) return null;

      return {
        id: candidato.codigo,
        number: candidato.codigo,
        name: candidato.nome,
        position: 'Representante CIPA',
        department: candidato.departamento,
        photo: candidato.foto || `/fotos/${candidato.codigo}.jpg`
      };
    } finally {
      if (lastRequestIdRef.current === currentRequestId) {
        setIsFetchingCandidate(false);
      }
    }
  }, []);

  const handleNumberClick = (number: string) => {
    if (candidateNumber.length >= maxDigits) {
      return;
    }

    const newNumber = candidateNumber + number;
    setCandidateNumber(newNumber);
    setCandidateError(false);

    if (newNumber.length >= minDigitsForLookup) {
      lastSearchRef.current = newNumber;
      setSelectedCandidate(null);

      findCandidateByNumber(newNumber)
        .then(candidate => {
          if (lastSearchRef.current !== newNumber) {
            return;
          }

          if (candidate) {
            setSelectedCandidate(candidate);
            playConfirmSound();
          } else {
            setSelectedCandidate(null);
            setCandidateError(true);
            if (newNumber.length === maxDigits) {
              playErrorSound();
            }
          }
        })
        .catch(error => {
          console.error('💥 [VOTING INTERFACE] Erro ao buscar candidato:', error);
          if (lastSearchRef.current === newNumber) {
            setSelectedCandidate(null);
            setCandidateError(true);
            playErrorSound();
          }
        });
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
      setCandidateError(false);
      lastSearchRef.current = '';
    }
  };

  const handleConfirm = () => {
    if (selectedCandidate && !showConfirmation) {
      setShowConfirmation(true);
      playConfirmSound();
    }
  };

  const handleFinalizar = async () => {
    setIsLoading(true);
    
    try {
      playFinalizarSound();
      
      // Usa o CPF do eleitor validado
      const cpf = voterCPF || '51674645287'; // Fallback para teste
      console.log('🗳️ [VOTING INTERFACE] Iniciando registro de voto...');
      console.log('📝 [VOTING INTERFACE] CPF:', cpf);
      console.log('🎯 [VOTING INTERFACE] Candidato:', candidateNumber);
      
      const result = await votingService.registrarVoto(cpf, candidateNumber);
      
      if (result.success) {
        console.log('✅ [VOTING INTERFACE] Voto registrado com sucesso:', result.voto);
        onVoteConfirm(candidateNumber);
      } else {
        console.error('❌ [VOTING INTERFACE] Erro ao registrar voto:', result.message);
        // Aqui você pode mostrar uma mensagem de erro para o usuário
        onVoteConfirm(candidateNumber); // Por enquanto, continua o fluxo
      }
    } catch (error) {
      console.error('💥 [VOTING INTERFACE] Erro ao registrar voto:', error);
      onVoteConfirm(candidateNumber);
    } finally {
      setIsLoading(false);
    }
  };

  const canConfirm = selectedCandidate && !isFetchingCandidate;

  if (showConfirmation) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-start max-w-7xl mx-auto">
        <UrnaScreen className="min-h-[400px] md:min-h-[450px] max-h-[500px]">
          <div className="text-center space-y-3 md:space-y-4">
            <h1 className="text-lg md:text-xl font-bold text-jurunense-secondary">CONFIRME SEU VOTO</h1>
            
            <div className="bg-gray-800 p-3 md:p-4 rounded border-2 border-jurunense-secondary">
              <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-4">
                {selectedCandidate?.photo && (
                  <img 
                    src={selectedCandidate.photo} 
                    alt={selectedCandidate.name}
                    className="w-20 h-28 md:w-24 md:h-32 object-cover border-2 border-jurunense-secondary rounded"
                    onError={(e) => {
                      // Fallback para avatar gerado se a foto não existir
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedCandidate.name)}&background=131D52&color=fff&size=100`;
                    }}
                  />
                )}
                <div className="text-center md:text-left">
                  <div className="text-2xl md:text-3xl font-bold text-jurunense-secondary mb-1">
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

                            {isLoading ? (
                              <div className="bg-blue-900 border border-blue-600 p-4 md:p-6 rounded">
                                <LoadingSpinner size="lg" text="Registrando voto..." />
                              </div>
                            ) : (
                              <div className="bg-jurunense-primary/20 border border-jurunense-secondary p-2 md:p-3 rounded animate-vote-confirm">
                                <p className="text-white font-bold text-sm md:text-base">
                                  ATENÇÃO: Confirme seu voto pressionando FINALIZAR VOTAÇÃO
                                </p>
                                <p className="text-jurunense-gray text-xs md:text-sm mt-1">
                                  Após confirmar, não será possível alterar seu voto
                                </p>
                              </div>
                            )}
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
                            <UrnaButton variant="white" onClick={handleCorrect} disabled={isLoading}>
                              CORRIGE
                            </UrnaButton>
                            <UrnaButton variant="finalizar" onClick={handleFinalizar} disabled={isLoading}>
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
            <h1 className="text-lg md:text-xl font-bold text-jurunense-secondary">
              ELEIÇÃO CIPA 2025
            </h1>
            <p className="text-sm text-gray-300 mt-1">
              Representante dos Funcionários
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base md:text-lg font-semibold">
                Digite o número do candidato:
              </h2>
              
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-jurunense-primary/20 border-jurunense-secondary text-jurunense-secondary hover:bg-jurunense-primary/30"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Ver Candidatos
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-jurunense-secondary">
                      Lista de Candidatos - Eleição CIPA 2025
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {candidatesList.map((candidate) => (
                      <div 
                        key={candidate.id}
                        className="bg-gray-800 p-4 rounded-lg border border-gray-600 hover:border-jurunense-secondary transition-colors cursor-pointer"
                        onClick={() => {
                          setCandidateNumber(candidate.number);
                          setIsModalOpen(false);
                          // Simular busca do candidato
                          setSelectedCandidate(candidate);
                          playConfirmSound();
                        }}
                      >
                        <div className="flex flex-col items-center text-center space-y-3">
                          <img 
                            src={candidate.photo} 
                            alt={candidate.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-jurunense-secondary"
                            onError={(e) => {
                              // Fallback para avatar gerado se a foto não existir
                              const target = e.target as HTMLImageElement;
                              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=131D52&color=fff&size=100`;
                            }}
                          />
                          <div>
                            <div className="text-lg font-bold text-jurunense-secondary mb-1">
                              {candidate.number}
                            </div>
                            <div className="text-sm font-semibold text-white mb-1">
                              {candidate.name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {candidate.department}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="bg-gray-800 p-3 rounded border-2 border-gray-600">
              <div className="text-3xl md:text-4xl font-mono font-bold tracking-wider">
                <span className="text-jurunense-secondary">
                  {candidateNumber || '__'}
                </span>
                <span className="animate-pulse">|</span>
              </div>
            </div>
            {isFetchingCandidate ? (
              <div className="bg-blue-900 border border-blue-600 p-2 md:p-3 rounded">
          <div className="flex items-center space-x-2">
            <LoadingSpinner size="sm" />
            <p className="text-blue-300 font-semibold text-sm">
              Buscando candidato...
            </p>
          </div>
              </div>
            ) : selectedCandidate ? (
              <div className="bg-gray-800 p-3 md:p-4 rounded border-2 border-jurunense-secondary">
                <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-4">
                  {selectedCandidate.photo && (
                    <img 
                      src={selectedCandidate.photo} 
                      alt={selectedCandidate.name}
                      className="w-16 h-24 md:w-20 md:h-28 object-cover border-2 border-jurunense-secondary rounded"
                      onError={(e) => {
                        // Fallback para avatar gerado se a foto não existir
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedCandidate.name)}&background=131D52&color=fff&size=100`;
                      }}
                    />
                  )}
                  <div className="text-center md:text-left">
                    <div className="text-lg md:text-xl font-bold text-jurunense-secondary mb-1">
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
            ) : candidateNumber.length >= minDigitsForLookup && candidateError ? (
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
              <p>• Digite o número do candidato (1 a {maxDigits} dígitos)</p>
              <p>• Use CORRIGE para apagar</p>
              <p>• Use CONFIRMA para votar</p>
              <p>• Clique em "Ver Candidatos" para ver a lista completa</p>
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