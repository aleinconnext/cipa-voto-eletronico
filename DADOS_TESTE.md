# 🗳️ Dados para Teste da Urna Eletrônica CIPA

## 📋 Dados de Eleitores (CPF + Data de Nascimento)

Para testar a validação de eleitores, use os seguintes dados:

### ✅ **Eleitores Válidos:**
- **CPF:** `123.456.789-09` | **Data:** `15/03/1985`
- **CPF:** `987.654.321-00` | **Data:** `22/07/1990`
- **CPF:** `456.789.123-45` | **Data:** `10/12/1988`
- **CPF:** `789.123.456-78` | **Data:** `05/09/1992`
- **CPF:** `321.654.987-01` | **Data:** `30/11/1987`

## 👥 Candidatos Disponíveis

### **Número 10 - MARIA SILVA SANTOS**
- **Cargo:** Representante dos Funcionários
- **Departamento:** Produção
- **Número para votar:** `10`

### **Número 20 - JOÃO CARLOS OLIVEIRA**
- **Cargo:** Representante dos Funcionários
- **Departamento:** Administração
- **Número para votar:** `20`

### **Número 30 - ANA PAULA FERREIRA**
- **Cargo:** Representante dos Funcionários
- **Departamento:** Qualidade
- **Número para votar:** `30`

## 🧪 Como Testar

### 1. **Acesso à Urna**
- Abra o navegador em `/`
- A tela inicial da urna aparecerá

### 2. **Validação do Eleitor**
- Digite um dos CPFs válidos acima
- Digite a data de nascimento correspondente
- Clique em "CONTINUAR"

### 3. **Votação**
- Digite o número do candidato (10, 20 ou 30)
- Veja os dados do candidato aparecerem
- Clique em "CONFIRMA" para confirmar
- Clique em "CONFIRMA" novamente para finalizar

### 4. **Administração**
- Acesse `/admin`
- **Senha:** `admin2024`
- Veja os votos registrados e estatísticas

## 🔊 Sons Implementados

- **Som de tecla:** Beep ao pressionar números
- **Som de confirmação:** Som oficial do TSE (inter.mp3)
- **Som de finalização:** Som oficial do TSE (fim.mp3)
- **Som de erro:** Beep grave para número inválido

## ⚠️ Observações

- CPFs inválidos serão rejeitados pela validação
- Números de candidatos inexistentes mostrarão erro
- O sistema previne votação duplicada por CPF
- Todos os dados são simulados para demonstração