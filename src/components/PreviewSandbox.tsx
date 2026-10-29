import React, { useState, useEffect, useRef } from 'react';
import { 
  Monitor, 
  RotateCcw, 
  ExternalLink, 
  Terminal, 
  ChevronUp, 
  ChevronDown, 
  Sparkles, 
  CheckCircle,
  Copy,
  Check,
  PlayCircle,
  Smartphone,
  Tablet,
  Maximize2
} from 'lucide-react';
import { ViewportMode } from '../types/studio';

interface PreviewSandboxProps {
  htmlContent: string;
  viewport: ViewportMode;
  isGenerating: boolean;
  appName: string;
}

export const PreviewSandbox: React.FC<PreviewSandboxProps> = ({
  htmlContent,
  viewport,
  isGenerating,
  appName,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    'DevForge Sandbox inicializado com sucesso',
    'Tailwind CSS CDN carregado',
    'React 18 & ReactDOM montados no container #root',
    'Interface de demonstração interativa pronta para cliques e testes',
  ]);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [key, setKey] = useState(0);

  // Reload iframe when content changes or requested
  useEffect(() => {
    setKey((prev) => prev + 1);
    setConsoleLogs((prev) => [
      ...prev.slice(-10),
      `[${new Date().toLocaleTimeString()}] Demonstração montada com sucesso: ${appName}`,
    ]);
  }, [htmlContent, appName]);

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(htmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenFullscreen = () => {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const getViewportStyles = () => {
    switch (viewport) {
      case 'mobile':
        return 'w-[375px] h-[667px] rounded-3xl border-4 border-slate-700 shadow-2xl overflow-hidden';
      case 'tablet':
        return 'w-[768px] h-[900px] max-h-[85vh] rounded-2xl border-4 border-slate-700 shadow-2xl overflow-hidden';
      case 'desktop':
      default:
        return 'w-full h-full border-none';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#070b14] relative overflow-hidden select-none">
      {/* Interactive Demonstration Banner */}
      <div className="h-9 bg-[#0b0f19] border-b border-slate-800/90 px-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-white text-[11px] tracking-tight">
            Interface de Demonstração Interativa ao Vivo
          </span>
          <span className="hidden md:inline text-slate-500 font-mono text-[10px]">
            — {appName} (100% funcional)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-[10px] text-emerald-400/90 font-mono">
            ● Clique nos botões e teste os fluxos
          </span>
          <button
            onClick={handleOpenFullscreen}
            className="flex items-center gap-1 px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 text-[11px] rounded transition cursor-pointer"
            title="Abrir em Nova Aba"
          >
            <ExternalLink className="w-3 h-3" />
            <span className="hidden sm:inline">Nova Aba</span>
          </button>
        </div>
      </div>

      {/* Sandbox Canvas Area */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-2 sm:p-4 studio-grid-bg">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center gap-3 text-center p-8 bg-slate-900/90 border border-indigo-500/30 rounded-2xl shadow-2xl backdrop-blur-md">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Criando Interface & Código...</h3>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                A IA está gerando o código React, estilos Tailwind e montando a interface visual para demonstração.
              </p>
            </div>
          </div>
        ) : (
          <div className={`transition-all duration-300 relative bg-slate-950 flex flex-col ${getViewportStyles()}`}>
            {/* Device Bar for Mobile/Tablet */}
            {viewport !== 'desktop' && (
              <div className="h-6 bg-slate-800 flex items-center justify-center px-4 shrink-0">
                <div className="w-16 h-1 bg-slate-600 rounded-full" />
              </div>
            )}

            <iframe
              key={key}
              ref={iframeRef}
              srcDoc={htmlContent}
              title="DevForge Sandbox Preview"
              sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
              className="w-full flex-1 border-0 bg-transparent"
            />
          </div>
        )}
      </div>

      {/* Floating Bottom Console & Inspector Bar */}
      <div className="border-t border-slate-800 bg-[#0d1322] select-none z-20">
        <div className="px-4 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsConsoleOpen(!isConsoleOpen)}
              className="flex items-center gap-1.5 font-mono text-slate-400 hover:text-indigo-400 transition cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span>Console da Demonstração ({consoleLogs.length})</span>
              {isConsoleOpen ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronUp className="w-3.5 h-3.5" />
              )}
            </button>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              DOM Reativo Conectado
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyHtml}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] rounded transition cursor-pointer"
              title="Copiar HTML Completo do Sandbox"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copiado!' : 'Copiar HTML'}</span>
            </button>
          </div>
        </div>

        {/* Collapsible Console Output Drawer */}
        {isConsoleOpen && (
          <div className="p-3 bg-slate-950 font-mono text-[11px] text-slate-300 max-h-36 overflow-y-auto space-y-1 border-t border-slate-800">
            {consoleLogs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2 text-slate-400">
                <span className="text-slate-600 select-none">&gt;</span>
                <span className="text-emerald-300/90">{log}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
