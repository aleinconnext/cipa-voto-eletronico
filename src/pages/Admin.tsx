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
import { Calendar, Clock, Users, Vote, Settings, Plus, Edit, Trash2, Download, Eye, BarChart3, PieChart as PieChartIcon } from "lucide-react";

// Mock data - em produção viria do Supabase
const mockResults = [
  { candidate: 'MARIA SILVA SANTOS', number: '10', votes: 45, percentage: 42.5, department: 'Produção' },
  { candidate: 'JOÃO CARLOS OLIVEIRA', number: '20', votes: 35, percentage: 33.0, department: 'Administração' },
  { candidate: 'ANA PAULA FERREIRA', number: '30', votes: 26, percentage: 24.5, department: 'Qualidade' }
];

const mockStats = {
  totalVoters: 150,
  votesCompleted: 106,
  votingProgress: 70.7,
  startTime: '08:00',
  endTime: '17:00',
  currentTime: '14:30',
  activeSessions: 3,
  totalCandidates: 5
};

const mockSessions = [
  { id: 1, name: 'Sessão Matutina', startTime: '08:00', endTime: '12:00', status: 'active', voters: 45 },
  { id: 2, name: 'Sessão Vespertina', startTime: '13:00', endTime: '17:00', status: 'active', voters: 61 },
  { id: 3, name: 'Sessão Noturna', startTime: '18:00', endTime: '22:00', status: 'pending', voters: 0 }
];

const mockCampaigns = [
  { id: 1, name: 'Eleição CIPA 2025', status: 'active', startDate: '2025-01-15', endDate: '2025-01-20', totalVoters: 150 },
  { id: 2, name: 'Eleição CIPA 2024', status: 'completed', startDate: '2024-01-10', endDate: '2024-01-15', totalVoters: 120 }
];

const COLORS = ['#131D52', '#FE3B1F', '#BDBDBD', '#4CAF50', '#FF9800'];

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [showNewSession, setShowNewSession] = useState(false);

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
                src="https://jurunense.vtexassets.com/assets/vtex/assets-builder/jurunense.store-theme/1.0.28/images/logo-jurunense-desk___713cd0d073b349df05bcb4a4cd3afb54.svg"
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
                src="https://jurunense.vtexassets.com/assets/vtex/assets-builder/jurunense.store-theme/1.0.28/images/logo-jurunense-desk___713cd0d073b349df05bcb4a4cd3afb54.svg"
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
              <div className="text-3xl font-bold text-jurunense-primary">{mockStats.totalVoters}</div>
              <p className="text-xs text-gray-600">Cadastrados no sistema</p>
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
              <div className="text-3xl font-bold text-jurunense-secondary">{mockStats.votesCompleted}</div>
              <p className="text-xs text-gray-600">
                {mockStats.votingProgress.toFixed(1)}% de participação
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-jurunense-gray shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-jurunense-primary flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Status da Votação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className="bg-jurunense-secondary text-white">
                EM ANDAMENTO
              </Badge>
              <p className="text-xs text-gray-600 mt-1">
                {mockStats.startTime} às {mockStats.endTime}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-jurunense-gray shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-jurunense-primary flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Sessões Ativas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-jurunense-primary">{mockStats.activeSessions}</div>
              <p className="text-xs text-gray-600">Em funcionamento</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white border-jurunense-gray">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-jurunense-primary data-[state=active]:text-white">
              Dashboard
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
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Progresso da Votação */}
              <Card className="bg-white border-jurunense-gray shadow-lg">
                <CardHeader>
                  <CardTitle className="text-jurunense-primary flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Progresso da Votação
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-jurunense-primary font-semibold">Participação</span>
                        <span className="text-jurunense-secondary font-bold">{mockStats.votingProgress.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-jurunense-primary to-jurunense-secondary h-3 rounded-full transition-all duration-500" 
                          style={{ width: `${mockStats.votingProgress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {mockStats.votesCompleted}
                        </div>
                        <div className="text-sm text-green-700">Já votaram</div>
                      </div>
                      <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {mockStats.totalVoters - mockStats.votesCompleted}
                        </div>
                        <div className="text-sm text-orange-700">Ainda não votaram</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Gráfico de Pizza */}
              <Card className="bg-white border-jurunense-gray shadow-lg">
                <CardHeader>
                  <CardTitle className="text-jurunense-primary flex items-center">
                    <PieChartIcon className="w-5 h-5 mr-2" />
                    Distribuição de Votos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={mockResults}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ percentage }) => `${percentage.toFixed(1)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="votes"
                      >
                        {mockResults.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Resultados Parciais */}
              <Card className="lg:col-span-2 bg-white border-jurunense-gray shadow-lg">
                <CardHeader>
                  <CardTitle className="text-jurunense-primary">Resultados Parciais</CardTitle>
                  <CardDescription className="text-jurunense-secondary">
                    Apuração em tempo real - {mockStats.votesCompleted} votos computados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockResults.map((result, index) => (
                      <div key={result.number} className="flex items-center justify-between p-4 border border-jurunense-gray rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-jurunense-primary rounded-full flex items-center justify-center text-white font-bold">
                            {result.number}
                          </div>
                          <div>
                            <h3 className="font-semibold text-jurunense-primary">{result.candidate}</h3>
                            <p className="text-sm text-gray-600">
                              {result.department} • {result.percentage}% dos votos válidos
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-jurunense-secondary">{result.votes}</div>
                          <div className="text-sm text-gray-600">votos</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
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
              {/* Gráfico de Barras */}
              <Card className="bg-white border-jurunense-gray shadow-lg">
                <CardHeader>
                  <CardTitle className="text-jurunense-primary">Distribuição de Votos</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockResults}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#BDBDBD" />
                      <XAxis dataKey="number" stroke="#131D52" />
                      <YAxis stroke="#131D52" />
                      <Tooltip />
                      <Bar dataKey="votes" fill="#FE3B1F" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Gráfico de Linha - Evolução Temporal */}
              <Card className="bg-white border-jurunense-gray shadow-lg">
                <CardHeader>
                  <CardTitle className="text-jurunense-primary">Evolução da Votação</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={[
                      { time: '08:00', votes: 0 },
                      { time: '10:00', votes: 25 },
                      { time: '12:00', votes: 45 },
                      { time: '14:00', votes: 75 },
                      { time: '16:00', votes: 95 },
                      { time: '18:00', votes: 106 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#BDBDBD" />
                      <XAxis dataKey="time" stroke="#131D52" />
                      <YAxis stroke="#131D52" />
                      <Tooltip />
                      <Line type="monotone" dataKey="votes" stroke="#FE3B1F" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
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
                    <span className="font-semibold text-jurunense-primary">Relatório de Apuração</span>
                    <span className="text-xs text-gray-600">Resultados detalhados</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex-col bg-white border-jurunense-gray hover:bg-gray-50">
                    <Users className="w-8 h-8 mb-2 text-jurunense-primary" />
                    <span className="font-semibold text-jurunense-primary">Lista de Eleitores</span>
                    <span className="text-xs text-gray-600">Participantes e status</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex-col bg-white border-jurunense-gray hover:bg-gray-50">
                    <PieChartIcon className="w-8 h-8 mb-2 text-jurunense-primary" />
                    <span className="font-semibold text-jurunense-primary">Análise Estatística</span>
                    <span className="text-xs text-gray-600">Gráficos e métricas</span>
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