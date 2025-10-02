import { useState } from "react";
import { UrnaScreen } from "./UrnaScreen";
import { UrnaKeypad } from "./UrnaKeypad";
import { LoadingSpinner } from "./LoadingSpinner";
import { useUrnaAudio } from "@/hooks/useUrnaAudio";
import { votingService } from "@/services/votingService";

interface VoterValidationProps {
  onValidationSuccess: (cpf: string, birthDate: string) => void;
}

export const VoterValidation = ({ onValidationSuccess }: VoterValidationProps) => {
  const [currentField, setCurrentField] = useState<'cpf' | 'birthDate'>('cpf');
  const [cpf, setCpf] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { playErrorSound, playConfirmSound } = useUrnaAudio();

  const formatCPF = (value: string) => {
    // Remove tudo que não for número
    const numbers = value.replace(/\D/g, '');
    // Aplica a máscara XXX.XXX.XXX-XX
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatDate = (value: string) => {
    // Remove tudo que não for número
    const numbers = value.replace(/\D/g, '');
    // Aplica a máscara DD/MM/AAAA
    return numbers.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
  };

  const validateDate = (date: string) => {
    const numbers = date.replace(/\D/g, '');
    if (numbers.length !== 8) return false;
    
    const day = parseInt(numbers.substr(0, 2));
    const month = parseInt(numbers.substr(2, 2));
    const year = parseInt(numbers.substr(4, 4));
    
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if (year < 1900 || year > new Date().getFullYear()) return false;
    
    return true;
  };

  const handleNumberClick = (number: string) => {
    setError('');
    
    if (currentField === 'cpf') {
      const newCpf = cpf.replace(/\D/g, '') + number;
      if (newCpf.length <= 11) {
        setCpf(formatCPF(newCpf));
      }
    } else {
      const newDate = birthDate.replace(/\D/g, '') + number;
      if (newDate.length <= 8) {
        setBirthDate(formatDate(newDate));
      }
    }
  };

  const handleCorrect = () => {
    if (currentField === 'cpf') {
      setCpf('');
    } else {
      setBirthDate('');
    }
    setError('');
  };

  const handleConfirm = async () => {
    if (currentField === 'cpf') {
      setIsLoading(true);
      setError('');
      
      try {
        console.log('🔍 [VOTER VALIDATION] Iniciando validação de CPF...');
        const result = await votingService.validarFuncionario(cpf);
        
        if (!result.success) {
          console.log('❌ [VOTER VALIDATION] Validação falhou:', result.message);
          setError(result.message);
          playErrorSound();
          return;
        }
        
        console.log('✅ [VOTER VALIDATION] Validação bem-sucedida, mudando para data de nascimento');
        setCurrentField('birthDate');
        playConfirmSound();
      } catch (error) {
        console.error('💥 [VOTER VALIDATION] Erro na validação:', error);
        setError('Erro ao validar funcionário. Tente novamente.');
        playErrorSound();
      } finally {
        setIsLoading(false);
      }
    } else {
      if (!validateDate(birthDate)) {
        setError('Data inválida. Use o formato DD/MM/AAAA.');
        playErrorSound();
        return;
      }
      
      setIsLoading(true);
      setError('');
      
      try {
        console.log('🔍 [VOTER VALIDATION] Iniciando validação de data de nascimento...');
        const result = await votingService.validarDataNascimento(cpf, birthDate);
        
        if (!result.success) {
          console.log('❌ [VOTER VALIDATION] Validação de data falhou:', result.message);
          setError(result.message);
          playErrorSound();
          return;
        }
        
        console.log('✅ [VOTER VALIDATION] Validação completa, prosseguindo para votação');
        
        // Definir o funcionário atual no serviço para uso posterior
        if (result.funcionario) {
          votingService.definirFuncionarioAtual(result.funcionario);
        }
        
        playConfirmSound();
        onValidationSuccess(cpf, birthDate);
      } catch (error) {
        console.error('💥 [VOTER VALIDATION] Erro na validação de data:', error);
        setError('Erro ao validar data de nascimento. Tente novamente.');
        playErrorSound();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const canConfirm = () => {
    if (currentField === 'cpf') {
      return cpf.replace(/\D/g, '').length === 11;
    } else {
      return birthDate.replace(/\D/g, '').length === 8;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-start max-w-7xl mx-auto">
      <UrnaScreen className="min-h-[400px] md:min-h-[450px] max-h-[500px]">
        <div className="text-center space-y-3 md:space-y-4">
          <div className="border-b border-gray-600 pb-3">
            <h1 className="text-lg md:text-xl font-bold text-jurunense-secondary">
              ELEIÇÃO CIPA 2025
            </h1>
            <p className="text-sm text-gray-300 mt-1">
              Comissão Interna de Prevenção de Acidentes
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base md:text-lg font-semibold">
              {currentField === 'cpf' ? 'Digite seu CPF:' : 'Digite sua data de nascimento:'}
            </h2>
            
            <div className="bg-gray-800 p-3 rounded border-2 border-gray-600">
              <div className="text-2xl md:text-3xl font-mono tracking-wider">
                {currentField === 'cpf' ? (
                  <span className="text-jurunense-secondary">
                    {cpf || '___.___.___-__'}
                  </span>
                ) : (
                  <span className="text-jurunense-secondary">
                    {birthDate || '__/__/____'}
                  </span>
                )}
                <span className="animate-pulse">|</span>
              </div>
            </div>

            {isLoading && (
              <div className="bg-blue-900 border border-blue-600 p-4 md:p-6 rounded">
                <LoadingSpinner 
                  size="lg" 
                  text={currentField === 'cpf' ? "Validando funcionário..." : "Validando data de nascimento..."} 
                />
              </div>
            )}

            {error && !isLoading && (
              <div className="bg-red-900 border border-red-600 p-2 md:p-3 rounded">
                <p className="text-red-300 font-semibold text-sm">{error}</p>
              </div>
            )}

            <div className="text-xs md:text-sm text-gray-400 mt-3">
              {currentField === 'cpf' ? (
                <p>Digite apenas os números do seu CPF</p>
              ) : (
                <p>Digite sua data de nascimento no formato DD/MM/AAAA</p>
              )}
            </div>
          </div>
        </div>
      </UrnaScreen>

      <div className="flex justify-center">
        <UrnaKeypad
          onNumberClick={handleNumberClick}
          onCorrect={handleCorrect}
          onConfirm={handleConfirm}
          confirmDisabled={!canConfirm() || isLoading}
        />
      </div>
    </div>
  );
};