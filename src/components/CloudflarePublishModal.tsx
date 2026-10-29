import React, { useState } from 'react';
import { 
  Cloud, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  GitBranch, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  Globe
} from 'lucide-react';

interface CloudflarePublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  appName: string;
  onExportZip: () => void;
  onOpenGitSync: () => void;
}

export const CloudflarePublishModal: React.FC<CloudflarePublishModalProps> = ({
  isOpen,
  onClose,
  appName,
  onExportZip,
  onOpenGitSync,
}) => {
  const [copiedBuild, setCopiedBuild] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'git' | 'cli' | 'upload'>('git');

  if (!isOpen) return null;

  const repoSlug = appName.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'devforge-app';

  const cliCommands = `# 1. Instale as dependências e compile o app
npm install
npm run build

# 2. Faça o deploy instantâneo para o Cloudflare Pages
npx wrangler pages deploy dist --project-name=${repoSlug}`;

  const handleCopyBuild = () => {
    const text = `Framework preset: Vite\nBuild command: npm run build\nBuild output directory: dist\nEnvironment variable: GEMINI_API_KEY`;
    navigator.clipboard.writeText(text);
    setCopiedBuild(true);
    setTimeout(() => setCopiedBuild(false), 2000);
  };

  const handleCopyCli = () => {
    navigator.clipboard.writeText(cliCommands);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 font-sans select-none animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/25">
              <Cloud className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">Publicar no Cloudflare Pages</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Pronto para Deploy
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Hospedagem global de alta performance com CDN, Edge Functions e SSL gratuito
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            ✕
          </button>
        </div>

        {/* Method Switcher Tabs */}
        <div className="px-5 pt-4 border-b border-slate-800/80 bg-slate-900/60 flex gap-2">
          <button
            onClick={() => setSelectedTab('git')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg transition border-b-2 cursor-pointer ${
              selectedTab === 'git'
                ? 'border-amber-500 text-amber-400 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Opção 1: Via GitHub / Git (Recomendado)</span>
          </button>
          <button
            onClick={() => setSelectedTab('cli')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg transition border-b-2 cursor-pointer ${
              selectedTab === 'cli'
                ? 'border-amber-500 text-amber-400 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Opção 2: Wrangler CLI</span>
          </button>
          <button
            onClick={() => setSelectedTab('upload')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg transition border-b-2 cursor-pointer ${
              selectedTab === 'upload'
                ? 'border-amber-500 text-amber-400 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Opção 3: Baixar ZIP</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-5 text-xs text-slate-300">
          {/* Method 1: GitHub / Git */}
          {selectedTab === 'git' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-white flex items-center gap-2 text-xs">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono text-[10px]">1</span>
                  Passo 1: Envie o código para o seu repositório Git
                </h4>
                <p className="text-slate-400 pl-7 text-[11px]">
                  Utilize o botão de sincronização para fazer push dos arquivos para o seu repositório no GitHub ou GitLab.
                </p>
                <div className="pl-7">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenGitSync();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs shadow transition cursor-pointer"
                  >
                    <GitBranch className="w-3.5 h-3.5" />
                    <span>Abrir Sincronizador Git</span>
                  </button>
                </div>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-white flex items-center gap-2 text-xs">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono text-[10px]">2</span>
                  Passo 2: No Painel da Cloudflare (dash.cloudflare.com)
                </h4>
                <div className="pl-7 space-y-2 text-[11px] text-slate-400">
                  <p>1. Vá em <strong className="text-white">Workers & Pages</strong> &gt; <strong className="text-white">Create application</strong> &gt; <strong className="text-white">Pages</strong> &gt; <strong className="text-white">Connect to Git</strong>.</p>
                  <p>2. Selecione o repositório do seu projeto.</p>
                  <p>3. Configure os parâmetros exatos de build abaixo:</p>
                </div>

                {/* Preconfigured Build Table */}
                <div className="ml-7 bg-slate-900 rounded-lg p-3 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-[11px] border-b border-slate-800/80 pb-1.5">
                    <span className="text-slate-400">Framework preset:</span>
                    <span className="font-mono font-bold text-amber-400">Vite</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] border-b border-slate-800/80 pb-1.5">
                    <span className="text-slate-400">Build command:</span>
                    <span className="font-mono font-bold text-emerald-400">npm run build</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] border-b border-slate-800/80 pb-1.5">
                    <span className="text-slate-400">Build output directory:</span>
                    <span className="font-mono font-bold text-indigo-400">dist</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Root directory:</span>
                    <span className="font-mono text-slate-300">/ (deixe em branco)</span>
                  </div>
                </div>

                <div className="pl-7">
                  <button
                    onClick={handleCopyBuild}
                    className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition"
                  >
                    {copiedBuild ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedBuild ? 'Configurações Copiadas!' : 'Copiar Configurações de Build'}</span>
                  </button>
                </div>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-white flex items-center gap-2 text-xs">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono text-[10px]">3</span>
                  Passo 3: Variável de Ambiente (Gemini AI)
                </h4>
                <p className="text-slate-400 pl-7 text-[11px]">
                  No passo de deploy no Cloudflare, adicione a variável de ambiente:
                  <br />
                  <code className="text-amber-300 font-mono font-bold bg-slate-900 px-2 py-0.5 rounded mt-1 inline-block">
                    GEMINI_API_KEY = "sua_chave_do_google_ai_studio"
                  </code>
                </p>
              </div>
            </div>
          )}

          {/* Method 2: Wrangler CLI */}
          {selectedTab === 'cli' && (
            <div className="space-y-4">
              <p className="text-slate-400 text-[11px]">
                Se você tem o Node.js e o Cloudflare Wrangler instalados no seu computador, publique com apenas 2 comandos de terminal:
              </p>

              <div className="relative">
                <pre className="bg-slate-950 p-4 rounded-xl font-mono text-xs text-amber-300 border border-slate-800 overflow-x-auto select-all leading-relaxed">
                  {cliCommands}
                </pre>
                <button
                  onClick={handleCopyCli}
                  className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded transition cursor-pointer"
                >
                  {copiedCli ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCli ? 'Copiado!' : 'Copiar Comandos'}</span>
                </button>
              </div>

              <div className="p-3 bg-amber-950/30 border border-amber-900/50 rounded-xl flex items-start gap-2.5 text-[11px] text-amber-200/90">
                <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  O arquivo de roteamento <code className="text-white font-mono">public/_redirects</code> e o arquivo <code className="text-white font-mono">wrangler.toml</code> já foram criados no projeto para garantir que o SPA e todas as rotas funcionem sem erro 404!
                </p>
              </div>
            </div>
          )}

          {/* Method 3: Download ZIP */}
          {selectedTab === 'upload' && (
            <div className="space-y-4">
              <p className="text-slate-400 text-[11px]">
                Baixe o código-fonte completo já pré-configurado com os arquivos necessários para o Cloudflare Pages (<code className="text-white">_redirects</code>, <code className="text-white">wrangler.toml</code> e <code className="text-white">functions/api</code>):
              </p>

              <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
                  <Download className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{appName} (Cloudflare Ready)</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Pacote .ZIP com código TypeScript, Tailwind CSS, Vite e scripts de deploy.
                  </p>
                </div>
                <button
                  onClick={onExportZip}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold rounded-xl shadow-lg transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar Projeto Completo (.ZIP)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <a
            href="https://dash.cloudflare.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:underline"
          >
            <span>Acessar Painel do Cloudflare Pages</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
