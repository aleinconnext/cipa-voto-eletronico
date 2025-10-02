# Deploy na Vercel - Urna Eletrônica CIPA

## Configuração para Vercel

### 1. Arquivos de Configuração

O projeto já está configurado com os seguintes arquivos:

- `vercel.json` - Configuração de rotas e build
- `public/_redirects` - Redirecionamentos para SPA
- `vite.config.ts` - Configuração do Vite

### 2. Comandos de Build

```bash
npm run build
```

### 3. Estrutura de Arquivos

Certifique-se de que os seguintes arquivos estão presentes:

- ✅ `src/assets/logo-jurunense-desk.svg`
- ✅ `public/sounds/inter.mp3`
- ✅ `public/sounds/fim.mp3`
- ✅ `vercel.json`
- ✅ `public/_redirects`

### 4. Rotas Configuradas

- `/` - Página principal (urna eletrônica)
- `/admin` - Área administrativa
- `/*` - Redireciona para 404

### 5. Deploy na Vercel

1. Conecte seu repositório GitHub à Vercel
2. Configure as seguintes variáveis de ambiente (se necessário):
   - `NODE_VERSION`: `18` ou superior
3. Deploy automático será feito a cada push

### 6. Solução de Problemas

Se ainda houver erro 404:

1. Verifique se o `vercel.json` está na raiz do projeto
2. Certifique-se de que o build está gerando o `dist/index.html`
3. Verifique os logs de build na Vercel
4. Tente fazer um novo deploy

### 7. URLs de Teste

- Página principal: `https://seu-projeto.vercel.app/`
- Admin: `https://seu-projeto.vercel.app/admin`
- Senha admin: `admin2025` 