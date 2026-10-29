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

  // Add automated setup script for fast Git initialization
  root.file(
    'init-git.sh',
    `#!/usr/bin/env bash
# Script gerado automaticamente pelo DevForge Studio AI
echo "🚀 Inicializando repositório Git para ${appName}..."
git init -b main
git add .
git commit -m "${commitMessage.replace(/"/g, '\\"')}"
echo ""
echo "✅ Repositório inicializado e commit registrado com sucesso!"
echo "👉 Para enviar para o GitHub, rode:"
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
echo Para enviar para o GitHub:
echo git remote add origin https://github.com/SEU-USUARIO/${folderName}.git
echo git push -u origin main
pause
`
  );

  // Generate ZIP file
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${folderName}-git-ready.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
