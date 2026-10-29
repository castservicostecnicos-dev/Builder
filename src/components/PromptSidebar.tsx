import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Layers, 
  Terminal, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Wand2, 
  HelpCircle,
  FileCode2,
  ChevronRight,
  History,
  Maximize2,
  Minimize2,
  Upload,
  Trash2,
  Infinity as InfinityIcon,
  Check
} from 'lucide-react';
import { StudioMode, TemplatePreset, GitCommit } from '../types/studio';
import { TEMPLATE_PRESETS } from '../data/templates';

interface PromptSidebarProps {
  mode: StudioMode;
  isGenerating: boolean;
  thinkingSteps: string[];
  currentThinkingIndex: number;
  onGenerate: (prompt: string, framework?: string) => void;
  commits: GitCommit[];
  onSelectCommit: (commit: GitCommit) => void;
}

export const PromptSidebar: React.FC<PromptSidebarProps> = ({
  mode,
  isGenerating,
  thinkingSteps,
  currentThinkingIndex,
  onGenerate,
  commits,
  onSelectCommit,
}) => {
  const [prompt, setPrompt] = useState('');
  const [selectedFramework, setSelectedFramework] = useState('react-tailwind');
  const [showHistory, setShowHistory] = useState(false);
  const [isExpandedModal, setIsExpandedModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    onGenerate(prompt.trim(), selectedFramework);
    if (isExpandedModal) {
      setIsExpandedModal(false);
    }
  };

  const handleSelectTemplate = (template: TemplatePreset) => {
    setPrompt(template.prompt);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setPrompt((prev) => (prev ? `${prev}\n\n${content}` : content));
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const estimatedTokens = Math.ceil(prompt.length / 4);

  return (
    <>
      <aside className="w-80 md:w-96 flex flex-col bg-[#0d1322] border-r border-slate-800 h-[calc(100vh-3.5rem)] select-none">
        {/* Sidebar Header & Mode Banner */}
        <div className="p-3 border-b border-slate-800/80 bg-slate-900/50">
          {mode === 'beginner' ? (
            <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/50 flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <span className="font-semibold text-emerald-300 block">Modo Iniciante Ativo</span>
                <p className="text-emerald-200/80">
                  Descreva sua ideia sem restrições. A IA construirá o app completo, explicará o código e gerará o repositório Git.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-800/50 flex items-start gap-2.5">
              <Terminal className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <span className="font-semibold text-indigo-300 block">Modo Desenvolvedor Profissional</span>
                <p className="text-indigo-200/80">
                  Suporta prompts extensos, PRDs, especificações completas de arquitetura, diffs e sincronização direta no Git.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Main Form & Thinking Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Prompt Input Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
                  Instruções & Requisitos
                </label>
                
                {/* Character & Token indicators (unlimited) */}
                <div className="flex items-center gap-1.5">
                  <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                    <InfinityIcon className="w-3 h-3" />
                    <span>Sem Limite</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsExpandedModal(true)}
                    className="p-1 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 rounded transition"
                    title="Expandir editor de prompt em tela cheia"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Textarea without character limit, resizable vertically */}
              <div className="relative flex flex-col">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={
                    mode === 'beginner'
                      ? 'Descreva seu app ou site sem limite de texto! Você pode colar ideias longas, especificações ou regras detalhadas...'
                      : 'Cole especificações de arquitetura, PRD, interfaces TypeScript ou regras de negócio completas sem nenhum limite de caracteres...'
                  }
                  rows={6}
                  className="w-full min-h-[130px] max-h-[380px] bg-slate-900/90 border border-slate-700/80 focus:border-indigo-500 rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none resize-y shadow-inner leading-relaxed transition font-mono pb-9 select-text"
                  disabled={isGenerating}
                />

                {/* Bottom Bar inside/below textarea with actions and live metrics */}
                <div className="flex items-center justify-between pt-1.5 px-1 text-[10px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400">
                      {prompt.length.toLocaleString()} caracteres
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="font-mono text-slate-500">
                      ~{estimatedTokens.toLocaleString()} tokens
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Upload file directly into prompt */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".txt,.md,.json,.ts,.tsx,.js,.jsx,.html,.css"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-1 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 rounded transition"
                      title="Carregar arquivo de texto (.txt, .md, .tsx) para o prompt"
                    >
                      <Upload className="w-3.5 h-3.5" />
                    </button>

                    {prompt.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setPrompt('')}
                        className="p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded transition"
                        title="Limpar campo do prompt"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={!prompt.trim() || isGenerating}
                    className="w-full py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 disabled:opacity-40 text-white text-xs font-semibold rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isGenerating ? 'Processando Código com IA...' : 'Gerar Código com IA'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Framework / Tech Selector */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
              <span className="text-[11px] text-slate-400">Stack de Saída:</span>
              <select
                value={selectedFramework}
                onChange={(e) => setSelectedFramework(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-[11px] text-indigo-300 rounded-lg px-2 py-1 outline-none cursor-pointer"
              >
                <option value="react-tailwind">React + Tailwind CSS (Vite)</option>
                <option value="nextjs">Next.js App Router (TypeScript)</option>
                <option value="vue-tailwind">Vue 3 + Tailwind CSS</option>
              </select>
            </div>
          </form>

          {/* AI Architect Thinking Stream (While Generating or Recent) */}
          {isGenerating && (
            <div className="p-3.5 bg-slate-900/90 border border-indigo-500/40 rounded-xl space-y-2.5 shadow-lg shadow-indigo-500/10 animate-pulse">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Raciocínio da IA em Execução</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                {thinkingSteps.map((step, idx) => {
                  const isCurrent = idx === currentThinkingIndex;
                  const isDone = idx < currentThinkingIndex;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 transition-all ${
                        isCurrent
                          ? 'text-white font-medium pl-1'
                          : isDone
                          ? 'text-emerald-400'
                          : 'text-slate-500'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : isCurrent ? (
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping shrink-0" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-700 shrink-0" />
                      )}
                      <span className="truncate">{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Suggestion Templates */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Templates Rápidos
              </span>
              <span className="text-[10px] text-indigo-400 font-medium">1-Click</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {TEMPLATE_PRESETS.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => handleSelectTemplate(tmpl)}
                  className="text-left p-2.5 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/90 hover:border-slate-700 rounded-xl transition group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-white group-hover:text-indigo-400 transition">
                      {tmpl.title}
                    </span>
                    <span className="text-[9px] font-medium px-1.5 py-0.2 bg-slate-800 text-slate-400 rounded">
                      {tmpl.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{tmpl.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Git Commit History Sidebar Drawer */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div 
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center justify-between cursor-pointer text-xs font-semibold text-slate-400 hover:text-slate-200 transition"
            >
              <span className="flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-indigo-400" />
                Histórico de Commits ({commits.length})
              </span>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showHistory ? 'rotate-90' : ''}`} />
            </div>

            {showHistory && (
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {commits.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => onSelectCommit(c)}
                    className="p-2 bg-slate-900/70 border border-slate-800 hover:border-indigo-500/50 rounded-lg text-[11px] cursor-pointer transition space-y-1"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-indigo-400 font-semibold">{c.hash}</span>
                      <span className="text-slate-500 text-[10px]">{c.timestamp}</span>
                    </div>
                    <p className="text-slate-300 font-medium line-clamp-1">{c.title}</p>
                    <span className="text-[10px] text-slate-500 block truncate">{c.diffSummary}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Fullscreen / Expanded Prompt Workbench Modal for massive inputs */}
      {isExpandedModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 font-sans">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                  <Wand2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    Editor de Prompt Extenso (Sem Limites)
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Capacidade Ilimitada
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Cole documentos inteiros, requisitos de PRD, contratos de API e modelos de dados
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-indigo-400">
                  {prompt.length.toLocaleString()} caracteres · ~{estimatedTokens.toLocaleString()} tokens
                </span>
                <button
                  type="button"
                  onClick={() => setIsExpandedModal(false)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Textarea */}
            <div className="flex-1 p-4 bg-slate-950 font-mono text-xs">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Cole ou digite aqui seu prompt de qualquer tamanho sem restrição de caracteres..."
                className="w-full h-full bg-transparent text-slate-100 placeholder-slate-600 outline-none resize-none leading-relaxed select-text"
                autoFocus
              />
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Carregar Arquivo</span>
                </button>
                {prompt.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setPrompt('')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs rounded-lg transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Limpar</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsExpandedModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!prompt.trim() || isGenerating}
                  className="flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold rounded-xl shadow-lg transition cursor-pointer disabled:opacity-40"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isGenerating ? 'Gerando...' : 'Executar Prompt com IA'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
