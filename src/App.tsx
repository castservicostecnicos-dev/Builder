/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PromptSidebar } from './components/PromptSidebar';
import { WorkspaceTabs } from './components/WorkspaceTabs';
import { PreviewSandbox } from './components/PreviewSandbox';
import { CodeWorkspace } from './components/CodeWorkspace';
import { DiffViewer } from './components/DiffViewer';
import { GitManagerView } from './components/GitManagerView';
import { ComponentStudio } from './components/ComponentStudio';
import { 
  StudioMode, 
  ActiveTab, 
  ViewportMode, 
  ProjectFile, 
  GitCommit, 
  CodeExplanation, 
  ComplexComponent 
} from './types/studio';
import { CloudflarePublishModal } from './components/CloudflarePublishModal';
import { exportProjectToGitZip } from './utils/gitZipExporter';

// Default initial state project
const INITIAL_APP_NAME = 'Nexus Platform';
const INITIAL_CODE = `import React, { useState } from 'react';

export default function App() {
  const [metricPeriod, setMetricPeriod] = useState('7d');
  const [items, setItems] = useState([
    { id: 1, title: 'Engine de Automação de Código', status: 'Ativo', speed: '12ms', commits: 42 },
    { id: 2, title: 'Sincronizador de Repositório Git', status: 'Sincronizado', speed: '28ms', commits: 89 },
    { id: 3, title: 'Sandbox Interativo de Componentes', status: 'Pronto', speed: '5ms', commits: 120 },
  ]);
  const [filter, setFilter] = useState('');

  const filtered = items.filter(i => i.title.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <header className="max-w-5xl mx-auto flex justify-between items-center pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-sm shadow-lg shadow-indigo-500/30">⚡</span>
            Nexus Platform AI
          </h1>
          <p className="text-xs text-slate-400 mt-1">Geração de código reativo com integração direta em repositórios Git</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => alert('Componente pronto para deploy!')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md transition"
          >
            Deploy Git
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <span className="text-xs text-slate-400">Total de Módulos</span>
            <div className="text-2xl font-bold text-white mt-1">{items.length}</div>
            <span className="text-[11px] text-emerald-400">100% Operacional</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <span className="text-xs text-slate-400">Status do Git</span>
            <div className="text-2xl font-bold text-indigo-400 mt-1 font-mono">main: clean</div>
            <span className="text-[11px] text-slate-400">Sem pendências locais</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <span className="text-xs text-slate-400">Latência Média</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">15ms</div>
            <span className="text-[11px] text-emerald-400">Alta performance</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <input
              type="text"
              placeholder="Filtrar módulos ou componentes..."
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="bg-slate-800 text-xs text-white px-3 py-2 rounded-lg border border-slate-700 outline-none w-72 focus:border-indigo-500"
            />
            <span className="text-xs text-slate-400">{filtered.length} componentes ativos</span>
          </div>

          <div className="divide-y divide-slate-800">
            {filtered.map(item => (
              <div key={item.id} className="py-3.5 flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                  <span className="text-xs text-slate-400 font-mono">Resposta: {item.speed}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">{item.commits} commits</span>
                  <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-medium">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}`;

const INITIAL_PREVIEW_HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Nexus Platform</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>body { background-color: #020617; color: #f8fafc; font-family: system-ui, -apple-system, sans-serif; }</style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState } = React;
    function App() {
      const [items, setItems] = useState([
        { id: 1, title: 'Engine de Automação de Código', status: 'Ativo', speed: '12ms', commits: 42 },
        { id: 2, title: 'Sincronizador de Repositório Git', status: 'Sincronizado', speed: '28ms', commits: 89 },
        { id: 3, title: 'Sandbox Interativo de Componentes', status: 'Pronto', speed: '5ms', commits: 120 },
      ]);
      const [filter, setFilter] = useState('');
      const filtered = items.filter(i => i.title.toLowerCase().includes(filter.toLowerCase()));

      return (
        <div className="min-h-screen p-6 max-w-5xl mx-auto space-y-6">
          <header className="flex justify-between items-center pb-6 border-b border-slate-800">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-sm shadow-lg shadow-indigo-500/30">⚡</span>
                Nexus Platform AI
              </h1>
              <p className="text-xs text-slate-400 mt-1">Geração de código reativo com integração direta em repositórios Git</p>
            </div>
            <button onClick={() => alert('Repositório pronto para comitar!')} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md transition">
              Deploy Git
            </button>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400">Total de Módulos</span>
              <div className="text-2xl font-bold text-white mt-1">{items.length}</div>
              <span className="text-[11px] text-emerald-400">100% Operacional</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400">Status do Git</span>
              <div className="text-2xl font-bold text-indigo-400 mt-1 font-mono">main: clean</div>
              <span className="text-[11px] text-slate-400">Sem pendências locais</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400">Latência Média</span>
              <div className="text-2xl font-bold text-emerald-400 mt-1">15ms</div>
              <span className="text-[11px] text-emerald-400">Alta performance</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center gap-4 flex-wrap">
              <input
                type="text"
                placeholder="Filtrar módulos ou componentes..."
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="bg-slate-800 text-xs text-white px-3 py-2 rounded-lg border border-slate-700 outline-none w-72 focus:border-indigo-500"
              />
              <span className="text-xs text-slate-400">{filtered.length} componentes ativos</span>
            </div>

            <div className="divide-y divide-slate-800">
              {filtered.map(item => (
                <div key={item.id} className="py-3.5 flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                    <span className="text-xs text-slate-400 font-mono">Resposta: {item.speed}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">{item.commits} commits</span>
                    <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-medium">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    ReactDOM.render(<App />, document.getElementById('root'));
  </script>
</body>
</html>`;

export default function App() {
  const [appName, setAppName] = useState(INITIAL_APP_NAME);
  const [mode, setMode] = useState<StudioMode>('pro');
  const [activeTab, setActiveTab] = useState<ActiveTab>('preview');
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(true);

  // Files & Git State
  const [files, setFiles] = useState<ProjectFile[]>([
    { path: 'src/App.tsx', content: INITIAL_CODE, description: 'Componente principal React' },
    {
      path: 'package.json',
      content: JSON.stringify({
        name: 'nexus-platform',
        version: '1.0.0',
        private: true,
        dependencies: { react: '^18.3.1', 'react-dom': '^18.3.1', 'lucide-react': '^0.390.0' },
        scripts: { dev: 'vite', build: 'vite build' },
      }, null, 2),
      description: 'Dependências e scripts do projeto',
    },
    {
      path: 'README.md',
      content: `# Nexus Platform\n\nGerado com DevForge Studio AI.\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n`,
      description: 'Instruções para inicialização local e Git',
    },
    {
      path: '.gitignore',
      content: 'node_modules/\ndist/\n.env\n',
      description: 'Regras de exclusão do Git',
    },
  ]);
  const [previousFiles, setPreviousFiles] = useState<ProjectFile[]>([]);
  const [activeFile, setActiveFile] = useState<ProjectFile | null>(null);
  const [previewHtml, setPreviewHtml] = useState(INITIAL_PREVIEW_HTML);

  // Commits & History
  const [commits, setCommits] = useState<GitCommit[]>([
    {
      id: 'c1',
      hash: 'a19f8e4',
      branch: 'main',
      title: 'feat: inicializar arquitetura Nexus com React e Git',
      description: 'Setup inicial de componentes reativos e configuração de repositório.',
      diffSummary: '4 arquivos alterados, +164 inserções',
      timestamp: 'Hoje, 20:30',
      author: 'DevForge AI Studio',
    },
  ]);

  // AI Thinking Stream
  const [thinkingSteps, setThinkingSteps] = useState<string[]>([
    'Análise da arquitetura do projeto e modelo de dados',
    'Geração de componentes React com tipagem TypeScript',
    'Sintetização de layout responsivo com Tailwind CSS',
    'Criação do commit semântico e diffs para Git',
  ]);
  const [currentThinkingIndex, setCurrentThinkingIndex] = useState(0);

  // Code Explanation
  const [explanation, setExplanation] = useState<CodeExplanation>({
    beginnerSummary: 'Este aplicativo utiliza componentes React com estado dinâmico gerenciado pelo hook useState. Os itens são filtrados em tempo real sem recarregar a tela.',
    keyConcepts: [
      'useState: Cria e atualiza o estado de itens e filtros',
      'Tailwind CSS: Estiliza elementos usando classes utilitárias modernas',
      'Git Workflow: Código modular com suporte imediato a commits semânticos',
    ],
    proArchitecture: 'Arquitetura reativa desacoplada, pronta para exportação limpa em Vite ou Next.js.',
  });
  const [isExplaining, setIsExplaining] = useState(false);
  const [explainedText, setExplainedText] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCloudflareModalOpen, setIsCloudflareModalOpen] = useState(false);

  // Check health and API key on mount
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.hasApiKey === 'boolean') {
          setHasApiKey(data.hasApiKey);
        }
      })
      .catch(() => {});
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Generate Project with Gemini or generative fallback
  const handleGenerate = async (promptText: string, framework = 'react-tailwind') => {
    setIsGenerating(true);
    setCurrentThinkingIndex(0);
    setExplainedText(null);

    // Simulate animated step progress during streaming
    const stepInterval = setInterval(() => {
      setCurrentThinkingIndex((prev) => Math.min(prev + 1, thinkingSteps.length - 1));
    }, 900);

    try {
      const res = await fetch('/api/generate-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          mode,
          framework,
          currentCode: files.map((f) => ({ path: f.path, content: f.content })),
        }),
      });

      const responseJson = await res.json();
      clearInterval(stepInterval);

      if (responseJson.success && responseJson.data) {
        const d = responseJson.data;

        // Save previous files to compute Git diff
        setPreviousFiles([...files]);

        if (d.appName) setAppName(d.appName);
        if (d.files && Array.isArray(d.files)) {
          setFiles(d.files);
          setActiveFile(d.files[0] || null);
        }
        if (d.previewHtml) {
          setPreviewHtml(d.previewHtml);
        }
        if (d.explanation) {
          setExplanation(d.explanation);
        }
        if (d.thinkingSteps && Array.isArray(d.thinkingSteps)) {
          setThinkingSteps(d.thinkingSteps);
        }

        // Add new Git commit to project history
        if (d.gitCommit) {
          const newCommit: GitCommit = {
            id: Date.now().toString(),
            hash: Math.random().toString(16).substring(2, 9),
            branch: d.gitCommit.branch || 'main',
            title: d.gitCommit.title || 'feat: update application code',
            description: d.gitCommit.description || 'Alterações automatizadas geradas pela IA',
            diffSummary: d.gitCommit.diffSummary || '3 arquivos alterados',
            timestamp: new Date().toLocaleTimeString(),
            author: 'DevForge AI Engine',
          };
          setCommits([newCommit, ...commits]);
        }

        showToast('Aplicação gerada e sincronizada com sucesso!');
        setActiveTab('preview');
      } else {
        showToast('Erro ao gerar aplicação. Tente novamente.');
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      console.error('Generation error:', err);
      showToast('Falha na comunicação com o servidor');
    } finally {
      setIsGenerating(false);
    }
  };

  // Explain code request
  const handleExplainRequest = async (codeToExplain: string) => {
    setIsExplaining(true);
    setExplainedText(null);
    try {
      const res = await fetch('/api/explain-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: codeToExplain,
          targetAudience: mode,
        }),
      });
      const data = await res.json();
      if (data.success && data.explanation) {
        setExplainedText(data.explanation);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsExplaining(false);
    }
  };

  // Export to Git ZIP
  const handleExportZip = () => {
    const latestCommit = commits[0]?.title || 'feat: automated export from DevForge Studio AI';
    exportProjectToGitZip(appName, files, latestCommit);
    showToast('Download do repositório Git (.ZIP) iniciado!');
  };

  // Handle direct file content editing
  const handleUpdateFileContent = (path: string, newContent: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.path === path ? { ...f, content: newContent, isModified: true } : f))
    );
  };

  // Recompile Preview from current App.tsx code
  const handleRecompilePreview = () => {
    const appFile = files.find((f) => f.path === 'src/App.tsx');
    if (appFile) {
      // Create executable HTML from current react code
      const cleanJsx = appFile.content
        .replace(/import\s+.*?;/g, '')
        .replace(/export\s+default\s+function\s+App/, 'function App');

      const compiledHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>${appName}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>body { background-color: #020617; color: #f8fafc; font-family: system-ui, -apple-system, sans-serif; }</style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    ${cleanJsx}
    ReactDOM.render(<App />, document.getElementById('root'));
  </script>
</body>
</html>`;
      setPreviewHtml(compiledHtml);
      showToast('Preview recompilado com o código editado!');
      setActiveTab('preview');
    }
  };

  // Inject component from Component Studio into project
  const handleInjectComponent = (comp: ComplexComponent) => {
    const compFileName = `src/components/${comp.name.replace(/[^a-zA-Z0-9]/g, '')}.tsx`;
    const newFile: ProjectFile = {
      path: compFileName,
      content: comp.code,
      description: comp.description,
    };

    // If file already exists, update it, otherwise add it
    const exists = files.some((f) => f.path === compFileName);
    const updatedFiles = exists
      ? files.map((f) => (f.path === compFileName ? newFile : f))
      : [...files, newFile];

    setFiles(updatedFiles);
    setActiveFile(newFile);
    showToast(`Componente ${comp.name} injetado em ${compFileName}!`);
    setActiveTab('code');
  };

  // Commit individual component
  const handleCommitComponent = (comp: ComplexComponent) => {
    const newCommit: GitCommit = {
      id: Date.now().toString(),
      hash: Math.random().toString(16).substring(2, 9),
      branch: 'main',
      title: comp.gitCommitMessage,
      description: `Commit isolado do componente ${comp.name}`,
      diffSummary: `1 arquivo adicionado (${comp.name})`,
      timestamp: new Date().toLocaleTimeString(),
      author: 'DevForge AI Component Studio',
    };
    setCommits([newCommit, ...commits]);
    showToast(`Commit registrado: ${comp.gitCommitMessage}`);
  };

  // Generate isolated custom component
  const handleGenerateCustomComponent = (prompt: string) => {
    handleGenerate(`Crie um componente React isolado e avançado: ${prompt}`);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#070b14] text-slate-100 font-sans overflow-hidden">
      {/* Top Navbar */}
      <Navbar
        appName={appName}
        onAppNameChange={setAppName}
        mode={mode}
        onToggleMode={setMode}
        onOpenGitModal={() => setActiveTab('git')}
        onOpenCloudflareModal={() => setIsCloudflareModalOpen(true)}
        onExportZip={handleExportZip}
        onNewProject={() => {
          if (confirm('Deseja iniciar um novo projeto? As alterações atuais serão redefinidas.')) {
            setAppName('Novo Projeto AI');
            setFiles([
              { path: 'src/App.tsx', content: INITIAL_CODE, description: 'Componente inicial' },
            ]);
            setPreviewHtml(INITIAL_PREVIEW_HTML);
            showToast('Novo projeto inicializado');
          }
        }}
        hasApiKey={hasApiKey}
        isGenerating={isGenerating}
      />

      {/* Main Studio Body: Sidebar + Workspace Panes */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: AI Prompt & Architect Stream Sidebar */}
        <PromptSidebar
          mode={mode}
          isGenerating={isGenerating}
          thinkingSteps={thinkingSteps}
          currentThinkingIndex={currentThinkingIndex}
          onGenerate={handleGenerate}
          commits={commits}
          onSelectCommit={(c) => {
            showToast(`Commit selecionado: ${c.hash} - ${c.title}`);
            setActiveTab('git');
          }}
        />

        {/* Center / Right: Tabs & Workspace Area */}
        <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden">
          <WorkspaceTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            viewport={viewport}
            onViewportChange={setViewport}
            onRefreshPreview={() => setPreviewHtml((prev) => prev + ' ')}
            onOpenExternalPreview={() => {
              const blob = new Blob([previewHtml], { type: 'text/html' });
              const url = URL.createObjectURL(blob);
              window.open(url, '_blank');
            }}
            diffCount={previousFiles.length > 0 ? 12 : 0}
          />

          <div className="flex-1 overflow-hidden relative">
            {activeTab === 'preview' && (
              <PreviewSandbox
                htmlContent={previewHtml}
                viewport={viewport}
                isGenerating={isGenerating}
                appName={appName}
              />
            )}

            {activeTab === 'split' && (
              <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
                <div className="flex-1 h-1/2 lg:h-full border-b lg:border-b-0 lg:border-r border-slate-800 overflow-hidden">
                  <PreviewSandbox
                    htmlContent={previewHtml}
                    viewport={viewport}
                    isGenerating={isGenerating}
                    appName={appName}
                  />
                </div>
                <div className="flex-1 h-1/2 lg:h-full overflow-hidden">
                  <CodeWorkspace
                    files={files}
                    activeFile={activeFile}
                    onSelectFile={setActiveFile}
                    onUpdateFileContent={handleUpdateFileContent}
                    mode={mode}
                    explanation={explanation}
                    onExplainRequest={handleExplainRequest}
                    isExplaining={isExplaining}
                    explainedText={explainedText}
                    onRecompilePreview={handleRecompilePreview}
                  />
                </div>
              </div>
            )}

            {activeTab === 'code' && (
              <CodeWorkspace
                files={files}
                activeFile={activeFile}
                onSelectFile={setActiveFile}
                onUpdateFileContent={handleUpdateFileContent}
                mode={mode}
                explanation={explanation}
                onExplainRequest={handleExplainRequest}
                isExplaining={isExplaining}
                explainedText={explainedText}
                onRecompilePreview={handleRecompilePreview}
              />
            )}

            {activeTab === 'diff' && (
              <DiffViewer
                currentFiles={files}
                previousFiles={previousFiles.length > 0 ? previousFiles : files}
              />
            )}

            {activeTab === 'git' && (
              <GitManagerView
                appName={appName}
                files={files}
                commits={commits}
                onExportZip={handleExportZip}
                onCommitCreated={(newCommit) => {
                  setCommits([newCommit, ...commits]);
                  showToast('Commit registrado no Git!');
                }}
              />
            )}

            {activeTab === 'components' && (
              <ComponentStudio
                onInjectComponent={handleInjectComponent}
                onCommitComponent={handleCommitComponent}
                onGenerateCustomComponent={handleGenerateCustomComponent}
                isGenerating={isGenerating}
              />
            )}
          </div>
        </div>
      </div>

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-indigo-500/50 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Cloudflare Pages Publish Modal */}
      <CloudflarePublishModal
        isOpen={isCloudflareModalOpen}
        onClose={() => setIsCloudflareModalOpen(false)}
        appName={appName}
        onExportZip={handleExportZip}
        onOpenGitSync={() => setActiveTab('git')}
      />
    </div>
  );
}
