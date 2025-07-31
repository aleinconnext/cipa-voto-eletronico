import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock data - em produção viria do Supabase
const mockResults = [
  { candidate: 'MARIA SILVA SANTOS', number: '10', votes: 45, percentage: 42.5 },
  { candidate: 'JOÃO CARLOS OLIVEIRA', number: '20', votes: 35, percentage: 33.0 },
  { candidate: 'ANA PAULA FERREIRA', number: '30', votes: 26, percentage: 24.5 }
];

const mockStats = {
  totalVoters: 150,
  votesCompleted: 106,
  votingProgress: 70.7,
  startTime: '08:00',
  endTime: '17:00',
  currentTime: '14:30'
};

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))'];

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Senha simples para demo - em produção seria mais segura
    if (password === 'admin2024') {
      setIsAuthenticated(true);
    } else {
      alert('Senha incorreta');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Área Administrativa</CardTitle>
            <CardDescription>Sistema de Apuração CIPA 2025</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Senha de Acesso:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="Digite a senha"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <Button onClick={handleLogin} className="w-full">
              Acessar Sistema
            </Button>
            <div className="text-center">
              <a href="/" className="text-primary hover:underline text-sm">
                Voltar para Votação
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Administração CIPA 2024</h1>
              <p className="text-muted-foreground">Sistema de Apuração e Monitoramento</p>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Eleitores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalVoters}</div>
              <p className="text-xs text-muted-foreground">Cadastrados no sistema</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Votos Computados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{mockStats.votesCompleted}</div>
              <p className="text-xs text-muted-foreground">
                {mockStats.votingProgress.toFixed(1)}% de participação
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Status da Votação</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="default" className="bg-primary">
                EM ANDAMENTO
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">
                {mockStats.startTime} às {mockStats.endTime}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Horário Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.currentTime}</div>
              <p className="text-xs text-muted-foreground">Último update: agora</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="results" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="results">Apuração</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="results" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Resultados Parciais */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Resultados Parciais</CardTitle>
                  <CardDescription>
                    Apuração em tempo real - {mockStats.votesCompleted} votos computados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockResults.map((result, index) => (
                      <div key={result.number} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                            {result.number}
                          </div>
                          <div>
                            <h3 className="font-semibold">{result.candidate}</h3>
                            <p className="text-sm text-muted-foreground">
                              {result.percentage}% dos votos válidos
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{result.votes}</div>
                          <div className="text-sm text-muted-foreground">votos</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Gráfico de Barras */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição de Votos</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockResults}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="number" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="votes" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Gráfico de Pizza */}
              <Card>
                <CardHeader>
                  <CardTitle>Percentual de Votos</CardTitle>
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
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Monitoramento em Tempo Real</CardTitle>
                <CardDescription>Acompanhe o progresso da votação</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progresso da Votação</span>
                      <span>{mockStats.votingProgress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all" 
                        style={{ width: `${mockStats.votingProgress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {mockStats.totalVoters - mockStats.votesCompleted}
                      </div>
                      <div className="text-sm text-muted-foreground">Ainda não votaram</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {mockStats.votesCompleted}
                      </div>
                      <div className="text-sm text-muted-foreground">Já votaram</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios e Exportação</CardTitle>
                <CardDescription>Gere relatórios completos da eleição</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <span className="text-lg mb-2">📊</span>
                    Relatório de Apuração
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <span className="text-lg mb-2">📋</span>
                    Lista de Eleitores
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <span className="text-lg mb-2">📈</span>
                    Análise Estatística
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <span className="text-lg mb-2">📄</span>
                    Ata de Apuração
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}