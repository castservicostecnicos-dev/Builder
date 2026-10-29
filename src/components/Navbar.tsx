import React from 'react';
import { 
  Sparkles, 
  GitBranch, 
  Download, 
  Github, 
  BookOpen, 
  Cpu, 
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { StudioMode } from '../types/studio';

interface NavbarProps {
  appName: string;
  onAppNameChange: (name: string) => void;
  mode: StudioMode;
  onToggleMode: (mode: StudioMode) => void;
  onOpenGitModal: () => void;
  onExportZip: () => void;
  onNewProject: () => void;
  hasApiKey: boolean;
  isGenerating: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  appName,
  onAppNameChange,
  mode,
  onToggleMode,
  onOpenGitModal,
  onExportZip,
  onNewProject,
  hasApiKey,
  isGenerating,
}) => {
  return (
    <header className="h-14 border-b border-slate-800 bg-[#0d1322] px-4 flex items-center justify-between z-40 select-none">
      {/* Brand & Project Info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white tracking-tight">DevForge</span>
              <span className="text-[10px] font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-1.5 py-0.2 rounded">
                STUDIO AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono hidden sm:block">Engine Gemini 3.8 & Git Automation</p>
          </div>
        </div>

        <div className="h-4 w-px bg-slate-800 mx-1 hidden md:block" />

        {/* Editable App Name */}
        <div className="hidden sm:flex items-center gap-1 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800 focus-within:border-indigo-500 transition">
          <span className="text-xs text-slate-400 font-mono">app/</span>
          <input
            type="text"
            value={appName}
            onChange={(e) => onAppNameChange(e.target.value)}
            className="text-xs font-semibold text-white bg-transparent outline-none w-36 sm:w-48 placeholder-slate-500"
            placeholder="Nome do App..."
          />
        </div>
      </div>

      {/* Mode Switcher & API Status */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Beginner vs Pro Mode Toggle */}
        <div className="bg-slate-900 p-0.5 rounded-lg border border-slate-800 flex items-center text-xs">
          <button
            onClick={() => onToggleMode('beginner')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-medium ${
              mode === 'beginner'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Interface simplificada com explicações detalhadas de código e componentes"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Iniciante</span>
          </button>
          <button
            onClick={() => onToggleMode('pro')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-medium ${
              mode === 'pro'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Modo completo com controle de branches Git, diffs de código e AST avançado"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Profissional</span>
          </button>
        </div>

        {/* API Engine indicator */}
        <div className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-md bg-slate-900/70 border border-slate-800 text-[11px] text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Gemini 3.8</span>
        </div>

        {/* Action Buttons */}
        <button
          onClick={onExportZip}
          disabled={isGenerating}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700/80 transition cursor-pointer shadow-sm disabled:opacity-50"
          title="Baixar projeto completo como pacote .ZIP pronto para Git"
        >
          <Download className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Baixar Git (.ZIP)</span>
        </button>

        <button
          onClick={onOpenGitModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 active:scale-95 text-white text-xs font-semibold rounded-lg shadow-md shadow-indigo-600/25 transition cursor-pointer"
          title="Sincronizar e comitar alterações diretamente para o Git / GitHub"
        >
          <GitBranch className="w-3.5 h-3.5" />
          <span>Git Sync</span>
        </button>

        <button
          onClick={onNewProject}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          title="Novo Projeto em Branco"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
