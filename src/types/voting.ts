export interface Candidate {
  id: string;
  number: string;
  name: string;
  photo?: string;
  position: string;
  department: string;
}

export interface Voter {
  id: string;
  cpf: string;
  name: string;
  birthDate: string;
  department: string;
  hasVoted: boolean;
}

export interface Vote {
  id: string;
  candidateNumber: string;
  timestamp: Date;
  voterCpf: string;
}

export interface VotingSession {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  candidates: Candidate[];
}

export type VotingStep = 
  | 'validation' 
  | 'voting' 
  | 'candidate-display' 
  | 'confirmation' 
  | 'success' 
  | 'error';