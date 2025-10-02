# 🐛 Guia de Debug - Sistema de Votação

## 📋 Visão Geral

Este guia explica como debugar o sistema de votação usando os logs detalhados implementados no console do navegador.

## 🔍 Logs Implementados

### 1. **VotingService** - Logs Principais

#### Validação de Funcionário
```
🔍 [VOTING SERVICE] Iniciando validação de funcionário...
📝 [VOTING SERVICE] CPF recebido: 516.746.452-87
🧹 [VOTING SERVICE] CPF limpo: 51674645287
🔢 [VOTING SERVICE] Validando algoritmo do CPF...
✅ [VOTING SERVICE] CPF válido pelo algoritmo
🌐 [VOTING SERVICE] Enviando requisição para API...
📤 [VOTING SERVICE] Payload: { ... }
🔗 [VOTING SERVICE] URL: https://totvs-tbc.jurunense.com/data-server/read-view
📥 [VOTING SERVICE] Resposta da API recebida
📊 [VOTING SERVICE] Status: 200
📋 [VOTING SERVICE] Dados: { ... }
✅ [VOTING SERVICE] Funcionário encontrado na API
👤 [VOTING SERVICE] Dados do funcionário: { ... }
🗳️ [VOTING SERVICE] Verificando se funcionário já votou...
🔍 [VOTING SERVICE] Já votou? false
✅ [VOTING SERVICE] Funcionário validado com sucesso!
```

#### Busca de Candidato
```
🎯 [VOTING SERVICE] Buscando candidato com código: 10
✅ [VOTING SERVICE] Candidato encontrado: { ... }
```

#### Registro de Voto
```
🗳️ [VOTING SERVICE] Iniciando registro de voto...
📝 [VOTING SERVICE] CPF: 51674645287
🎯 [VOTING SERVICE] Código do candidato: 10
🔍 [VOTING SERVICE] Revalidando funcionário...
✅ [VOTING SERVICE] Revalidação bem-sucedida
🎯 [VOTING SERVICE] Buscando candidato...
✅ [VOTING SERVICE] Candidato encontrado: { ... }
📝 [VOTING SERVICE] Criando objeto de voto...
📋 [VOTING SERVICE] Voto criado: { ... }
💾 [VOTING SERVICE] Adicionando voto à lista local...
📊 [VOTING SERVICE] Total de votos agora: 1
✅ [VOTING SERVICE] Voto registrado com sucesso!
```

### 2. **VoterValidation** - Logs de Interface

```
🔍 [VOTER VALIDATION] Iniciando validação de CPF...
✅ [VOTER VALIDATION] Validação bem-sucedida, mudando para data de nascimento
✅ [VOTER VALIDATION] Validação completa, prosseguindo para votação
```

### 3. **VotingInterface** - Logs de Votação

```
🗳️ [VOTING INTERFACE] Iniciando registro de voto...
📝 [VOTING INTERFACE] CPF: 51674645287
🎯 [VOTING INTERFACE] Candidato: 10
✅ [VOTING INTERFACE] Voto registrado com sucesso: { ... }
```

## 🚨 Logs de Erro

### Erro de Validação
```
❌ [VOTING SERVICE] CPF deve ter 11 dígitos. Atual: 10
❌ [VOTING SERVICE] CPF inválido pelo algoritmo
❌ [VOTING SERVICE] API retornou Success: false
❌ [VOTING SERVICE] Nenhum funcionário encontrado na API
❌ [VOTING SERVICE] Funcionário já votou anteriormente
```

### Erro de Rede
```
💥 [VOTING SERVICE] Erro ao validar funcionário: Error
🔍 [VOTING SERVICE] Tipo do erro: object
📝 [VOTING SERVICE] Mensagem do erro: Network Error
🌐 [VOTING SERVICE] Erro de rede detectado
📊 [VOTING SERVICE] Status: 500
📋 [VOTING SERVICE] Dados do erro: { ... }
🔗 [VOTING SERVICE] URL: https://totvs-tbc.jurunense.com/data-server/read-view
```

## 🔧 Como Usar o Debug

### 1. **Abrir Console do Navegador**
- **Chrome/Edge**: F12 → Console
- **Firefox**: F12 → Console
- **Safari**: Cmd+Option+I → Console

### 2. **Filtrar Logs**
```
// Filtrar apenas logs do VotingService
console.log = (function(originalLog) {
  return function(...args) {
    if (args[0] && args[0].includes('[VOTING SERVICE]')) {
      originalLog.apply(console, args);
    }
  };
})(console.log);
```

### 3. **Logs por Categoria**
```
// Apenas logs de validação
console.log = (function(originalLog) {
  return function(...args) {
    if (args[0] && args[0].includes('🔍') || args[0].includes('✅') || args[0].includes('❌')) {
      originalLog.apply(console, args);
    }
  };
})(console.log);
```

## 📊 Estados de Loading

### 1. **Validação de CPF**
- **Estado**: `isLoading = true`
- **Visual**: Spinner azul com texto "Validando funcionário..."
- **Duração**: ~2-5 segundos (depende da API)

### 2. **Registro de Voto**
- **Estado**: `isLoading = true`
- **Visual**: Spinner azul com texto "Registrando voto..."
- **Duração**: ~1-3 segundos

## 🎯 Cenários de Teste

### 1. **CPF Válido e Funcionário Ativo**
```
1. Digite: 51674645287
2. Aguarde loading
3. Verifique logs de sucesso
4. Digite data de nascimento
5. Continue para votação
```

### 2. **CPF Inválido**
```
1. Digite: 12345678901
2. Aguarde loading
3. Verifique logs de erro
4. Mensagem de erro aparece
```

### 3. **Funcionário Já Votou**
```
1. Digite: 51674645287 (já votou)
2. Aguarde loading
3. Verifique logs de duplicidade
4. Mensagem "já votou" aparece
```

### 4. **Erro de Rede**
```
1. Desconecte internet
2. Digite CPF válido
3. Aguarde timeout
4. Verifique logs de erro de rede
5. Mensagem de erro genérica aparece
```

## 🔍 Troubleshooting

### Problema: Loading infinito
**Causa**: Erro na API não tratado
**Solução**: Verificar logs de erro no console

### Problema: CPF válido rejeitado
**Causa**: Funcionário inativo na API
**Solução**: Verificar logs da API response

### Problema: Voto não registrado
**Causa**: Erro na revalidação
**Solução**: Verificar logs de registro de voto

### Problema: Candidato não encontrado
**Causa**: Código inválido
**Solução**: Verificar logs de busca de candidato

## 📱 Teste em Dispositivos Móveis

### 1. **Chrome DevTools**
- F12 → Toggle device toolbar
- Selecionar dispositivo
- Testar em diferentes resoluções

### 2. **Logs em Mobile**
- Usar `console.log` no navegador mobile
- Ou conectar via USB debugging

## 🚀 Performance

### 1. **Tempos Esperados**
- **Validação CPF**: 2-5 segundos
- **Registro Voto**: 1-3 segundos
- **Busca Candidato**: < 100ms

### 2. **Otimizações**
- Cache de funcionários validados
- Retry automático em caso de erro
- Timeout configurável

## 📝 Logs Customizados

### Adicionar Log Personalizado
```typescript
console.log('🎯 [CUSTOM] Minha mensagem personalizada');
```

### Log com Dados Estruturados
```typescript
console.log('📊 [CUSTOM] Dados:', {
  timestamp: new Date().toISOString(),
  user: 'admin',
  action: 'vote',
  data: { ... }
});
```

---

**💡 Dica**: Use os emojis nos logs para identificar rapidamente o tipo de operação e facilitar o debug! 🎯
