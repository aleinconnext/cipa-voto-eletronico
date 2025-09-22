# 🗳️ Service de Votação - Documentação

## 📋 Visão Geral

O `VotingService` é responsável por gerenciar todo o processo de votação, incluindo validação de funcionários, registro de votos e estatísticas. Ele se integra com a API da Jurunense para validar funcionários ativos.

## 🔧 Funcionalidades

### 1. **Validação de Funcionário**
```typescript
const result = await votingService.validarFuncionario('51674645287');
if (result.success) {
  console.log('Funcionário validado:', result.funcionario);
} else {
  console.error('Erro:', result.message);
}
```

### 2. **Registro de Voto**
```typescript
const result = await votingService.registrarVoto('51674645287', '10');
if (result.success) {
  console.log('Voto registrado:', result.voto);
}
```

### 3. **Busca de Candidatos**
```typescript
const candidato = votingService.buscarCandidato('10');
if (candidato) {
  console.log('Candidato encontrado:', candidato);
}
```

### 4. **Estatísticas**
```typescript
const stats = votingService.obterEstatisticas();
console.log('Total de votos:', stats.totalVotos);
console.log('Votos por candidato:', stats.votosPorCandidato);
```

## 🌐 Integração com API

### Endpoint de Validação
- **URL**: `https://totvs-tbc.jurunense.com/data-server/read-view`
- **Método**: POST
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer [TOKEN]`

### Payload de Validação
```json
{
  "DataServerName": "FopFuncData",
  "Filtro": "CPF='51674645287' AND CODSITUACAO='A'",
  "Contexto": "CODSISTEMA=G;CODCOLIGADA=1;CODUSUARIO=ALESSANDRO"
}
```

## 🔄 Fluxo de Votação

1. **Validação do CPF**
   - Remove formatação
   - Valida algoritmo do CPF
   - Busca funcionário na API
   - Verifica se já votou

2. **Seleção do Candidato**
   - Busca candidato pelo código
   - Valida se candidato existe

3. **Registro do Voto**
   - Valida funcionário novamente
   - Valida candidato
   - Registra voto localmente
   - Gera ID único e timestamp

4. **Reinício do Processo**
   - Limpa dados do eleitor atual
   - Volta para tela de validação

## 📊 Estrutura de Dados

### Funcionario
```typescript
interface Funcionario {
  CODFUNCIONARIO: string;
  NOMEFUNCIONARIO: string;
  CPF: string;
  CODSITUACAO: string;
  DATANASCIMENTO: string;
  CODSETOR: string;
  NOMESETOR: string;
  CODCARGO: string;
  NOMECARGO: string;
}
```

### Voto
```typescript
interface Voto {
  id: string;
  cpf: string;
  codigoFuncionario: string;
  codigoCandidato: string;
  dataVoto: string;
  ip: string;
  userAgent: string;
}
```

### Candidato
```typescript
interface Candidato {
  codigo: string;
  nome: string;
  departamento: string;
  foto?: string;
}
```

## 🎯 Candidatos Disponíveis

| Código | Nome | Departamento |
|--------|------|--------------|
| 10 | MARIA SILVA SANTOS | Produção |
| 20 | JOÃO CARLOS OLIVEIRA | Administração |
| 30 | ANA PAULA FERREIRA | Qualidade |
| 40 | PEDRO HENRIQUE LIMA | TI |
| 50 | FERNANDA COSTA RODRIGUES | RH |

## 🔒 Segurança

- **Validação de CPF**: Algoritmo oficial brasileiro
- **Verificação de Duplicidade**: Impede voto duplo
- **Timeout de API**: 10 segundos
- **Logs de Auditoria**: IP, User-Agent, timestamp

## 🚀 Uso nos Componentes

### VoterValidation
```typescript
const result = await votingService.validarFuncionario(cpf);
if (!result.success) {
  setError(result.message);
  return;
}
```

### VotingInterface
```typescript
const candidato = votingService.buscarCandidato(codigo);
const result = await votingService.registrarVoto(cpf, codigoCandidato);
```

### Admin
```typescript
const stats = votingService.obterEstatisticas();
// Usa stats.totalVotos, stats.votosPorCandidato, etc.
```

## 🧪 Testes

### CPF de Teste
- **Válido**: `51674645287`
- **Formato**: Aceita com ou sem formatação

### Cenários de Teste
1. ✅ CPF válido e funcionário ativo
2. ❌ CPF inválido
3. ❌ Funcionário inativo
4. ❌ Funcionário já votou
5. ✅ Candidato válido
6. ❌ Candidato inexistente

## 🔧 Configuração

### Variáveis de Ambiente
```env
VOTING_API_URL=https://totvs-tbc.jurunense.com
VOTING_AUTH_TOKEN=QUxFU1NBTkRSTzo1MTY3NDY0NTI4NzoxNzU2NTU2NTI5OTYyOjBmOGIxOTdmNGM0YWVkNzNkYzdiZjY5NGM0OWRjNWQ1Mzc5ZGNiZTgwYzc1YTZmMDI5MjIyNmZmYThiOTIzOGY=
```

### Timeout e Retry
- **Timeout**: 10 segundos
- **Retry**: Não implementado (pode ser adicionado)
- **Fallback**: Dados locais em caso de erro

## 📝 Logs e Debug

### Console Logs
```typescript
// Ativar logs detalhados
console.log('Validando funcionário:', cpf);
console.log('Resultado da validação:', result);
console.log('Voto registrado:', voto);
```

### Tratamento de Erros
```typescript
try {
  const result = await votingService.validarFuncionario(cpf);
} catch (error) {
  console.error('Erro na validação:', error);
  // Tratar erro de rede, timeout, etc.
}
```

## 🔄 Próximas Melhorias

1. **Persistência**: Salvar votos em banco de dados
2. **API de Votos**: Endpoint para registrar votos na API
3. **Cache**: Cache de funcionários validados
4. **Retry Logic**: Tentativas automáticas em caso de erro
5. **Auditoria**: Logs mais detalhados de auditoria
6. **Validação de Data**: Verificar data de nascimento do funcionário

---

**⚠️ Nota**: Este service está configurado para ambiente de desenvolvimento. Em produção, ajuste as URLs e tokens de autenticação conforme necessário.
