import React from 'react';
import { 
  Play, 
  Code2, 
  GitCompare, 
  GitBranch, 
  Boxes, 
  Monitor, 
  Tablet, 
  Smartphone,
  RotateCcw,
  Columns2,
  ExternalLink
} from 'lucide-react';
import { ActiveTab, ViewportMode } from '../types/studio';

interface WorkspaceTabsProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  viewport: ViewportMode;
  onViewportChange: (viewport: ViewportMode) => void;
  onRefreshPreview: () => void;
  onOpenExternalPreview?: () => void;
  diffCount?: number;
}

export const WorkspaceTabs: React.FC<WorkspaceTabsProps> = ({
  activeTab,
  onTabChange,
  viewport,
  onViewportChange,
  onRefreshPreview,
  onOpenExternalPreview,
  diffCount = 0,
}) => {
  return (
    <div className="h-11 bg-[#0b0f19] border-b border-slate-800 flex items-center justify-between px-3 select-none">
      {/* Tab Navigation */}
      <div className="flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => onTabChange('preview')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
            activeTab === 'preview'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
          title="Ver e interagir com a interface demonstrativa gerada"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
          <span>Interface de Demonstração</span>
        </button>

        <button
          onClick={() => onTabChange('split')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
            activeTab === 'split'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
          title="Ver Interface e Código Lado a Lado"
        >
          <Columns2 className="w-3.5 h-3.5" />
          <span>Tela Dividida (Demo + Código)</span>
        </button>

        <button
          onClick={() => onTabChange('code')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
            activeTab === 'code'
              ? 'bg-slate-800 text-indigo-400 border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Código & Arquivos</span>
        </button>

        <button
          onClick={() => onTabChange('diff')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
            activeTab === 'diff'
              ? 'bg-slate-800 text-indigo-400 border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <GitCompare className="w-3.5 h-3.5" />
          <span>Git Diff</span>
          {diffCount > 0 && (
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1 rounded-full">
              +{diffCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onTabChange('git')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
            activeTab === 'git'
              ? 'bg-slate-800 text-indigo-400 border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <GitBranch className="w-3.5 h-3.5" />
          <span>Git & Repositório</span>
        </button>

        <button
          onClick={() => onTabChange('components')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
            activeTab === 'components'
              ? 'bg-slate-800 text-indigo-400 border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Boxes className="w-3.5 h-3.5" />
          <span>Componentes Complexos</span>
        </button>
      </div>

      {/* Right Controls: Viewports & Reload (Active in Preview or Split mode) */}
      {(activeTab === 'preview' || activeTab === 'split') && (
        <div className="flex items-center gap-2 shrink-0">
          {/* Responsive Viewport Switcher */}
          <div className="hidden sm:flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-slate-400">
            <button
              onClick={() => onViewportChange('desktop')}
              className={`p-1 rounded transition ${
                viewport === 'desktop' ? 'bg-slate-800 text-white' : 'hover:text-slate-200'
              }`}
              title="Visualização Desktop (100%)"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onViewportChange('tablet')}
              className={`p-1 rounded transition ${
                viewport === 'tablet' ? 'bg-slate-800 text-white' : 'hover:text-slate-200'
              }`}
              title="Visualização Tablet (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onViewportChange('mobile')}
              className={`p-1 rounded transition ${
                viewport === 'mobile' ? 'bg-slate-800 text-white' : 'hover:text-slate-200'
              }`}
              title="Visualização Mobile (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          {onOpenExternalPreview && (
            <button
              onClick={onOpenExternalPreview}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="Abrir App de Demonstração em Tela Cheia / Nova Janela"
            >
              <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
            </button>
          )}

          <button
            onClick={onRefreshPreview}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            title="Recarregar Demonstração"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
