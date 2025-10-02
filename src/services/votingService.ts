import axios from 'axios';
import { databaseService } from './databaseService';

// Interfaces para tipagem
export interface Funcionario {
  CODCOLIGADA: string;
  CODPESSOA: string;
  CHAPA: string;
  CODRECEBIMENTO: string;
  CODSITUACAO: string;
  CODTIPO: string;
  CODSECAO: string;
  CODFUNCAO: string;
  SALARIO: string;
  DATAADMISSAO: string;
  HORA: string;
  NOME: string;
  IDADE: string;
  TELEFONE1: string;
  SEXO: string;
  CODGRPQUIOSQUE: string;
  NOME_FUNCAO: string;
  NOME_SECAO: string;
  CODCOLIGADAORIGEM: string;
  CHAPAORIGEM: string;
  CODHORARIO: string;
  RECCREATEDBY: string;
  RECCREATEDON: string;
  RECMODIFIEDBY: string;
  RECMODIFIEDON: string;
  CODFILIAL: string;
  CODIGORECEITA3533: string;
  CPF: string;
  JORNADA_MENSAL: string;
  DESCRICAOHORARIO: string;
  DESCRICAOSITUACAO: string;
  DESCRICAOSECAO: string;
  NOMEFILIAL: string;
  DTNASCIMENTO: string;
  DESCRICAOTIPORECEB: string;
  DESCRICAOTIPOFUNC: string;
  NOMEDEPARTAMENTO: string;
  CODCATEGORIAESOCIAL: string;
  UTILIZAPONTO: string;
  TEMPODECASA: string;
}

export interface FuncionarioResponse {
  success: boolean;
  message: string;
  user: string;
  timestamp: string;
  data: {
    PFunc: Funcionario;
  };
  operation: string;
}

export interface Voto {
  id: string;
  cpf: string;
  codigoFuncionario: string;
  codigoCandidato: string;
  dataVoto: string;
  ip: string;
  userAgent: string;
}

export interface VotoResponse {
  Success: boolean;
  Message: string;
  Data?: Voto;
}

export interface Candidato {
  codigo: string;
  nome: string;
  departamento: string;
  foto?: string;
}

export interface PayloadVoto {
  CODCOLIGADA: string;
  CODCOMISSAO: string;
  CODELEICAO: string;
  CODVOTO: string;
  CODCANDIDATO: string;
  CODUSUARIO: string;
  DATA: string;
  VOTOS: string;
  JUSTIFICATIVA: string;
  NOMEUSUARIO: string;
  EMBRANCO: string;
}

interface CandidatoAPI {
  CHAPA: string;
  NOME: string;
  CODPESSOA?: string;
  CODCOLIGADA?: string;
  CODCOMISSAO?: string;
  CODELEICAO?: string;
  DESCORIGEM?: string;
  DTCANDIDATURA?: string;
  IDINSCRICAO?: string;
  NUMVOTOS?: string;
  ORIGEMPORTAL?: string;
  FOTO?: string;
  DEPARTAMENTO?: string;
}

// Configuração base da API
const API_BASE_URL = 'https://totvs-tbc.jurunense.com';
const AUTH_TOKEN = 'QUxFU1NBTkRSTzo1MTY3NDY0NTI4NzoxNzU2NTU2NTI5OTYyOjBmOGIxOTdmNGM0YWVkNzNkYzdiZjY5NGM0OWRjNWQ1Mzc5ZGNiZTgwYzc1YTZmMDI5MjIyNmZmYThiOTIzOGY=';
const API_CONTEXT = 'CODSISTEMA=G;CODCOLIGADA=1;CODUSUARIO=ALESSANDRO';

// Mapeamento de CODCOLIGADA para CODCOMISSAO
const MAPEAMENTO_COLIGADA_COMISSAO = {
  '1': '03',
  '2': '202503', 
  '3': '03',
  '4': '03'
} as const;

const DATA_SERVER_CONFIG = {
  candidatos: {
    nome: 'SmtCandidatosCipaData'
  }
} as const;

// Instância do axios configurada
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${AUTH_TOKEN}`
  },
  timeout: 10000
});

class VotingService {
  private votos: Voto[] = [];
  private candidatos: Candidato[] = [];
  private candidatosCarregados = false;
  private carregamentoCandidatos: Promise<void> | null = null;
  private funcionarioAtual: Funcionario | null = null;

  constructor() {
    // Não carrega candidatos no construtor - será carregado quando necessário com CODCOLIGADA
    // Inicializar conexão com banco de dados
    this.inicializarBancoDados();
  }

  /**
   * Inicializa a conexão com o banco de dados
   */
  private async inicializarBancoDados(): Promise<void> {
    try {
      console.log('🔌 [VOTING SERVICE] Inicializando conexão com banco de dados...');
      await databaseService.initialize();
      console.log('✅ [VOTING SERVICE] Conexão com banco de dados inicializada');
    } catch (error) {
      console.error('💥 [VOTING SERVICE] Erro ao inicializar banco de dados:', error);
      // Não falha a inicialização do serviço se o banco não estiver disponível
    }
  }

  private iniciarCarregamentoCandidatos(codColigada: string): void {
    if (!this.carregamentoCandidatos) {
      this.carregamentoCandidatos = this.carregarCandidatosDaAPI(codColigada)
        .catch(error => {
          console.error('💥 [VOTING SERVICE] Falha ao carregar candidatos na inicialização:', error);
        })
        .finally(() => {
          this.carregamentoCandidatos = null;
        });
    }
  }

  private async garantirCandidatosCarregados(codColigada: string): Promise<void> {
    if (this.candidatosCarregados) {
      return;
    }

    if (!codColigada) {
      throw new Error('CODCOLIGADA é obrigatória para carregar candidatos');
    }

    this.iniciarCarregamentoCandidatos(codColigada);

    if (this.carregamentoCandidatos) {
      await this.carregamentoCandidatos;
    }
  }

  private mapearCandidatoDaAPI(candidato: CandidatoAPI): Candidato | null {
    const codigo = candidato.CHAPA?.trim();
    const nome = candidato.NOME?.trim();

    if (!codigo || !nome) {
      console.warn('⚠️ [VOTING SERVICE] Candidato ignorado por ausência de código ou nome:', candidato);
      return null;
    }

    const departamento = candidato.DEPARTAMENTO?.trim() || candidato.CODPESSOA?.trim() || 'Não informado';

    return {
      codigo,
      nome,
      departamento,
      foto: candidato.FOTO?.trim() || undefined
    };
  }

  private async carregarCandidatosDaAPI(codColigada: string): Promise<void> {
    console.log('🌐 [VOTING SERVICE] Carregando candidatos da API...');

    if (!codColigada) {
      throw new Error('CODCOLIGADA é obrigatória para carregar candidatos');
    }

    const filtro = this.gerarFiltroCandidatos(codColigada);

    const payload = {
      DataServerName: DATA_SERVER_CONFIG.candidatos.nome,
      Filtro: filtro,
      Contexto: API_CONTEXT
    };

    try {
      console.log('📤 [VOTING SERVICE] Payload candidatos:', JSON.stringify(payload, null, 2));
      const response = await apiClient.post('/data-server/read-view', JSON.stringify(payload));
      console.log('📥 [VOTING SERVICE] Resposta candidatos recebida:', response.status);

      const resultado = response.data;

      if (!resultado?.success) {
        const mensagem = resultado?.message || 'Resposta da API sem sucesso';
        console.error('❌ [VOTING SERVICE] API de candidatos retornou erro:', mensagem);
        throw new Error('Não foi possível carregar os candidatos.');
      }

      const listaCandidatos: CandidatoAPI[] = resultado?.data?.VCANDIDATOSCIPA || [];

      if (!Array.isArray(listaCandidatos) || listaCandidatos.length === 0) {
        console.warn('⚠️ [VOTING SERVICE] Nenhum candidato retornado pela API.');
        this.candidatos = [];
        this.candidatosCarregados = true;
        return;
      }

      const candidatosMapeados = listaCandidatos
        .map(c => this.mapearCandidatoDaAPI(c))
        .filter((candidato): candidato is Candidato => candidato !== null);

      this.candidatos = candidatosMapeados;
      this.candidatosCarregados = true;

      console.log('✅ [VOTING SERVICE] Candidatos carregados:', this.candidatos.length);
    } catch (error) {
      console.error('💥 [VOTING SERVICE] Erro ao carregar candidatos da API:', error);
      this.candidatosCarregados = false;
      throw error;
    }
  }

  async obterCandidatos(codColigada: string): Promise<Candidato[]> {
    await this.garantirCandidatosCarregados(codColigada);
    return this.candidatos;
  }

  async atualizarCandidatos(codColigada: string): Promise<Candidato[]> {
    this.candidatosCarregados = false;
    await this.carregarCandidatosDaAPI(codColigada);
    return this.candidatos;
  }

  /**
   * Define o funcionário atual (após validação)
   */
  definirFuncionarioAtual(funcionario: Funcionario): void {
    this.funcionarioAtual = funcionario;
    console.log('👤 [VOTING SERVICE] Funcionário atual definido:', funcionario.NOME);
  }

  /**
   * Obtém o funcionário atual
   */
  obterFuncionarioAtual(): Funcionario | null {
    return this.funcionarioAtual;
  }

  /**
   * Testa a conexão com o banco de dados
   */
  async testarConexaoBanco(): Promise<{ success: boolean; message: string }> {
    console.log('🧪 [VOTING SERVICE] Testando conexão com banco de dados...');
    return await databaseService.testarConexao();
  }

  /**
   * Verifica se a tabela de votos existe
   */
  async verificarTabelaVotos(): Promise<{ success: boolean; message: string; existe: boolean }> {
    console.log('🔍 [VOTING SERVICE] Verificando tabela de votos...');
    return await databaseService.verificarTabelaVotos();
  }

  /**
   * Limpa todos os dados após votação finalizada
   */
  limparDadosAposVotacao(): void {
    console.log('🧹 [VOTING SERVICE] ===== LIMPANDO DADOS APÓS VOTAÇÃO =====');
    console.log('🔍 [VOTING SERVICE] Estado antes da limpeza:');
    console.log('🔍 [VOTING SERVICE] - funcionarioAtual:', this.funcionarioAtual ? 'EXISTE' : 'NULL');
    console.log('🔍 [VOTING SERVICE] - candidatos.length:', this.candidatos.length);
    console.log('🔍 [VOTING SERVICE] - candidatosCarregados:', this.candidatosCarregados);
    console.log('🔍 [VOTING SERVICE] - votos.length:', this.votos.length);
    
    // Limpar funcionário atual
    this.funcionarioAtual = null;
    console.log('👤 [VOTING SERVICE] Funcionário atual limpo');
    
    // Limpar cache de candidatos
    this.candidatos = [];
    this.candidatosCarregados = false;
    this.carregamentoCandidatos = null;
    console.log('🎯 [VOTING SERVICE] Cache de candidatos limpo');
    
    // Limpar votos registrados
    this.votos = [];
    console.log('🗳️ [VOTING SERVICE] Lista de votos limpa');
    
    console.log('🔍 [VOTING SERVICE] Estado após limpeza:');
    console.log('🔍 [VOTING SERVICE] - funcionarioAtual:', this.funcionarioAtual ? 'EXISTE' : 'NULL');
    console.log('🔍 [VOTING SERVICE] - candidatos.length:', this.candidatos.length);
    console.log('🔍 [VOTING SERVICE] - candidatosCarregados:', this.candidatosCarregados);
    console.log('🔍 [VOTING SERVICE] - votos.length:', this.votos.length);
    
    console.log('✅ [VOTING SERVICE] ===== LIMPEZA COMPLETA REALIZADA =====');
  }

  /**
   * Limpa apenas os dados do funcionário atual
   */
  limparFuncionarioAtual(): void {
    console.log('👤 [VOTING SERVICE] Limpando dados do funcionário atual...');
    this.funcionarioAtual = null;
    console.log('✅ [VOTING SERVICE] Funcionário atual limpo');
  }

  /**
   * Limpa apenas o cache de candidatos
   */
  limparCacheCandidatos(): void {
    console.log('🎯 [VOTING SERVICE] Limpando cache de candidatos...');
    this.candidatos = [];
    this.candidatosCarregados = false;
    this.carregamentoCandidatos = null;
    console.log('✅ [VOTING SERVICE] Cache de candidatos limpo');
  }

  /**
   * Envia voto para a API
   */
  async enviarVoto(candidato: Candidato, funcionario?: Funcionario): Promise<{ success: boolean; message: string }> {
    console.log('🗳️ [VOTING SERVICE] ===== INICIANDO PROCESSO DE VOTO =====');
    console.log('🗳️ [VOTING SERVICE] Enviando voto...');
    
    // Usar funcionário fornecido ou o funcionário atual
    const funcionarioParaVoto = funcionario || this.funcionarioAtual;
    
    if (!funcionarioParaVoto) {
      console.error('❌ [VOTING SERVICE] Funcionário não encontrado para registro do voto');
      throw new Error('Funcionário não encontrado para registro do voto');
    }
    
    console.log('👤 [VOTING SERVICE] Funcionário:', funcionarioParaVoto.NOME);
    console.log('🏢 [VOTING SERVICE] CODCOLIGADA do funcionário:', funcionarioParaVoto.CODCOLIGADA);
    console.log('🎯 [VOTING SERVICE] Candidato:', candidato.nome);
    console.log('🎯 [VOTING SERVICE] Código do candidato:', candidato.codigo);

    try {
      // Buscar dados completos do candidato na API para obter CODPESSOA
      console.log('🔍 [VOTING SERVICE] Buscando dados completos do candidato na API...');
      console.log('🔍 [VOTING SERVICE] CODCOLIGADA para busca:', funcionarioParaVoto.CODCOLIGADA);
      
      const candidatosAPI = await this.buscarCandidatosCompletosDaAPI(funcionarioParaVoto.CODCOLIGADA);
      console.log('📋 [VOTING SERVICE] Candidatos encontrados na API:', candidatosAPI.length);
      
      const candidatoCompleto = candidatosAPI.find(c => c.CHAPA === candidato.codigo);
      
      if (!candidatoCompleto) {
        console.error('❌ [VOTING SERVICE] Candidato não encontrado na API');
        console.error('❌ [VOTING SERVICE] CHAPA buscada:', candidato.codigo);
        console.error('❌ [VOTING SERVICE] CHAPAs disponíveis:', candidatosAPI.map(c => c.CHAPA));
        throw new Error('Candidato não encontrado na API');
      }
      
      console.log('✅ [VOTING SERVICE] Candidato encontrado na API:');
      console.log('✅ [VOTING SERVICE] CHAPA:', candidatoCompleto.CHAPA);
      console.log('✅ [VOTING SERVICE] NOME:', candidatoCompleto.NOME);
      console.log('✅ [VOTING SERVICE] CODPESSOA:', candidatoCompleto.CODPESSOA);

      // Gerar CODVOTO único (timestamp)
      const codVoto = Date.now().toString();
      console.log('🔢 [VOTING SERVICE] CODVOTO gerado:', codVoto);
      
      // Data atual no formato ISO
      const dataAtual = new Date().toISOString();
      console.log('📅 [VOTING SERVICE] Data atual:', dataAtual);

      console.log('📝 [VOTING SERVICE] Montando payload do voto...');
      const payload: PayloadVoto = {
        CODCOLIGADA: funcionarioParaVoto.CODCOLIGADA || '2',
        CODCOMISSAO: candidatoCompleto.CODCOMISSAO || '03', // Usando CODCOMISSAO do candidato
        CODELEICAO: candidatoCompleto.CODELEICAO || '03', // Usando CODELEICAO do candidato
        CODVOTO: codVoto,
        CODCANDIDATO: candidatoCompleto.CODPESSOA || candidato.codigo, // Usando CODPESSOA do candidato
        CODUSUARIO: funcionarioParaVoto.CODPESSOA || 'alessandro',
        DATA: dataAtual,
        VOTOS: '1',
        JUSTIFICATIVA: 'MANUAL',
        NOMEUSUARIO: funcionarioParaVoto.NOME || 'Alessandro Gonçalves',
        EMBRANCO: 'false'
      };

      console.log('📤 [VOTING SERVICE] Payload completo montado:');
      console.log('📤 [VOTING SERVICE] CODCOLIGADA:', payload.CODCOLIGADA);
      console.log('📤 [VOTING SERVICE] CODCOMISSAO:', payload.CODCOMISSAO);
      console.log('📤 [VOTING SERVICE] CODELEICAO:', payload.CODELEICAO);
      console.log('📤 [VOTING SERVICE] CODVOTO:', payload.CODVOTO);
      console.log('📤 [VOTING SERVICE] CODCANDIDATO:', payload.CODCANDIDATO);
      console.log('📤 [VOTING SERVICE] CODUSUARIO:', payload.CODUSUARIO);
      console.log('📤 [VOTING SERVICE] DATA:', payload.DATA);
      console.log('📤 [VOTING SERVICE] VOTOS:', payload.VOTOS);
      console.log('📤 [VOTING SERVICE] JUSTIFICATIVA:', payload.JUSTIFICATIVA);
      console.log('📤 [VOTING SERVICE] NOMEUSUARIO:', payload.NOMEUSUARIO);
      console.log('📤 [VOTING SERVICE] EMBRANCO:', payload.EMBRANCO);

      // Inserir voto diretamente no banco de dados
      console.log('🗳️ [VOTING SERVICE] Inserindo voto diretamente no banco de dados...');
      
      const dadosVoto = {
        CODCOLIGADA: payload.CODCOLIGADA,
        CODCOMISSAO: payload.CODCOMISSAO,
        CODELEICAO: payload.CODELEICAO,
        CODCANDIDATO: payload.CODCANDIDATO,
        CODUSUARIO: payload.CODUSUARIO
      };

      console.log('📊 [VOTING SERVICE] Dados para inserção:', JSON.stringify(dadosVoto, null, 2));

      const resultado = await databaseService.inserirVoto(dadosVoto);
      
      console.log('📥 [VOTING SERVICE] Resultado da inserção:', JSON.stringify(resultado, null, 2));

      if (!resultado.success) {
        const mensagem = resultado.message || 'Erro ao inserir voto no banco';
        console.error('❌ [VOTING SERVICE] Erro na inserção:', mensagem);
        throw new Error(mensagem);
      }

      console.log('✅ [VOTING SERVICE] Voto inserido com sucesso no banco de dados!');
      console.log('🎯 [VOTING SERVICE] CODVOTO gerado:', resultado.codVoto);
      console.log('🗳️ [VOTING SERVICE] ===== PROCESSO DE VOTO CONCLUÍDO COM SUCESSO =====');
      
      // Limpar todos os dados após votação bem-sucedida
      this.limparDadosAposVotacao();
      
      return {
        success: true,
        message: resultado.message || 'Voto registrado com sucesso'
      };

    } catch (error) {
      console.error('💥 [VOTING SERVICE] Erro ao enviar voto:', error);
      return {
        success: false,
        message: 'Erro ao registrar voto'
      };
    }
  }

  /**
   * Gera filtro dinâmico baseado na CODCOLIGADA
   */
  private gerarFiltroCandidatos(codColigada: string): string {
    const codComissao = MAPEAMENTO_COLIGADA_COMISSAO[codColigada as keyof typeof MAPEAMENTO_COLIGADA_COMISSAO];
    
    if (!codComissao) {
      throw new Error(`CODCOLIGADA ${codColigada} não está mapeada. CODCOLIGADAs válidas: ${Object.keys(MAPEAMENTO_COLIGADA_COMISSAO).join(', ')}`);
    }
    
    const filtro = `CODCOMISSAO='${codComissao}' AND CODCOLIGADA='${codColigada}'`;
    console.log(`🔍 [VOTING SERVICE] Filtro gerado para CODCOLIGADA ${codColigada}:`, filtro);
    
    return filtro;
  }

  /**
   * Busca candidatos completos da API (incluindo CODPESSOA)
   */
  private async buscarCandidatosCompletosDaAPI(codColigada: string): Promise<CandidatoAPI[]> {
    if (!codColigada) {
      throw new Error('CODCOLIGADA é obrigatória para buscar candidatos');
    }

    const filtro = this.gerarFiltroCandidatos(codColigada);
    
    const payload = {
      DataServerName: DATA_SERVER_CONFIG.candidatos.nome,
      Filtro: filtro,
      Contexto: API_CONTEXT
    };

    const response = await apiClient.post('/data-server/read-view', JSON.stringify(payload));
    const resultado = response.data;

    if (!resultado?.success) {
      throw new Error('Erro ao buscar candidatos completos');
    }

    return resultado?.data?.VCANDIDATOSCIPA || [];
  }

  /**
   * Valida data de nascimento do funcionário
   */
  async validarDataNascimento(cpf: string, dataNascimento: string): Promise<{ success: boolean; funcionario?: Funcionario; message: string }> {
    console.log('🔍 [VOTING SERVICE] Iniciando validação de data de nascimento...');
    console.log('📝 [VOTING SERVICE] CPF:', cpf);
    console.log('📅 [VOTING SERVICE] Data de nascimento:', dataNascimento);
    
    try {
      // Remove formatação do CPF
      const cpfLimpo = cpf.replace(/\D/g, '');
      
      if (cpfLimpo.length !== 11) {
        console.log('❌ [VOTING SERVICE] CPF deve ter 11 dígitos. Atual:', cpfLimpo.length);
        return { success: false, message: 'CPF deve ter 11 dígitos' };
      }

      // Valida CPF
      console.log('🔢 [VOTING SERVICE] Validando algoritmo do CPF...');
      if (!this.validarCPF(cpfLimpo)) {
        console.log('❌ [VOTING SERVICE] CPF inválido pelo algoritmo');
        return { success: false, message: 'CPF inválido' };
      }
      console.log('✅ [VOTING SERVICE] CPF válido pelo algoritmo');

      // Formata data para o formato da API (YYYY-MM-DD)
      const dataFormatada = this.formatarDataParaAPI(dataNascimento);
      console.log('📅 [VOTING SERVICE] Data formatada para API:', dataFormatada);

      // Busca funcionário na API com CPF e data de nascimento
      const payload = {
        "DataServerName": "FopFuncData",
        "Filtro": `CPF='${cpfLimpo}' AND DTNASCIMENTO='${dataFormatada}'`,
        "Contexto": API_CONTEXT
      };
      
      console.log('🌐 [VOTING SERVICE] Enviando requisição para API...');
      console.log('📤 [VOTING SERVICE] Payload:', JSON.stringify(payload, null, 2));
      console.log('🔗 [VOTING SERVICE] URL:', `${API_BASE_URL}/data-server/read-view`);

      const data = JSON.stringify(payload);
      const response = await apiClient.post('/data-server/read-view', data);
      
      console.log('📥 [VOTING SERVICE] Resposta da API recebida');
      console.log('📊 [VOTING SERVICE] Status:', response.status);
      console.log('📋 [VOTING SERVICE] Dados:', JSON.stringify(response.data, null, 2));

      const result = response.data;

      // Verifica se a API retornou sucesso
      if (!result.success) {
        console.log('❌ [VOTING SERVICE] API retornou success: false');
        console.log('💬 [VOTING SERVICE] Mensagem da API:', result.message);
        return { success: false, message: 'Data de nascimento não confere' };
      }

      // Verifica se há dados do funcionário
      if (!result.data || !result.data.PFunc) {
        console.log('❌ [VOTING SERVICE] Nenhum funcionário encontrado com esta data de nascimento');
        console.log('📋 [VOTING SERVICE] Estrutura de dados recebida:', JSON.stringify(result.data, null, 2));
        return { success: false, message: 'Data de nascimento não confere' };
      }

      const funcionario = result.data.PFunc;
      console.log('✅ [VOTING SERVICE] Funcionário encontrado com data de nascimento correta');
      console.log('👤 [VOTING SERVICE] Dados do funcionário:', JSON.stringify(funcionario, null, 2));
      console.log('📝 [VOTING SERVICE] Nome:', funcionario.NOME);
      console.log('🆔 [VOTING SERVICE] CPF:', funcionario.CPF);
      console.log('📅 [VOTING SERVICE] Data de nascimento:', funcionario.DTNASCIMENTO);
      console.log('🏢 [VOTING SERVICE] Departamento:', funcionario.NOMEDEPARTAMENTO);
      console.log('💼 [VOTING SERVICE] Função:', funcionario.NOME_FUNCAO);
      console.log('📊 [VOTING SERVICE] Status:', funcionario.DESCRICAOSITUACAO);
      
      // Verifica se já votou
      console.log('🗳️ [VOTING SERVICE] Verificando se funcionário já votou...');
      const jaVotou = this.funcionarioJaVotou(cpfLimpo);
      console.log('🔍 [VOTING SERVICE] Já votou?', jaVotou);
      
      if (jaVotou) {
        console.log('❌ [VOTING SERVICE] Funcionário já votou anteriormente');
        return { success: false, message: 'Este funcionário já votou' };
      }

      console.log('✅ [VOTING SERVICE] Validação completa bem-sucedida!');
      return { 
        success: true, 
        funcionario,
        message: 'Funcionário validado com sucesso'
      };

    } catch (error) {
      console.error('💥 [VOTING SERVICE] Erro ao validar data de nascimento:', error);
      console.error('🔍 [VOTING SERVICE] Tipo do erro:', typeof error);
      console.error('📝 [VOTING SERVICE] Mensagem do erro:', error instanceof Error ? error.message : 'Erro desconhecido');
      
      if (axios.isAxiosError(error)) {
        console.error('🌐 [VOTING SERVICE] Erro de rede detectado');
        console.error('📊 [VOTING SERVICE] Status:', error.response?.status);
        console.error('📋 [VOTING SERVICE] Dados do erro:', error.response?.data);
        console.error('🔗 [VOTING SERVICE] URL:', error.config?.url);
      }
      
      return { 
        success: false, 
        message: 'Erro ao conectar com o servidor. Tente novamente.' 
      };
    }
  }

  /**
   * Valida e busca funcionário pelo CPF
   */
  async validarFuncionario(cpf: string): Promise<{ success: boolean; funcionario?: Funcionario; message: string }> {
    console.log('🔍 [VOTING SERVICE] Iniciando validação de funcionário...');
    console.log('📝 [VOTING SERVICE] CPF recebido:', cpf);
    
    try {
      // Remove formatação do CPF
      const cpfLimpo = cpf.replace(/\D/g, '');
      console.log('🧹 [VOTING SERVICE] CPF limpo:', cpfLimpo);
      
      if (cpfLimpo.length !== 11) {
        console.log('❌ [VOTING SERVICE] CPF deve ter 11 dígitos. Atual:', cpfLimpo.length);
        return { success: false, message: 'CPF deve ter 11 dígitos' };
      }

      // Valida CPF
      console.log('🔢 [VOTING SERVICE] Validando algoritmo do CPF...');
      if (!this.validarCPF(cpfLimpo)) {
        console.log('❌ [VOTING SERVICE] CPF inválido pelo algoritmo');
        return { success: false, message: 'CPF inválido' };
      }
      console.log('✅ [VOTING SERVICE] CPF válido pelo algoritmo');

      // Busca funcionário na API
      const payload = {
        "DataServerName": "FopFuncData",
        "Filtro": `CPF='${cpfLimpo}' AND CODSITUACAO='A'`,
        "Contexto": API_CONTEXT
      };
      
      console.log('🌐 [VOTING SERVICE] Enviando requisição para API...');
      console.log('📤 [VOTING SERVICE] Payload:', JSON.stringify(payload, null, 2));
      console.log('🔗 [VOTING SERVICE] URL:', `${API_BASE_URL}/data-server/read-view`);

      const data = JSON.stringify(payload);
      const response = await apiClient.post('/data-server/read-view', data);
      
      console.log('📥 [VOTING SERVICE] Resposta da API recebida');
      console.log('📊 [VOTING SERVICE] Status:', response.status);
      console.log('📋 [VOTING SERVICE] Dados:', JSON.stringify(response.data, null, 2));

      const result = response.data;

      // Verifica se a API retornou sucesso
      if (!result.success) {
        console.log('❌ [VOTING SERVICE] API retornou success: false');
        console.log('💬 [VOTING SERVICE] Mensagem da API:', result.message);
        return { success: false, message: 'Funcionário não encontrado ou inativo' };
      }

      // Verifica se há dados do funcionário
      if (!result.data || !result.data.PFunc) {
        console.log('❌ [VOTING SERVICE] Nenhum funcionário encontrado na API');
        console.log('📋 [VOTING SERVICE] Estrutura de dados recebida:', JSON.stringify(result.data, null, 2));
        return { success: false, message: 'Funcionário não encontrado ou inativo' };
      }

      const funcionario = result.data.PFunc;
      console.log('✅ [VOTING SERVICE] Funcionário encontrado na API');
      console.log('👤 [VOTING SERVICE] Dados do funcionário:', JSON.stringify(funcionario, null, 2));
      console.log('📝 [VOTING SERVICE] Nome:', funcionario.NOME);
      console.log('🆔 [VOTING SERVICE] CPF:', funcionario.CPF);
      console.log('🏢 [VOTING SERVICE] Departamento:', funcionario.NOMEDEPARTAMENTO);
      console.log('💼 [VOTING SERVICE] Função:', funcionario.NOME_FUNCAO);
      console.log('📊 [VOTING SERVICE] Status:', funcionario.DESCRICAOSITUACAO);
      
      // Verifica se já votou
      console.log('🗳️ [VOTING SERVICE] Verificando se funcionário já votou...');
      const jaVotou = this.funcionarioJaVotou(cpfLimpo);
      console.log('🔍 [VOTING SERVICE] Já votou?', jaVotou);
      
      if (jaVotou) {
        console.log('❌ [VOTING SERVICE] Funcionário já votou anteriormente');
        return { success: false, message: 'Este funcionário já votou' };
      }

      console.log('✅ [VOTING SERVICE] Funcionário validado com sucesso!');
      return { 
        success: true, 
        funcionario,
        message: 'Funcionário validado com sucesso'
      };

    } catch (error) {
      console.error('💥 [VOTING SERVICE] Erro ao validar funcionário:', error);
      console.error('🔍 [VOTING SERVICE] Tipo do erro:', typeof error);
      console.error('📝 [VOTING SERVICE] Mensagem do erro:', error instanceof Error ? error.message : 'Erro desconhecido');
      
      if (axios.isAxiosError(error)) {
        console.error('🌐 [VOTING SERVICE] Erro de rede detectado');
        console.error('📊 [VOTING SERVICE] Status:', error.response?.status);
        console.error('📋 [VOTING SERVICE] Dados do erro:', error.response?.data);
        console.error('🔗 [VOTING SERVICE] URL:', error.config?.url);
      }
      
      return { 
        success: false, 
        message: 'Erro ao conectar com o servidor. Tente novamente.' 
      };
    }
  }

  /**
   * Formata data de DD/MM/AAAA para YYYY-MM-DD
   */
  private formatarDataParaAPI(data: string): string {
    // Remove formatação (DD/MM/AAAA)
    const numeros = data.replace(/\D/g, '');
    
    if (numeros.length !== 8) {
      throw new Error('Data deve ter 8 dígitos');
    }
    
    const dia = numeros.substr(0, 2);
    const mes = numeros.substr(2, 2);
    const ano = numeros.substr(4, 4);
    
    // Validações básicas
    const diaNum = parseInt(dia);
    const mesNum = parseInt(mes);
    const anoNum = parseInt(ano);
    
    if (diaNum < 1 || diaNum > 31) {
      throw new Error('Dia inválido');
    }
    if (mesNum < 1 || mesNum > 12) {
      throw new Error('Mês inválido');
    }
    if (anoNum < 1900 || anoNum > new Date().getFullYear()) {
      throw new Error('Ano inválido');
    }
    
    // Retorna no formato YYYY-MM-DD
    return `${ano}-${mes}-${dia}`;
  }

  /**
   * Valida CPF usando algoritmo oficial
   */
  private validarCPF(cpf: string): boolean {
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return false;
    }

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;

    return true;
  }

  /**
   * Verifica se funcionário já votou
   */
  private funcionarioJaVotou(cpf: string): boolean {
    return this.votos.some(voto => voto.cpf === cpf);
  }

  /**
   * Busca candidato pelo código
   */
  async buscarCandidato(codigo: string, codColigada: string): Promise<Candidato | null> {
    console.log('🎯 [VOTING SERVICE] Buscando candidato com código:', codigo);
    await this.garantirCandidatosCarregados(codColigada);
    const candidato = this.candidatos.find(c => c.codigo === codigo) || null;
    
    if (candidato) {
      console.log('✅ [VOTING SERVICE] Candidato encontrado:', JSON.stringify(candidato, null, 2));
    } else {
      console.log('❌ [VOTING SERVICE] Candidato não encontrado para código:', codigo);
      console.log('📋 [VOTING SERVICE] Candidatos disponíveis:', this.candidatos.map(c => c.codigo));
    }
    
    return candidato;
  }

  /**
   * Registra voto
   */
  async registrarVoto(cpf: string, codigoCandidato: string): Promise<{ success: boolean; message: string; voto?: Voto }> {
    console.log('🗳️ [VOTING SERVICE] Iniciando registro de voto...');
    console.log('📝 [VOTING SERVICE] CPF:', cpf);
    console.log('🎯 [VOTING SERVICE] Código do candidato:', codigoCandidato);
    
    try {
      // Valida funcionário novamente
      console.log('🔍 [VOTING SERVICE] Revalidando funcionário...');
      const validacao = await this.validarFuncionario(cpf);
      if (!validacao.success) {
        console.log('❌ [VOTING SERVICE] Revalidação falhou:', validacao.message);
        return { success: false, message: validacao.message };
      }
      console.log('✅ [VOTING SERVICE] Revalidação bem-sucedida');

      // Valida candidato
      console.log('🎯 [VOTING SERVICE] Buscando candidato...');
      const funcionario = validacao.funcionario!;
      const candidato = await this.buscarCandidato(codigoCandidato, funcionario.CODCOLIGADA);
      if (!candidato) {
        console.log('❌ [VOTING SERVICE] Candidato não encontrado:', codigoCandidato);
        return { success: false, message: 'Candidato não encontrado' };
      }
      console.log('✅ [VOTING SERVICE] Candidato encontrado:', JSON.stringify(candidato, null, 2));

      // Cria voto
      console.log('📝 [VOTING SERVICE] Criando objeto de voto...');
      const voto: Voto = {
        id: this.gerarId(),
        cpf: cpf.replace(/\D/g, ''),
        codigoFuncionario: validacao.funcionario!.CODPESSOA,
        codigoCandidato,
        dataVoto: new Date().toISOString(),
        ip: await this.obterIP(),
        userAgent: navigator.userAgent
      };
      console.log('📋 [VOTING SERVICE] Voto criado:', JSON.stringify(voto, null, 2));

      // Adiciona voto à lista local
      console.log('💾 [VOTING SERVICE] Adicionando voto à lista local...');
      this.votos.push(voto);
      console.log('📊 [VOTING SERVICE] Total de votos agora:', this.votos.length);

      // Aqui você pode enviar para a API se necessário
      // await this.enviarVotoParaAPI(voto);

      console.log('✅ [VOTING SERVICE] Voto registrado com sucesso!');
      return { 
        success: true, 
        message: 'Voto registrado com sucesso',
        voto
      };

    } catch (error) {
      console.error('💥 [VOTING SERVICE] Erro ao registrar voto:', error);
      console.error('🔍 [VOTING SERVICE] Tipo do erro:', typeof error);
      console.error('📝 [VOTING SERVICE] Mensagem do erro:', error instanceof Error ? error.message : 'Erro desconhecido');
      
      return { 
        success: false, 
        message: 'Erro ao registrar voto. Tente novamente.' 
      };
    }
  }

  /**
   * Obtém estatísticas da votação
   */
  obterEstatisticas(): {
    totalVotos: number;
    votosPorCandidato: { [codigo: string]: number };
    funcionariosQueVotaram: string[];
  } {
    console.log('📊 [VOTING SERVICE] Calculando estatísticas...');
    console.log('🗳️ [VOTING SERVICE] Total de votos registrados:', this.votos.length);
    
    const votosPorCandidato: { [codigo: string]: number } = {};
    
    this.candidatos.forEach(candidato => {
      votosPorCandidato[candidato.codigo] = 0;
    });

    this.votos.forEach(voto => {
      votosPorCandidato[voto.codigoCandidato] = (votosPorCandidato[voto.codigoCandidato] ?? 0) + 1;
    });

    const estatisticas = {
      totalVotos: this.votos.length,
      votosPorCandidato,
      funcionariosQueVotaram: this.votos.map(v => v.cpf)
    };

    console.log('📈 [VOTING SERVICE] Estatísticas calculadas:', JSON.stringify(estatisticas, null, 2));
    
    return estatisticas;
  }

  /**
   * Limpa todos os votos (para testes)
   */
  limparVotos(): void {
    this.votos = [];
  }

  /**
   * Gera ID único para voto
   */
  private gerarId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Obtém IP do usuário (simulado)
   */
  private async obterIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || '127.0.0.1';
    } catch {
      return '127.0.0.1';
    }
  }

  /**
   * Envia voto para API (método para implementação futura)
   */
  private async enviarVotoParaAPI(voto: Voto): Promise<void> {
    // Implementar envio para API quando necessário
    console.log('Voto enviado para API:', voto);
  }
}

// Instância singleton do service
export const votingService = new VotingService();
export default votingService;
