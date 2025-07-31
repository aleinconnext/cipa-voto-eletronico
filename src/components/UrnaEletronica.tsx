import { useState } from "react";
import { VoterValidation } from "./VoterValidation";
import { VotingInterface } from "./VotingInterface";
import { VoteSuccess } from "./VoteSuccess";
import { VotingStep } from "@/types/voting";
import cipaLogo from "@/assets/cipa-logo.png";

export const UrnaEletronica = () => {
  const [currentStep, setCurrentStep] = useState<VotingStep>('validation');
  const [currentVoter, setCurrentVoter] = useState<{ cpf: string; birthDate: string } | null>(null);

  const handleValidationSuccess = (cpf: string, birthDate: string) => {
    setCurrentVoter({ cpf, birthDate });
    setCurrentStep('voting');
  };

  const handleVoteConfirm = (candidateNumber: string) => {
    // Aqui seria salvo no banco de dados via Supabase
    console.log('Vote registered:', { 
      voter: currentVoter, 
      candidate: candidateNumber,
      timestamp: new Date()
    });
    setCurrentStep('success');
  };

  const handleNewVoter = () => {
    setCurrentVoter(null);
    setCurrentStep('validation');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'validation':
        return <VoterValidation onValidationSuccess={handleValidationSuccess} />;
      
      case 'voting':
        return (
          <VotingInterface 
            onVoteConfirm={handleVoteConfirm}
            onBack={handleNewVoter}
          />
        );
      
      case 'success':
        return <VoteSuccess onNewVoter={handleNewVoter} />;
      
      default:
        return <VoterValidation onValidationSuccess={handleValidationSuccess} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-urna p-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-lg shadow-urna p-6 inline-block">
            <div className="flex items-center space-x-4">
              <img 
                src={cipaLogo} 
                alt="CIPA Logo" 
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="text-left">
                <h1 className="text-2xl font-bold text-gray-800">
                  Sistema de Votação CIPA
                </h1>
                <p className="text-gray-600">
                  Urna Eletrônica - Eleição 2024
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Urna Body */}
        <div className="bg-urna-body rounded-3xl shadow-urna p-8 max-w-6xl mx-auto">
          <div className="bg-gradient-to-b from-gray-100 to-gray-200 rounded-2xl p-6 border-4 border-gray-800">
            {renderCurrentStep()}
          </div>
          
          {/* Urna Footer Info */}
          <div className="mt-6 text-center">
            <div className="bg-gray-800 rounded-lg p-3 inline-block">
              <p className="text-gray-300 text-sm">
                Urna Eletrônica Certificada • Justiça Eleitoral Empresarial
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-8 text-center">
          <a
            href="/admin"
            className="text-white hover:text-yellow-400 transition-colors font-semibold"
          >
            Área Administrativa
          </a>
        </div>
      </div>
    </div>
  );
};