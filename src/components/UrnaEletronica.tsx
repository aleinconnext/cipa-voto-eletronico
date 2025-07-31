import { useState } from "react";
import { VoterValidation } from "./VoterValidation";
import { VotingInterface } from "./VotingInterface";
import { VoteSuccess } from "./VoteSuccess";
import { VotingStep } from "@/types/voting";
import logoJurunense from "@/assets/logo-jurunense-desk.svg?url";

export const UrnaEletronica = () => {
  const [currentStep, setCurrentStep] = useState<VotingStep>('validation');
  const [voterCPF, setVoterCPF] = useState('');
  const [voterBirthDate, setVoterBirthDate] = useState('');

  const handleValidationSuccess = (cpf: string, birthDate: string) => {
    setVoterCPF(cpf);
    setVoterBirthDate(birthDate);
    setCurrentStep('voting');
  };

  const handleVoteConfirm = (candidateNumber: string) => {
    setCurrentStep('success');
  };

  const handleNewVoter = () => {
    setCurrentStep('validation');
    setVoterCPF('');
    setVoterBirthDate('');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'validation':
        return <VoterValidation onValidationSuccess={handleValidationSuccess} />;
      case 'voting':
        return <VotingInterface onVoteConfirm={handleVoteConfirm} onBack={handleNewVoter} />;
      case 'success':
        return <VoteSuccess onNewVoter={handleNewVoter} />;
      default:
        return <VoterValidation onValidationSuccess={handleValidationSuccess} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-jurunense-primary to-jurunense-primary/80 p-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 inline-block border-2 border-jurunense-secondary">
            <div className="flex items-center space-x-4">
              <img
                src={logoJurunense}
                alt="Jurunense Logo"
                className="w-20 h-16 object-contain"
              />
              <div className="text-left">
                <h1 className="text-2xl font-bold text-jurunense-primary">
                  Sistema de Votação CIPA
                </h1>
                <p className="text-jurunense-secondary font-semibold">
                  Urna Eletrônica - Eleição 2025
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Urna Body */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-6xl mx-auto border-4 border-jurunense-primary">
          <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl p-6 border-4 border-jurunense-gray">
            {renderCurrentStep()}
          </div>

          {/* Urna Footer Info */}
          <div className="mt-6 text-center">
            <div className="bg-jurunense-primary rounded-lg p-3 inline-block">
              <p className="text-white text-sm font-semibold">
                Urna Eletrônica Certificada • Justiça Eleitoral Jurunense
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-8 text-center">
          <a
            href="/admin"
            className="text-white hover:text-jurunense-secondary transition-colors font-semibold"
          >
            Área Administrativa
          </a>
        </div>
      </div>
    </div>
  );
};