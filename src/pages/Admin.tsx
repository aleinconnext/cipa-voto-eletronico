import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Calendar, Clock, Users, Vote, Settings, Plus, Edit, Trash2, Download, Eye, BarChart3, PieChart as PieChartIcon, Building2, Database, TestTube } from "lucide-react";
import logoJurunense from "@/assets/logo-jurunense-desk.svg?url";
import { votingService } from "@/services/votingService";

// Dados das filiais
const filiais = [
  {
    id: 1,
    nome: "JURUNENSE",
    cnpj: "13.772.792/0001-64",
    razaoSocial: "JURUNENSE HOME CENTER LTDA",
    telefone: "(91) 3323-2900",
    endereco: "AV CIPRIANO SANTOS, 434 - CANUDOS - BELEM/PA",
    cep: "66070-000"
  },
  {
    id: 2,
    nome: "SEVEN TRANSPORTE",
    cnpj: "10.902.984/0001-50",
    razaoSocial: "SEVEN TRANSPORTE E LOGISTICA EIRELI",
    telefone: "918443-5116",
    endereco: "ROD BR 316, 4500 KM 3 - COQUEIRO - ANANINDEUA/PA",
    cep: "67113-000"
  },
  {
    id: 3,
    nome: "ANDRADE BATISTA",
    cnpj: "28.345.081/0001-80",
    razaoSocial: "ANDRADE BATISTA CONSTRUTORA LTDA",
    telefone: "(91) 8443-5116",
    endereco: "TV GUERRA PASSOS, 219 SALA 1 - CANUDOS - BELÉM/PA",
    cep: "66070-210"
  },
  {
    id: 4,
    nome: "PESQUISAS EXATAS",
    cnpj: "13.272.852/0001-80",
    razaoSocial: "PESQUISAS EXATAS EIRELI",
    telefone: "",
    endereco: "BRASIL",
    cep: ""
  },
  {
    id: 5,
    nome: "JURU AVULSA",
    cnpj: "41.673.215/0001-50",
    razaoSocial: "JURUNENSE",
    telefone: "",
    endereco: "BRASIL",
    cep: ""
  }
];

// Dados de votação por filial
const votacaoPorFiliais = [
  {
    filialId: 1,
    filialNome: "JURUNENSE",
    cnpj: "13.772.792/0001-64",
    totalEleitores: 85,
    votosComputados: 72,
    participacao: 84.7,
    candidatos: [
      { numero: '01', nome: 'João Silva', departamento: 'Produção', votos: 32, porcentagem: 44.4 },
      { numero: '02', nome: 'Maria Santos', departamento: 'Administração', votos: 28, porcentagem: 38.9 },
      { numero: '03', nome: 'Pedro Costa', departamento: 'Qualidade', votos: 12, porcentagem: 16.7 }
    ],
    status: 'em_andamento',
    horarioInicio: '08:00',
    horarioFim: '18:00'
  },
  {
    filialId: 2,
    filialNome: "SEVEN TRANSPORTE",
    cnpj: "10.902.984/0001-50",
    totalEleitores: 45,
    votosComputados: 38,
    participacao: 84.4,
    candidatos: [
      { numero: '01', nome: 'Carlos Oliveira', departamento: 'Logística', votos: 18, porcentagem: 47.4 },
      { numero: '02', nome: 'Ana Paula', departamento: 'Administração', votos: 15, porcentagem: 39.5 },
      { numero: '03', nome: 'Roberto Lima', departamento: 'Operações', votos: 5, porcentagem: 13.1 }
    ],
    status: 'em_andamento',
    horarioInicio: '08:00',
    horarioFim: '18:00'
  },
  {
    filialId: 3,
    filialNome: "ANDRADE BATISTA",
    cnpj: "28.345.081/0001-80",
    totalEleitores: 32,
    votosComputados: 28,
    participacao: 87.5,
    candidatos: [
      { numero: '01', nome: 'Fernando Andrade', departamento: 'Construção', votos: 12, porcentagem: 42.9 },
      { numero: '02', nome: 'Lucia Batista', departamento: 'Projetos', votos: 10, porcentagem: 35.7 },
      { numero: '03', nome: 'Marcos Silva', departamento: 'Obras', votos: 6, porcentagem: 21.4 }
    ],
    status: 'em_andamento',
    horarioInicio: '08:00',
    horarioFim: '18:00'
  },
  {
    filialId: 4,
    filialNome: "PESQUISAS EXATAS",
    cnpj: "13.272.852/0001-80",
    totalEleitores: 18,
    votosComputados: 15,
    participacao: 83.3,
    candidatos: [
      { numero: '01', nome: 'Patricia Costa', departamento: 'Pesquisa', votos: 8, porcentagem: 53.3 },
      { numero: '02', nome: 'Ricardo Santos', departamento: 'Análise', votos: 5, porcentagem: 33.3 },
      { numero: '03', nome: 'Juliana Lima', departamento: 'Dados', votos: 2, porcentagem: 13.4 }
    ],
    status: 'em_andamento',
    horarioInicio: '08:00',
    horarioFim: '18:00'
  },
  {
    filialId: 5,
    filialNome: "JURU AVULSA",
    cnpj: "41.673.215/0001-50",
    totalEleitores: 12,
    votosComputados: 10,
    participacao: 83.3,
    candidatos: [
      { number: '01', nome: 'Antonio Avulso', departamento: 'Operacional', votos: 6, porcentagem: 60.0 },
      { number: '02', nome: 'Sandra Avulso', departamento: 'Administrativo', votos: 4, porcentagem: 40.0 }
    ],
    status: 'em_andamento',
    horarioInicio: '08:00',
    horarioFim: '18:00'
  }
];

// Dados consolidados
const dadosConsolidados = {
  totalEleitores: 192,
  totalVotosComputados: 163,
  participacaoGeral: 84.9,
  filiaisAtivas: 5,
  votacaoEncerrada: 0
};

// Mock data
const mockResults = [
  { number: '01', candidate: 'João Silva', department: 'Produção', votes: 45, percentage: 42.5 },
  { number: '02', candidate: 'Maria Santos', department: 'Administração', votes: 38, percentage: 35.8 },
  { number: '03', candidate: 'Pedro Costa', department: 'Qualidade', votes: 23, percentage: 21.7 }
];

const mockStats = {
  totalVoters: 150,
  votesCompleted: 106,
  votingProgress: 70.7,
  startTime: '08:00',
  endTime: '18:00',
  activeSessions: 3
};

const mockCampaigns = [
  { id: '1', name: 'Eleição CIPA 2025', startDate: '01/01/2025', endDate: '31/01/2025', status: 'active', totalVoters: 150 },
  { id: '2', name: 'Eleição CIPA 2024', startDate: '01/01/2024', endDate: '31/01/2024', status: 'completed', totalVoters: 120 }
];

const mockSessions = [
  { id: '1', name: 'Sessão Matutina', startTime: '08:00', endTime: '12:00', status: 'active', voters: 45 },
  { id: '2', name: 'Sessão Vespertina', startTime: '14:00', endTime: '18:00', status: 'active', voters: 61 }
];

const COLORS = ['#131D52', '#FE3B1F', '#BDBDBD', '#FF6B35', '#4ECDC4'];

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [showNewSession, setShowNewSession] = useState(false);
  const [selectedFiliais, setSelectedFiliais] = useState<string[]>([]);
  const [dbTestResult, setDbTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [dbTableResult, setDbTableResult] = useState<{ success: boolean; message: string; existe: boolean } | null>(null);
  const [isTestingDb, setIsTestingDb] = useState(false);
  
  // Obtém estatísticas reais do service
  const estatisticasReais = votingService.obterEstatisticas();

  const handleTestDatabase = async () => {
    setIsTestingDb(true);
    setDbTestResult(null);
    
    try {
      const result = await votingService.testarConexaoBanco();
      setDbTestResult(result);
    } catch (error) {
      setDbTestResult({
        success: false,
        message: 'Erro ao testar conexão com banco de dados'
      });
    } finally {
      setIsTestingDb(false);
    }
  };

  const handleCheckTable = async () => {
    setIsTestingDb(true);
    setDbTableResult(null);
    
    try {
      const result = await votingService.verificarTabelaVotos();
      setDbTableResult(result);
    } catch (error) {
      setDbTableResult({
        success: false,
        message: 'Erro ao verificar tabela',
        existe: false
      });
    } finally {
      setIsTestingDb(false);
    }
  };

  const handleLogin = () => {
    if (password === 'admin2025') {
      setIsAuthenticated(true);
    } else {
      alert('Senha incorreta');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-jurunense-primary to-jurunense-primary/80 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <img
                src={logoJurunense}
                alt="Jurunense Logo"
                className="w-32 h-24 object-contain"
              />
            </div>
            <CardTitle className="text-2xl text-jurunense-primary">Área Administrativa</CardTitle>
            <CardDescription className="text-jurunense-secondary">Sistema de Apuração CIPA 2025</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-jurunense-primary font-semibold">Senha de Acesso:</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 border-jurunense-gray focus:border-jurunense-secondary"
                placeholder="Digite a senha"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <Button onClick={handleLogin} className="w-full bg-jurunense-primary hover:bg-jurunense-primary/90">
              Acessar Sistema
            </Button>
            <div className="text-center">
              <a href="/" className="text-jurunense-secondary hover:underline text-sm">
                Voltar para Votação
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto max-w-7xl p-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img
                src={logoJurunense}
                alt="Jurunense Logo"
                className="w-16 h-12 object-contain"
              />
              <div>
                <h1 className="text-3xl font-bold text-jurunense-primary">Administração CIPA 2025</h1>
                <p className="text-jurunense-secondary font-semibold">Sistema de Apuração e Monitoramento</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
                Sair
              </Button>
              <a href="/">
                <Button variant="outline">Voltar à Votação</Button>
              </a>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-jurunense-gray shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-jurunense-primary flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Total de Eleitores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-jurunense-primary">{dadosConsolidados.totalEleitores}</div>
              <p className="text-xs text-gray-600">Todas as filiais</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-jurunense-gray shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-jurunense-primary flex items-center">
                <Vote className="w-4 h-4 mr-2" />
                Votos Computados
              </CardTitle>
            </CardHeader>
                            <CardContent>
                              <div className="text-3xl font-bold text-jurunense-secondary">{estatisticasReais.totalVotos}</div>
                              <p className="text-xs text-gray-600">
                                {dadosConsolidados.participacaoGeral}% de participação
                              </p>
                            </CardContent>
          </Card>

          <Card className="bg-white border-jurunense-gray shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-jurunense-primary flex items-center">
                <Building2 className="w-4 h-4 mr-2" />
                Filiais Ativas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-jurunense-primary">{dadosConsolidados.filiaisAtivas}</div>
              <p className="text-xs text-gray-600">Em votação</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-jurunense-gray shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-jurunense-primary flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Status Geral
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className="bg-jurunense-secondary text-white">
                EM ANDAMENTO
              </Badge>
              <p className="text-xs text-gray-600 mt-1">
                08:00 às 18:00
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-white border-jurunense-gray">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-jurunense-primary data-[state=active]:text-white">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="filiais" className="data-[state=active]:bg-jurunense-primary data-[state=active]:text-white">
              Filiais
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="data-[state=active]:bg-jurunense-primary data-[state=active]:text-white">
              Campanhas
            </TabsTrigger>
            <TabsTrigger value="sessions" className="data-[state=active]:bg-jurunense-primary data-[state=active]:text-white">
              Sessões
            </TabsTrigger>
            <TabsTrigger value="results" className="data-[state=active]:bg-jurunense-primary data-[state=active]:text-white">
              Apuração
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-jurunense-primary data-[state=active]:text-white">
              Relatórios
            </TabsTrigger>
            <TabsTrigger value="database" className="data-[state=active]:bg-jurunense-primary data-[state=active]:text-white">
              Banco de Dados
            </TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Progresso Geral da Votação */}
              <Card className="bg-white border-jurunense-gray shadow-lg">
                <CardHeader>
                  <CardTitle className="text-jurunense-primary flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Progresso Geral da Votação
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-jurunense-primary font-semibold">Participação Geral</span>
                        <span className="text-jurunense-secondary font-bold">{dadosConsolidados.participacaoGeral}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-jurunense-primary to-jurunense-secondary h-3 rounded-full transition-all duration-500"
                          style={{ width: `${dadosConsolidados.participacaoGeral}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {dadosConsolidados.totalVotosComputados}
                        </div>
                        <div className="text-sm text-green-700">Já votaram</div>
                      </div>
                      <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {dadosConsolidados.totalEleitores - dadosConsolidados.totalVotosComputados}
                        </div>
                        <div className="text-sm text-orange-700">Ainda não votaram</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Gráfico de Participação por Filial */}
              <Card className="bg-white border-jurunense-gray shadow-lg">
                <CardHeader>
                  <CardTitle className="text-jurunense-primary flex items-center">
                    <Building2 className="w-5 h-5 mr-2" />
                    Participação por Filial
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={votacaoPorFiliais}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#BDBDBD" />
                      <XAxis dataKey="filialNome" stroke="#131D52" />
                      <YAxis stroke="#131D52" />
                      <Tooltip />
                      <Bar dataKey="participacao" fill="#FE3B1F" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Resumo por Filial */}
              <Card className="lg:col-span-2 bg-white border-jurunense-gray shadow-lg">
                <CardHeader>
                  <CardTitle className="text-jurunense-primary">Resumo por Filial</CardTitle>
                  <CardDescription className="text-jurunense-secondary">
                    Apuração em tempo real - {dadosConsolidados.totalVotosComputados} votos computados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {votacaoPorFiliais.map((filial) => (
                      <div key={filial.filialId} className="flex items-center justify-between p-4 border border-jurunense-gray rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-jurunense-primary rounded-full flex items-center justify-center text-white font-bold">
                            {filial.filialId}
                          </div>
                          <div>
                            <h3 className="font-semibold text-jurunense-primary">{filial.filialNome}</h3>
                            <p className="text-sm text-gray-600">
                              {filial.cnpj} • {filial.participacao}% de participação
                            </p>
                            <p className="text-xs text-gray-500">
                              {filial.votosComputados}/{filial.totalEleitores} eleitores
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-jurunense-secondary">{filial.participacao}%</div>
                          <div className="text-sm text-gray-600">participação</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Filiais */}
          <TabsContent value="filiais" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-jurunense-primary">Apuração por Filial</h2>
              <Button onClick={() => setActiveTab('results')} className="bg-jurunense-primary hover:bg-jurunense-primary/90">
                <BarChart3 className="w-4 h-4 mr-2" />
                Ver Apuração Detalhada
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {votacaoPorFiliais.map((filial) => (
                <Card key={filial.filialId} className="bg-white border-jurunense-gray shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-jurunense-primary">{filial.filialNome}</CardTitle>
                        <CardDescription className="text-jurunense-secondary">
                          {filial.cnpj}
                        </CardDescription>
                      </div>
                      <Badge className="bg-jurunense-secondary text-white">
                        {filial.participacao}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Progresso da filial */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Progresso</span>
                          <span className="font-semibold">{filial.votosComputados}/{filial.totalEleitores}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-jurunense-secondary h-2 rounded-full transition-all duration-500"
                            style={{ width: `${filial.participacao}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Candidatos da filial */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-jurunense-primary text-sm">Candidatos:</h4>
                        {filial.candidatos.map((candidato, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span className="text-gray-700">
                              {candidato.numero} - {candidato.nome}
                            </span>
                            <span className="font-semibold text-jurunense-secondary">
                              {candidato.votos} votos ({candidato.porcentagem}%)
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex space-x-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="w-4 h-4 mr-1" />
                          Detalhes
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Download className="w-4 h-4 mr-1" />
                          Relatório
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Campanhas */}
          <TabsContent value="campaigns" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-jurunense-primary">Gerenciar Campanhas</h2>
              <Button onClick={() => setShowNewCampaign(true)} className="bg-jurunense-primary hover:bg-jurunense-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Nova Campanha
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockCampaigns.map((campaign) => (
                <Card key={campaign.id} className="bg-white border-jurunense-gray shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-jurunense-primary">{campaign.name}</CardTitle>
                        <CardDescription className="text-jurunense-secondary">
                          {campaign.startDate} a {campaign.endDate}
                        </CardDescription>
                      </div>
                      <Badge className={campaign.status === 'active' ? 'bg-jurunense-secondary' : 'bg-gray-500'}>
                        {campaign.status === 'active' ? 'ATIVA' : 'CONCLUÍDA'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total de Eleitores:</span>
                        <span className="font-semibold text-jurunense-primary">{campaign.totalVoters}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="w-4 h-4 mr-1" />
                          Ver
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Sessões */}
          <TabsContent value="sessions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-jurunense-primary">Gerenciar Sessões</h2>
              <Button onClick={() => setShowNewSession(true)} className="bg-jurunense-primary hover:bg-jurunense-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Nova Sessão
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockSessions.map((session) => (
                <Card key={session.id} className="bg-white border-jurunense-gray shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-jurunense-primary">{session.name}</CardTitle>
                        <CardDescription className="text-jurunense-secondary">
                          {session.startTime} - {session.endTime}
                        </CardDescription>
                      </div>
                      <Badge className={session.status === 'active' ? 'bg-jurunense-secondary' : 'bg-orange-500'}>
                        {session.status === 'active' ? 'ATIVA' : 'PENDENTE'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Votantes:</span>
                        <span className="font-semibold text-jurunense-primary">{session.voters}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="w-4 h-4 mr-1" />
                          Monitorar
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Apuração */}
          <TabsContent value="results" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de Participação por Filial */}
              <Card className="bg-white border-jurunense-gray shadow-lg">
                <CardHeader>
                  <CardTitle className="text-jurunense-primary">Participação por Filial</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={votacaoPorFiliais}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#BDBDBD" />
                      <XAxis dataKey="filialNome" stroke="#131D52" />
                      <YAxis stroke="#131D52" />
                      <Tooltip />
                      <Bar dataKey="participacao" fill="#FE3B1F" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Gráfico de Votos por Filial */}
              <Card className="bg-white border-jurunense-gray shadow-lg">
                <CardHeader>
                  <CardTitle className="text-jurunense-primary">Votos por Filial</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={votacaoPorFiliais}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ filialNome, votosComputados }) => `${filialNome}: ${votosComputados}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="votosComputados"
                      >
                        {votacaoPorFiliais.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Tabela Detalhada por Filial */}
            <Card className="bg-white border-jurunense-gray shadow-lg">
              <CardHeader>
                <CardTitle className="text-jurunense-primary">Apuração Detalhada por Filial</CardTitle>
                <CardDescription className="text-jurunense-secondary">
                  Resultados completos de cada filial
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {votacaoPorFiliais.map((filial) => (
                    <div key={filial.filialId} className="border border-jurunense-gray rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-jurunense-primary">{filial.filialNome}</h3>
                          <p className="text-sm text-gray-600">{filial.cnpj}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-jurunense-secondary">{filial.participacao}%</div>
                          <div className="text-sm text-gray-600">
                            {filial.votosComputados}/{filial.totalEleitores} eleitores
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {filial.candidatos.map((candidato, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-jurunense-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {candidato.numero}
                              </div>
                              <div>
                                <div className="font-semibold text-jurunense-primary">{candidato.nome}</div>
                                <div className="text-sm text-gray-600">{candidato.departamento}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-jurunense-secondary">{candidato.votos}</div>
                              <div className="text-sm text-gray-600">{candidato.porcentagem}%</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Relatórios */}
          <TabsContent value="reports" className="space-y-6">
            <Card className="bg-white border-jurunense-gray shadow-lg">
              <CardHeader>
                <CardTitle className="text-jurunense-primary">Relatórios e Exportação</CardTitle>
                <CardDescription className="text-jurunense-secondary">Gere relatórios completos da eleição</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-24 flex-col bg-white border-jurunense-gray hover:bg-gray-50">
                    <BarChart3 className="w-8 h-8 mb-2 text-jurunense-primary" />
                    <span className="font-semibold text-jurunense-primary">Relatório Geral</span>
                    <span className="text-xs text-gray-600">Todas as filiais</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex-col bg-white border-jurunense-gray hover:bg-gray-50">
                    <Building2 className="w-8 h-8 mb-2 text-jurunense-primary" />
                    <span className="font-semibold text-jurunense-primary">Por Filial</span>
                    <span className="text-xs text-gray-600">Resultados individuais</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex-col bg-white border-jurunense-gray hover:bg-gray-50">
                    <Users className="w-8 h-8 mb-2 text-jurunense-primary" />
                    <span className="font-semibold text-jurunense-primary">Lista de Eleitores</span>
                    <span className="text-xs text-gray-600">Participantes e status</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex-col bg-white border-jurunense-gray hover:bg-gray-50">
                    <Download className="w-8 h-8 mb-2 text-jurunense-primary" />
                    <span className="font-semibold text-jurunense-primary">Ata de Apuração</span>
                    <span className="text-xs text-gray-600">Documento oficial</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Banco de Dados */}
          <TabsContent value="database" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-jurunense-primary">Teste de Banco de Dados</h2>
              <Badge className="bg-jurunense-secondary text-white">
                <Database className="w-4 h-4 mr-1" />
                MSSQL Server
              </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Teste de Conexão */}
              <Card className="bg-white border-jurunense-gray shadow-lg">
                <CardHeader>
                  <CardTitle className="text-jurunense-primary flex items-center">
                    <TestTube className="w-5 h-5 mr-2" />
                    Teste de Conexão
                  </CardTitle>
                  <CardDescription className="text-jurunense-secondary">
                    Verifica se a conexão com o banco de dados está funcionando
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="text-sm text-gray-600 mb-2">Configuração do Banco:</div>
                    <div className="text-xs text-gray-700 space-y-1">
                      <div><strong>Servidor:</strong> 45.6.153.34:38000</div>
                      <div><strong>Database:</strong> C6P3YB_167823_RM_PD</div>
                      <div><strong>Usuário:</strong> CLT167823TI2</div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleTestDatabase} 
                    disabled={isTestingDb}
                    className="w-full bg-jurunense-primary hover:bg-jurunense-primary/90"
                  >
                    {isTestingDb ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Testando...
                      </>
                    ) : (
                      <>
                        <TestTube className="w-4 h-4 mr-2" />
                        Testar Conexão
                      </>
                    )}
                  </Button>

                  {dbTestResult && (
                    <div className={`p-4 rounded-lg border ${
                      dbTestResult.success 
                        ? 'bg-green-50 border-green-200 text-green-800' 
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}>
                      <div className="font-semibold mb-2">
                        {dbTestResult.success ? '✅ Conexão Bem-sucedida' : '❌ Falha na Conexão'}
                      </div>
                      <div className="text-sm">{dbTestResult.message}</div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Verificação de Tabela */}
              <Card className="bg-white border-jurunense-gray shadow-lg">
                <CardHeader>
                  <CardTitle className="text-jurunense-primary flex items-center">
                    <Database className="w-5 h-5 mr-2" />
                    Verificação de Tabela
                  </CardTitle>
                  <CardDescription className="text-jurunense-secondary">
                    Verifica se a tabela VELEICAOVOTOMANUAL existe
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="text-sm text-gray-600 mb-2">Tabela de Votos:</div>
                    <div className="text-xs text-gray-700">
                      <div><strong>Nome:</strong> VELEICAOVOTOMANUAL</div>
                      <div><strong>Finalidade:</strong> Armazenar votos manuais</div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleCheckTable} 
                    disabled={isTestingDb}
                    className="w-full bg-jurunense-secondary hover:bg-jurunense-secondary/90"
                  >
                    {isTestingDb ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Verificando...
                      </>
                    ) : (
                      <>
                        <Database className="w-4 h-4 mr-2" />
                        Verificar Tabela
                      </>
                    )}
                  </Button>

                  {dbTableResult && (
                    <div className={`p-4 rounded-lg border ${
                      dbTableResult.success 
                        ? 'bg-green-50 border-green-200 text-green-800' 
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}>
                      <div className="font-semibold mb-2">
                        {dbTableResult.existe ? '✅ Tabela Encontrada' : '❌ Tabela Não Encontrada'}
                      </div>
                      <div className="text-sm">{dbTableResult.message}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Informações de Debug */}
            <Card className="bg-white border-jurunense-gray shadow-lg">
              <CardHeader>
                <CardTitle className="text-jurunense-primary">Informações de Debug</CardTitle>
                <CardDescription className="text-jurunense-secondary">
                  Logs detalhados do processo de votação
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="font-semibold text-blue-800 mb-2">📋 Instruções:</div>
                    <div className="text-sm text-blue-700 space-y-1">
                      <div>• Abra o Console do navegador (F12) para ver logs detalhados</div>
                      <div>• Todos os processos de votação são logados com emojis para fácil identificação</div>
                      <div>• Logs incluem: conexão, busca de candidatos, inserção de votos</div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="font-semibold text-yellow-800 mb-2">⚠️ Importante:</div>
                    <div className="text-sm text-yellow-700 space-y-1">
                      <div>• O sistema agora insere votos diretamente no banco MSSQL</div>
                      <div>• Cada voto gera um CODVOTO único automaticamente</div>
                      <div>• A tabela VELEICAOVOTOMANUAL deve existir no banco</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal Nova Campanha */}
        {showNewCampaign && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md bg-white">
              <CardHeader>
                <CardTitle className="text-jurunense-primary">Nova Campanha</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-jurunense-primary">Nome da Campanha</Label>
                  <Input placeholder="Ex: Eleição CIPA 2025" className="border-jurunense-gray" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-jurunense-primary">Data Início</Label>
                    <Input type="date" className="border-jurunense-gray" />
                  </div>
                  <div>
                    <Label className="text-jurunense-primary">Data Fim</Label>
                    <Input type="date" className="border-jurunense-gray" />
                  </div>
                </div>
                <div>
                  <Label className="text-jurunense-primary">Descrição</Label>
                  <Textarea placeholder="Descrição da campanha..." className="border-jurunense-gray" />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => setShowNewCampaign(false)} variant="outline" className="flex-1">
                    Cancelar
                  </Button>
                  <Button className="flex-1 bg-jurunense-primary hover:bg-jurunense-primary/90">
                    Criar Campanha
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Modal Nova Sessão */}
        {showNewSession && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md bg-white">
              <CardHeader>
                <CardTitle className="text-jurunense-primary">Nova Sessão</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-jurunense-primary">Nome da Sessão</Label>
                  <Input placeholder="Ex: Sessão Matutina" className="border-jurunense-gray" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-jurunense-primary">Hora Início</Label>
                    <Input type="time" className="border-jurunense-gray" />
                  </div>
                  <div>
                    <Label className="text-jurunense-primary">Hora Fim</Label>
                    <Input type="time" className="border-jurunense-gray" />
                  </div>
                </div>
                <div>
                  <Label className="text-jurunense-primary">Campanha</Label>
                  <Select>
                    <SelectTrigger className="border-jurunense-gray">
                      <SelectValue placeholder="Selecione uma campanha" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Eleição CIPA 2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => setShowNewSession(false)} variant="outline" className="flex-1">
                    Cancelar
                  </Button>
                  <Button className="flex-1 bg-jurunense-primary hover:bg-jurunense-primary/90">
                    Criar Sessão
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}