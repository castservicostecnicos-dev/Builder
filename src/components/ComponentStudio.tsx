import React, { useState } from 'react';
import { 
  Boxes, 
  Code2, 
  Play, 
  Copy, 
  Check, 
  GitCommit, 
  Sparkles, 
  Plus, 
  ArrowRight
} from 'lucide-react';
import { ComplexComponent } from '../types/studio';
import { COMPLEX_COMPONENTS } from '../data/templates';

interface ComponentStudioProps {
  onInjectComponent: (comp: ComplexComponent) => void;
  onCommitComponent: (comp: ComplexComponent) => void;
  onGenerateCustomComponent: (prompt: string) => void;
  isGenerating: boolean;
}

export const ComponentStudio: React.FC<ComponentStudioProps> = ({
  onInjectComponent,
  onCommitComponent,
  onGenerateCustomComponent,
  isGenerating,
}) => {
  const [components, setComponents] = useState<ComplexComponent[]>(COMPLEX_COMPONENTS);
  const [selectedComp, setSelectedComp] = useState<ComplexComponent>(COMPLEX_COMPONENTS[0]);
  const [activeView, setActiveView] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedComp.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    onGenerateCustomComponent(customPrompt.trim());
    setCustomPrompt('');
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full bg-[#080c14] overflow-hidden select-none font-sans">
      {/* Component Library Sidebar */}
      <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-slate-800 bg-[#0d1322] flex flex-col shrink-0">
        <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Boxes className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Componentes Complexos
            </h3>
          </div>
          <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded">
            {components.length} prontos
          </span>
        </div>

        {/* Custom Component Generator Prompt Box */}
        <div className="p-3 border-b border-slate-800/80 bg-slate-900/60">
          <form onSubmit={handleCustomSubmit} className="space-y-2">
            <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              Gerar Novo Componente Isolado:
            </label>
            <div className="flex gap-1.5">
              <input
                type="text"
                placeholder="Ex: Form multi-etapas com stepper..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={!customPrompt.trim() || isGenerating}
                className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                +
              </button>
            </div>
          </form>
        </div>

        {/* List of Components */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {components.map((comp) => {
            const isSelected = selectedComp.id === comp.id;
            return (
              <div
                key={comp.id}
                onClick={() => setSelectedComp(comp)}
                className={`p-3 rounded-xl border transition cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800 border-indigo-500/50 shadow-md'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-white">{comp.name}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 bg-slate-800 text-slate-400 rounded">
                    {comp.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">{comp.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Component Playground & Preview */}
      <div className="flex-1 flex flex-col h-full bg-[#0a0e17] overflow-hidden">
        {/* Top Bar for Selected Component */}
        <div className="h-12 border-b border-slate-800 bg-[#0d1322] px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xs font-bold text-white">{selectedComp.name}</h2>
            <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setActiveView('preview')}
                className={`px-2.5 py-1 rounded transition font-medium ${
                  activeView === 'preview'
                    ? 'bg-slate-800 text-indigo-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Preview
              </button>
              <button
                onClick={() => setActiveView('code')}
                className={`px-2.5 py-1 rounded transition font-medium ${
                  activeView === 'code'
                    ? 'bg-slate-800 text-indigo-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Código TSX
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar TSX'}</span>
            </button>

            <button
              onClick={() => onInjectComponent(selectedComp)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Injetar no App</span>
            </button>

            <button
              onClick={() => onCommitComponent(selectedComp)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 text-xs font-semibold rounded-lg transition cursor-pointer"
            >
              <GitCommit className="w-3.5 h-3.5" />
              <span>Comitar no Git</span>
            </button>
          </div>
        </div>

        {/* View Content (Preview Sandbox or Code) */}
        <div className="flex-1 overflow-hidden relative">
          {activeView === 'preview' ? (
            <iframe
              srcDoc={selectedComp.previewHtml}
              title={selectedComp.name}
              sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
              className="w-full h-full border-none bg-slate-950"
            />
          ) : (
            <div className="w-full h-full overflow-auto p-4 bg-[#080c14] font-mono text-xs text-slate-200 select-text whitespace-pre leading-relaxed">
              {selectedComp.code}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
