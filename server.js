const express = require('express');
const cors = require('cors');
const sql = require('mssql');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configuração do banco de dados MSSQL
const dbConfig = {
  server: '45.6.153.34',
  port: 38000,
  database: 'C6P3YB_167823_RM_PD',
  user: 'CLT167823TI2',
  password: 'soqfk38967IESXQ@?',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
    connectionTimeout: 30000,
    requestTimeout: 30000,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    }
  }
};

// Pool de conexões
let pool = null;

// Inicializar conexão com banco
async function initializeDatabase() {
  try {
    console.log('🔌 [BACKEND] Iniciando conexão com banco de dados...');
    console.log('🏢 [BACKEND] Servidor:', dbConfig.server);
    console.log('🔌 [BACKEND] Porta:', dbConfig.port);
    console.log('📊 [BACKEND] Database:', dbConfig.database);
    console.log('👤 [BACKEND] Usuário:', dbConfig.user);

    pool = new sql.ConnectionPool(dbConfig);
    await pool.connect();
    
    console.log('✅ [BACKEND] Conexão com banco estabelecida com sucesso!');
    
    // Testar conexão
    const request = pool.request();
    const result = await request.query('SELECT 1 as teste');
    console.log('🧪 [BACKEND] Teste de conexão:', result.recordset[0].teste);
    
  } catch (error) {
    console.error('💥 [BACKEND] Erro ao conectar com banco:', error);
    throw error;
  }
}

// Endpoint para inserir voto
app.post('/data-server/incluir-voto', async (req, res) => {
  console.log('🗳️ [BACKEND] ===== RECEBENDO VOTO =====');
  console.log('📝 [BACKEND] Dados recebidos:', JSON.stringify(req.body, null, 2));

  try {
    if (!pool) {
      throw new Error('Pool de conexão não disponível');
    }

    const {
      CODCOLIGADA,
      CODCOMISSAO,
      CODELEICAO,
      CODVOTO,
      CODCANDIDATO,
      CODUSUARIO,
      DATA,
      VOTOS,
      JUSTIFICATIVA,
      RECCREATEDBY,
      RECCREATEDON
    } = req.body;

    // Validar dados obrigatórios
    if (!CODCOLIGADA || !CODCOMISSAO || !CODELEICAO || !CODCANDIDATO || !CODUSUARIO) {
      throw new Error('Dados obrigatórios não fornecidos');
    }

    console.log('🔍 [BACKEND] Preparando query SQL...');
    
    // Query SQL para inserir voto com auto-incremento do CODVOTO
    const query = `
      INSERT INTO VELEICAOVOTOMANUAL (
        CODCOLIGADA,
        CODCOMISSAO,
        CODELEICAO,
        CODVOTO,
        CODCANDIDATO,
        CODUSUARIO,
        DATA,
        VOTOS,
        JUSTIFICATIVA,
        RECCREATEDBY,
        RECCREATEDON
      )
      SELECT
        @CODCOLIGADA,
        @CODCOMISSAO,
        @CODELEICAO,
        ISNULL(MAX(CODVOTO), 0) + 1,
        @CODCANDIDATO,
        @CODUSUARIO,
        GETDATE(),
        1,
        'VOTO MANUAL TABLET',
        'votocipa',
        GETDATE()
      FROM VELEICAOVOTOMANUAL
      WHERE CODCOLIGADA = @CODCOLIGADA
        AND CODCOMISSAO = @CODCOMISSAO;
      
      -- Retornar o CODVOTO gerado
      SELECT TOP 1 CODVOTO 
      FROM VELEICAOVOTOMANUAL 
      WHERE CODCOLIGADA = @CODCOLIGADA 
        AND CODCOMISSAO = @CODCOMISSAO 
        AND CODCANDIDATO = @CODCANDIDATO
        AND CODUSUARIO = @CODUSUARIO
      ORDER BY RECCREATEDON DESC;
    `;

    console.log('📋 [BACKEND] Query preparada:', query);

    // Preparar parâmetros
    const request = pool.request();
    
    console.log('🔧 [BACKEND] Configurando parâmetros...');
    console.log('🔧 [BACKEND] CODCOLIGADA:', CODCOLIGADA);
    console.log('🔧 [BACKEND] CODCOMISSAO:', CODCOMISSAO);
    console.log('🔧 [BACKEND] CODELEICAO:', CODELEICAO);
    console.log('🔧 [BACKEND] CODCANDIDATO:', CODCANDIDATO);
    console.log('🔧 [BACKEND] CODUSUARIO:', CODUSUARIO);

    request.input('CODCOLIGADA', sql.VarChar(10), CODCOLIGADA);
    request.input('CODCOMISSAO', sql.VarChar(20), CODCOMISSAO);
    request.input('CODELEICAO', sql.VarChar(20), CODELEICAO);
    request.input('CODCANDIDATO', sql.VarChar(20), CODCANDIDATO);
    request.input('CODUSUARIO', sql.VarChar(50), CODUSUARIO);

    console.log('🚀 [BACKEND] Executando query...');
    console.log('⏱️ [BACKEND] Início da execução:', new Date().toISOString());

    const result = await request.query(query);

    console.log('⏱️ [BACKEND] Fim da execução:', new Date().toISOString());
    console.log('📊 [BACKEND] Resultado da query:', JSON.stringify(result, null, 2));

    // Verificar se a inserção foi bem-sucedida
    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      console.log('✅ [BACKEND] Voto inserido com sucesso!');
      console.log('📈 [BACKEND] Linhas afetadas:', result.rowsAffected[0]);

      // Obter o CODVOTO gerado
      let codVotoGerado = null;
      if (result.recordset && result.recordset.length > 0) {
        codVotoGerado = result.recordset[0].CODVOTO;
        console.log('🔢 [BACKEND] CODVOTO gerado:', codVotoGerado);
      }

      console.log('🗳️ [BACKEND] ===== VOTO INSERIDO COM SUCESSO =====');
      
      res.json({
        success: true,
        message: 'Voto inserido com sucesso no banco de dados',
        codVoto: codVotoGerado,
        timestamp: new Date().toISOString()
      });
    } else {
      console.warn('⚠️ [BACKEND] Nenhuma linha foi afetada pela inserção');
      throw new Error('Falha na inserção do voto - nenhuma linha afetada');
    }

  } catch (error) {
    console.error('💥 [BACKEND] Erro ao inserir voto:', error);
    console.error('🔍 [BACKEND] Tipo do erro:', typeof error);
    console.error('📝 [BACKEND] Mensagem do erro:', error.message);
    
    if (error instanceof sql.RequestError) {
      console.error('🗄️ [BACKEND] Erro específico do SQL Server:');
      console.error('📊 [BACKEND] Código:', error.code);
      console.error('📋 [BACKEND] Estado:', error.state);
      console.error('🔢 [BACKEND] Número:', error.number);
      console.error('📝 [BACKEND] Mensagem:', error.message);
    }

    console.log('🗳️ [BACKEND] ===== INSERÇÃO DE VOTO FALHOU =====');
    
    res.status(500).json({
      success: false,
      message: 'Erro ao inserir voto no banco de dados',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Endpoint para testar conexão
app.get('/data-server/health', async (req, res) => {
  try {
    if (!pool) {
      throw new Error('Pool de conexão não disponível');
    }

    const request = pool.request();
    const result = await request.query('SELECT 1 as teste');
    
    res.json({
      success: true,
      message: 'Conexão com banco funcionando',
      teste: result.recordset[0].teste,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro na conexão com banco',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Endpoint para verificar tabela
app.get('/data-server/verificar-tabela', async (req, res) => {
  try {
    if (!pool) {
      throw new Error('Pool de conexão não disponível');
    }

    const request = pool.request();
    const query = `
      SELECT COUNT(*) as total
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_NAME = 'VELEICAOVOTOMANUAL'
    `;
    
    const result = await request.query(query);
    const existe = result.recordset[0].total > 0;
    
    res.json({
      success: true,
      message: existe ? 'Tabela encontrada' : 'Tabela não encontrada',
      existe,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar tabela',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Middleware de erro global
app.use((error, req, res, next) => {
  console.error('💥 [BACKEND] Erro global:', error);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: error.message,
    timestamp: new Date().toISOString()
  });
});

// Inicializar servidor
async function startServer() {
  try {
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log('🚀 [BACKEND] Servidor iniciado com sucesso!');
      console.log(`🌐 [BACKEND] URL: http://localhost:${PORT}`);
      console.log(`🗳️ [BACKEND] Endpoint de voto: http://localhost:${PORT}/data-server/incluir-voto`);
      console.log(`🏥 [BACKEND] Health check: http://localhost:${PORT}/data-server/health`);
      console.log(`🔍 [BACKEND] Verificar tabela: http://localhost:${PORT}/data-server/verificar-tabela`);
    });
  } catch (error) {
    console.error('💥 [BACKEND] Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🔄 [BACKEND] Encerrando servidor...');
  if (pool) {
    await pool.close();
    console.log('🔌 [BACKEND] Conexão com banco fechada');
  }
  process.exit(0);
});

// Iniciar servidor
startServer();
