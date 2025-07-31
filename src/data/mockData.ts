import { Candidate, Voter } from "@/types/voting";

// Dados mockados dos candidatos
export const mockCandidates: Candidate[] = [
  {
    id: '1',
    number: '10',
    name: 'MARIA SILVA SANTOS',
    position: 'Representante dos Funcionários',
    department: 'Produção',
    photo: 'https://i.pravatar.cc/150?img=9'
  },
  {
    id: '2',
    number: '20',
    name: 'JOÃO CARLOS OLIVEIRA',
    position: 'Representante dos Funcionários',
    department: 'Administração',
    photo: 'https://i.pravatar.cc/150?u=fake@pravatar.com'
  },
  {
    id: '3',
    number: '30',
    name: 'ANA PAULA FERREIRA',
    position: 'Representante dos Funcionários',
    department: 'Qualidade',
    photo: 'https://i.pravatar.cc/150?img=10'
  },
  {
    id: '4',
    number: '40',
    name: 'PEDRO HENRIQUE LIMA',
    position: 'Representante dos Funcionários',
    department: 'TI',
    photo: 'https://i.pravatar.cc/150?img=8'
  },
  {
    id: '5',
    number: '50',
    name: 'FERNANDA COSTA RODRIGUES',
    position: 'Representante dos Funcionários',
    department: 'RH',
    photo: 'https://i.pravatar.cc/150?img=5'
  }
];

// Dados mockados dos eleitores
export const mockVoters: Voter[] = [
  {
    id: '1',
    cpf: '111.444.777-35',
    name: 'CARLOS EDUARDO SILVA',
    birthDate: '1985-03-15',
    department: 'Produção',
    hasVoted: false
  },
  {
    id: '2',
    cpf: '222.555.888-46',
    name: 'JULIANA MARTINS SANTOS',
    birthDate: '1990-07-22',
    department: 'Administração',
    hasVoted: false
  },
  {
    id: '3',
    cpf: '333.666.999-57',
    name: 'ROBERTO ALMEIDA COSTA',
    birthDate: '1988-11-08',
    department: 'Qualidade',
    hasVoted: false
  },
  {
    id: '4',
    cpf: '444.777.000-68',
    name: 'PATRICIA FERREIRA LIMA',
    birthDate: '1992-04-30',
    department: 'TI',
    hasVoted: false
  },
  {
    id: '5',
    cpf: '555.888.111-79',
    name: 'MARCOS ANTONIO RODRIGUES',
    birthDate: '1987-09-12',
    department: 'RH',
    hasVoted: false
  }
];

// Função para validar CPF
export const validateCPF = (cpf: string): boolean => {
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false;
  
  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false;
  
  return true;
};

// Função para encontrar eleitor por CPF
export const findVoterByCPF = (cpf: string): Voter | null => {
  const cleanCPF = cpf.replace(/\D/g, '');
  return mockVoters.find(voter => voter.cpf.replace(/\D/g, '') === cleanCPF) || null;
};

// Função para encontrar candidato por número
export const findCandidateByNumber = (number: string): Candidate | null => {
  return mockCandidates.find(candidate => candidate.number === number) || null;
};

// Função para simular registro de voto
export const registerVote = (voterId: string, candidateNumber: string): boolean => {
  const voter = mockVoters.find(v => v.id === voterId);
  if (voter && !voter.hasVoted) {
    voter.hasVoted = true;
    console.log(`Voto registrado: Eleitor ${voter.name} votou no candidato ${candidateNumber}`);
    return true;
  }
  return false;
};

// Função para obter estatísticas da votação
export const getVotingStats = () => {
  const totalVoters = mockVoters.length;
  const votedVoters = mockVoters.filter(v => v.hasVoted).length;
  const remainingVoters = totalVoters - votedVoters;
  
  return {
    totalVoters,
    votedVoters,
    remainingVoters,
    participationRate: ((votedVoters / totalVoters) * 100).toFixed(1)
  };
}; 