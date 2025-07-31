# 🗳️ Guia de Teste da Urna Eletrônica CIPA

## 📋 Dados de Teste Disponíveis

### 👥 Eleitores Cadastrados
Use qualquer um destes CPFs para testar:

| CPF | Nome | Data de Nascimento | Departamento |
|-----|------|-------------------|--------------|
| `111.444.777-35` | CARLOS EDUARDO SILVA | 15/03/1985 | Produção |
| `222.555.888-46` | JULIANA MARTINS SANTOS | 22/07/1990 | Administração |
| `333.666.999-57` | ROBERTO ALMEIDA COSTA | 08/11/1988 | Qualidade |
| `444.777.000-68` | PATRICIA FERREIRA LIMA | 30/04/1992 | TI |
| `555.888.111-79` | MARCOS ANTONIO RODRIGUES | 12/09/1987 | RH |

### 🏛️ Candidatos Disponíveis
Use qualquer um destes números para votar:

| Número | Nome | Departamento |
|--------|------|--------------|
| `10` | MARIA SILVA SANTOS | Produção |
| `20` | JOÃO CARLOS OLIVEIRA | Administração |
| `30` | ANA PAULA FERREIRA | Qualidade |
| `40` | PEDRO HENRIQUE LIMA | TI |
| `50` | FERNANDA COSTA RODRIGUES | RH |

## 🎯 Como Testar

### 1. **Iniciar a Aplicação**
```bash
npm run dev
# ou
yarn dev
# ou
bun dev
```

### 2. **Processo de Votação**

#### **Passo 1: Validação do Eleitor**
1. Digite um CPF válido da lista acima (ex: `11144477735`)
2. Digite a data de nascimento correspondente (ex: `15031985`)
3. Clique em **CONFIRMA**

#### **Passo 2: Votação**
1. Digite o número do candidato desejado (ex: `10`)
2. Confirme se o candidato correto aparece na tela
3. Clique em **CONFIRMA** para confirmar o voto
4. Na tela de confirmação, clique em **CONFIRMA** novamente

#### **Passo 3: Finalização**
1. Após o voto ser registrado, você verá a tela de sucesso
2. O sistema automaticamente retorna à tela inicial após 5 segundos
3. Para testar novamente, use um CPF diferente

### 3. **Funcionalidades de Som**

- **Teclas numéricas**: Som de beep sintético
- **Botão CONFIRMA**: Som do arquivo `inter.mp3`
- **Botão FINALIZAR VOTAÇÃO**: Som do arquivo `fim.mp3`
- **Erro de validação**: Som de erro sintético
- **Voto registrado**: Som do arquivo `fim.mp3`

### 4. **Cenários de Teste**

#### ✅ **Cenários Válidos**
- Votar com CPF válido e data correta
- Escolher candidato válido
- Confirmar voto
- Finalizar votação

#### ❌ **Cenários de Erro**
- CPF inválido
- CPF não cadastrado
- Data de nascimento incorreta
- Eleitor que já votou
- Número de candidato inválido

### 5. **Verificação dos Dados**

Para verificar se o voto foi registrado, abra o **Console do Navegador** (F12) e procure por mensagens como:
```
Voto registrado: Eleitor CARLOS EDUARDO SILVA votou no candidato 10
```

### 6. **Reset dos Dados**

Para resetar os dados de votação (permitir que um eleitor vote novamente), recarregue a página ou reinicie a aplicação.

## 🔧 Configuração dos Sons

Os sons estão configurados na pasta `src/assets/sons/`:
- `inter.mp3` - Som do botão confirmar
- `fim.mp3` - Som do botão finalizar e sucesso
- Sons sintéticos - Para teclas numéricas e erros

## 📊 Estatísticas

Para ver as estatísticas da votação, use a função `getVotingStats()` no console:
```javascript
// No console do navegador
import { getVotingStats } from './src/data/mockData';
console.log(getVotingStats());
```

## 🎮 Controles

- **Teclado numérico**: Digite números
- **CORRIGE**: Apaga o último dígito
- **CONFIRMA**: Confirma a ação atual
- **FINALIZAR VOTAÇÃO**: Volta para a tela inicial

---

**⚠️ Nota**: Este é um sistema de teste com dados mockados. Em produção, os dados viriam de um banco de dados real. 