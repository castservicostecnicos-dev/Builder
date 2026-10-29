import JSZip from 'jszip';
import { ProjectFile } from '../types/studio';

export async function exportProjectToGitZip(
  appName: string,
  files: ProjectFile[],
  commitMessage = 'feat: initial commit from DevForge Studio AI'
) {
  const zip = new JSZip();
  const folderName = appName.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'devforge-app';
  const root = zip.folder(folderName) || zip;

  // Add all project files
  files.forEach((file) => {
    root.file(file.path, file.content);
  });

  // Ensure standard files if not already present
  if (!files.some((f) => f.path === '.gitignore')) {
    root.file(
      '.gitignore',
      `# Dependências
node_modules/
.pnp
.pnp.js

# Produção
dist/
build/

# Variáveis de ambiente
.env
.env.local
.env.development.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Sistema Operacional
.DS_Store
Thumbs.db
`
    );
  }

  // Add Cloudflare Pages configuration files
  root.file('public/_redirects', '/*    /index.html   200\n');
  root.file(
    'wrangler.toml',
    `name = "${folderName}"
compatibility_date = "2026-10-29"
pages_build_output_dir = "dist"
`
  );

  // Add Cloudflare Edge Function for serverless API support
  root.file(
    'functions/api/[[route]].ts',
    `// Cloudflare Pages Function
interface Env {
  GEMINI_API_KEY?: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);

  if (url.pathname === '/api/health') {
    return new Response(JSON.stringify({ status: 'ok', cloudflare: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ status: 'ok' }), {
    headers: { 'Content-Type': 'application/json' }
  });
};
`
  );

  // Add automated setup script for fast Git initialization
  root.file(
    'init-git.sh',
    `#!/usr/bin/env bash
# Script gerado automaticamente pelo DevForge Studio AI para Git e Cloudflare Pages
echo "🚀 Inicializando repositório Git para ${appName}..."
git init -b main
git add .
git commit -m "${commitMessage.replace(/"/g, '\\"')}"
echo ""
echo "✅ Repositório inicializado e commit registrado com sucesso!"
echo "👉 Para enviar para o GitHub e conectar ao Cloudflare Pages:"
echo "   git remote add origin https://github.com/SEU-USUARIO/${folderName}.git"
echo "   git push -u origin main"
`
  );

  // Add Windows batch file counterpart
  root.file(
    'init-git.bat',
    `@echo off
echo Inicializando repositorio Git para ${appName}...
git init -b main
git add .
git commit -m "${commitMessage.replace(/"/g, '')}"
echo.
echo Repositorio Git inicializado com sucesso!
echo Para enviar para o GitHub e Cloudflare Pages:
echo git remote add origin https://github.com/SEU-USUARIO/${folderName}.git
echo git push -u origin main
pause
`
  );

  // Add Cloudflare deployment guide
  root.file(
    'CLOUDFLARE_PAGES.md',
    `# 🚀 Como publicar no Cloudflare Pages

## Opção 1: Conectar ao GitHub (Recomendado)
1. Crie um repositório no seu GitHub e suba este código (\`./init-git.sh\`).
2. Acesse o **Cloudflare Dashboard** (https://dash.cloudflare.com).
3. Vá em **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
4. Selecione seu repositório.
5. Configurações de Build:
   - **Framework preset**: \`Vite\`
   - **Build command**: \`npm run build\`
   - **Build output directory**: \`dist\`
   - **Environment Variables**: adicione \`GEMINI_API_KEY\` com sua chave da Google AI Studio.
6. Clique em **Save and Deploy**.

## Opção 2: Deploy direto via Wrangler CLI
\`\`\`bash
npm install
npm run build
npx wrangler pages deploy dist --project-name=${folderName}
\`\`\`
`
  );

  // Generate ZIP file
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${folderName}-cloudflare-ready.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
