import React, { useState } from 'react';
import { 
  GitBranch, 
  GitCommit as GitCommitIcon, 
  Github, 
  Download, 
  Copy, 
  Check, 
  Terminal, 
  ArrowUpRight, 
  CheckCircle2, 
  Sparkles, 
  KeyRound,
  ShieldCheck,
  FolderGit2
} from 'lucide-react';
import { GitCommit, ProjectFile } from '../types/studio';

interface GitManagerViewProps {
  appName: string;
  files: ProjectFile[];
  commits: GitCommit[];
  onExportZip: () => void;
  onCommitCreated: (commit: GitCommit) => void;
}

export const GitManagerView: React.FC<GitManagerViewProps> = ({
  appName,
  files,
  commits,
  onExportZip,
  onCommitCreated,
}) => {
  const [repoName, setRepoName] = useState(
    appName.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'meu-app-ai'
  );
  const [branch, setBranch] = useState('main');
  const [commitMessage, setCommitMessage] = useState(
    `feat(core): automação de código para ${appName} via DevForge Studio`
  );
  const [githubToken, setGithubToken] = useState('');
  const [isPushing, setIsPushing] = useState(false);
  const [pushResult, setPushResult] = useState<any>(null);
  const [copiedCli, setCopiedCli] = useState(false);

  const cliScript = `# 1. Inicialize o repositório local
git init -b ${branch}

# 2. Adicione todos os arquivos gerados pela IA
git add .

# 3. Registre o commit semântico
git commit -m "${commitMessage.replace(/"/g, '\\"')}"

# 4. Vincule ao seu repositório remoto no GitHub
git remote add origin https://github.com/SEU_USUARIO/${repoName}.git

# 5. Envie a branch para o GitHub
git push -u origin ${branch}`;

  const handleCopyCli = () => {
    navigator.clipboard.writeText(cliScript);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const handlePushGit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPushing(true);
    setPushResult(null);

    try {
      const res = await fetch('/api/git/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoName,
          branch,
          commitMessage,
          files,
          githubToken: githubToken.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPushResult(data);
        const newCommit: GitCommit = {
          id: Date.now().toString(),
          hash: data.commitHash,
          branch,
          title: commitMessage,
          description: `Push realizado para ${repoName} (${files.length} arquivos)`,
          diffSummary: `${files.length} arquivos alterados, +${files.reduce((acc, f) => acc + f.content.split('\n').length, 0)} linhas`,
          timestamp: new Date().toLocaleTimeString(),
          author: githubToken ? 'GitHub Authenticated User' : 'DevForge AI Agent',
        };
        onCommitCreated(newCommit);
      }
    } catch (err: any) {
      console.error('Push error:', err);
    } finally {
      setIsPushing(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#080c14] p-4 sm:p-6 space-y-6 select-none font-sans">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Integração Direta com Repositórios Git
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Sincronize componentes gerados, crie commits semânticos e automatize o push para GitHub ou GitLab.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportZip}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 shadow-sm transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Baixar Repositório (.ZIP)</span>
          </button>
        </div>
      </div>

      {/* Grid: Push Config Form & CLI Commands */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: GitHub Push Form */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Github className="w-5 h-5 text-white" />
              <h3 className="text-sm font-bold text-white">Sincronizar com GitHub</h3>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
              API REST v3
            </span>
          </div>

          <form onSubmit={handlePushGit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nome do Repositório no GitHub
              </label>
              <input
                type="text"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                placeholder="ex: meu-app-moderno"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Branch de Destino</label>
                <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white">
                  <GitBranch className="w-3.5 h-3.5 text-indigo-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full bg-transparent outline-none font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Total de Arquivos</label>
                <div className="bg-slate-800/50 border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs text-slate-300 font-mono">
                  {files.length} arquivos no bundle
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Mensagem de Commit (Conventional Commits)
              </label>
              <input
                type="text"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                placeholder="feat: adicionar componente x"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <KeyRound className="w-3 h-3 text-slate-400" />
                  GitHub Personal Access Token (Opcional)
                </span>
                <span className="text-[10px] text-slate-500">Ou use o modo simulado</span>
              </label>
              <input
                type="password"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx (escopo repo)"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500 placeholder-slate-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Se deixar em branco, o DevForge gera a simulação local com hash de commit e scripts CLI executáveis.
              </p>
            </div>

            <button
              type="submit"
              disabled={isPushing}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isPushing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Enviando para o Git...</span>
                </>
              ) : (
                <>
                  <GitCommitIcon className="w-4 h-4" />
                  <span>Comitar e Fazer Push para o Repositório</span>
                </>
              )}
            </button>
          </form>

          {/* Success Banner */}
          {pushResult && (
            <div className="p-3.5 bg-emerald-950/40 border border-emerald-800/60 rounded-xl space-y-1 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Commit & Push Registrados com Sucesso!</span>
              </div>
              <p className="text-emerald-200/90 text-[11px]">
                Hash do Commit: <span className="font-mono font-bold text-white">{pushResult.commitHash}</span> na branch <span className="font-mono text-white">{pushResult.branch}</span>.
              </p>
              {pushResult.repoUrl && (
                <a
                  href={pushResult.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-indigo-300 hover:underline pt-1"
                >
                  <span>Abrir no GitHub: {pushResult.repoUrl}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Right: CLI Script Generator */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Comandos de Terminal (Git CLI)</h3>
              </div>
              <button
                onClick={handleCopyCli}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition cursor-pointer"
              >
                {copiedCli ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCli ? 'Copiado!' : 'Copiar Script'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Prefere utilizar o seu terminal local? Copie e cole os comandos abaixo para inicializar e publicar o repositório em segundos:
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl font-mono text-xs text-emerald-300 leading-relaxed border border-slate-800/90 whitespace-pre overflow-x-auto select-all">
            {cliScript}
          </div>

          <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/60 flex items-start gap-2.5 text-[11px] text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Automação Completa Incluída:</span>
              <p className="text-slate-400">
                O arquivo descompactado do ZIP já contém o script <code className="text-indigo-300">init-git.sh</code> pronto para ser executado com 1 comando.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Commit History Timeline */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCommitIcon className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Histórico de Commits Git do Projeto</h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">{commits.length} commits</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {commits.map((c) => (
            <div key={c.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/30 px-3 rounded-lg transition">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    {c.hash}
                  </span>
                  <span className="text-xs font-semibold text-white">{c.title}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-800 text-slate-400 rounded">
                    {c.branch}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{c.description}</p>
                <span className="text-[10px] text-emerald-400 font-mono block">{c.diffSummary}</span>
              </div>
              <div className="text-right sm:shrink-0 text-[11px] text-slate-500">
                <span className="block font-medium text-slate-400">{c.author}</span>
                <span>{c.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
