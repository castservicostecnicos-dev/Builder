import React, { useState } from 'react';
import { 
  FileCode2, 
  FileJson, 
  FileText, 
  Copy, 
  Check, 
  Play, 
  BookOpen, 
  Sparkles, 
  Code,
  Save,
  Info
} from 'lucide-react';
import { ProjectFile, StudioMode, CodeExplanation } from '../types/studio';

interface CodeWorkspaceProps {
  files: ProjectFile[];
  activeFile: ProjectFile | null;
  onSelectFile: (file: ProjectFile) => void;
  onUpdateFileContent: (path: string, content: string) => void;
  mode: StudioMode;
  explanation?: CodeExplanation;
  onExplainRequest: (code: string) => void;
  isExplaining?: boolean;
  explainedText?: string | null;
  onRecompilePreview: () => void;
}

export const CodeWorkspace: React.FC<CodeWorkspaceProps> = ({
  files,
  activeFile,
  onSelectFile,
  onUpdateFileContent,
  mode,
  explanation,
  onExplainRequest,
  isExplaining = false,
  explainedText = null,
  onRecompilePreview,
}) => {
  const [copied, setCopied] = useState(false);
  const [showExplanationModal, setShowExplanationModal] = useState(false);

  const currentFile = activeFile || files[0] || null;

  const handleCopy = () => {
    if (!currentFile) return;
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getFileIcon = (path: string) => {
    if (path.endsWith('.tsx') || path.endsWith('.ts') || path.endsWith('.js') || path.endsWith('.jsx')) {
      return <FileCode2 className="w-4 h-4 text-blue-400" />;
    }
    if (path.endsWith('.json')) {
      return <FileJson className="w-4 h-4 text-amber-400" />;
    }
    return <FileText className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full bg-[#0a0e17] overflow-hidden select-none">
      {/* File Tree Explorer (Left sub-panel) */}
      <div className="w-full md:w-60 border-b md:border-b-0 md:border-r border-slate-800 bg-[#0d1322] flex flex-col shrink-0">
        <div className="p-3 border-b border-slate-800/80 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Arquivos do Projeto ({files.length})
          </span>
          <span className="text-[10px] text-indigo-400 font-mono">Git Workspace</span>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {files.map((file) => {
            const isSelected = currentFile?.path === file.path;
            return (
              <button
                key={file.path}
                onClick={() => onSelectFile(file)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono transition text-left cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {getFileIcon(file.path)}
                  <span className="truncate">{file.path}</span>
                </div>
                {file.isModified && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" title="Modificado" />
                )}
              </button>
            );
          })}
        </div>

        {/* Beginner Education Box in Sidebar */}
        {mode === 'beginner' && explanation && (
          <div className="p-3 bg-emerald-950/30 border-t border-emerald-900/40 text-[11px] space-y-2">
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              Conceitos Usados Aqui:
            </span>
            <ul className="list-disc list-inside text-emerald-200/80 space-y-1">
              {explanation.keyConcepts.slice(0, 3).map((concept, idx) => (
                <li key={idx} className="line-clamp-2">{concept}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Code Editor & Viewer (Center main area) */}
      <div className="flex-1 flex flex-col h-full bg-[#080c14] overflow-hidden">
        {/* Editor Top Bar */}
        <div className="h-10 border-b border-slate-800/80 bg-[#0d1322] px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
            {currentFile && getFileIcon(currentFile.path)}
            <span className="font-semibold text-white">{currentFile?.path || 'Nenhum arquivo selecionado'}</span>
            {currentFile?.description && (
              <span className="text-[11px] text-slate-500 hidden lg:inline">
                — {currentFile.description}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (currentFile) onExplainRequest(currentFile.content);
                setShowExplanationModal(true);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs rounded-md border border-indigo-500/30 transition cursor-pointer"
              title="Explicar como o código funciona em linguagem simples"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{mode === 'beginner' ? 'Explicar Código' : 'Análise Técnica'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-md transition cursor-pointer"
              title="Copiar código para a área de transferência"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>

            <button
              onClick={onRecompilePreview}
              className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-md shadow-sm transition cursor-pointer"
              title="Aplicar alterações e atualizar o preview sandbox"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Salvar & Recompilar</span>
            </button>
          </div>
        </div>

        {/* Text Area Code Editor with Line Numbers */}
        <div className="flex-1 overflow-auto flex p-2 font-mono text-xs leading-relaxed select-text">
          {currentFile ? (
            <div className="flex-1 flex gap-3 min-h-full">
              {/* Line Numbers */}
              <div className="select-none text-slate-600 text-right pr-2 border-r border-slate-800/80 pt-1 shrink-0 font-mono">
                {currentFile.content.split('\n').map((_, i) => (
                  <div key={i} className="h-5 text-[11px]">{i + 1}</div>
                ))}
              </div>

              {/* Editable Text Area */}
              <textarea
                value={currentFile.content}
                onChange={(e) => onUpdateFileContent(currentFile.path, e.target.value)}
                spellCheck={false}
                className="flex-1 bg-transparent text-slate-200 outline-none resize-none font-mono text-[12px] leading-5 whitespace-pre pt-1 selection:bg-indigo-600 selection:text-white"
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
              Selecione um arquivo para inspecionar.
            </div>
          )}
        </div>
      </div>

      {/* AI Code Explanation Modal / Drawer */}
      {showExplanationModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">
                  {mode === 'beginner' ? 'Explicação Didática do Código' : 'Análise Técnica & Arquitetura'}
                </h3>
              </div>
              <button
                onClick={() => setShowExplanationModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
              {isExplaining ? (
                <div className="flex items-center gap-2 text-indigo-400 py-8 justify-center">
                  <Sparkles className="w-5 h-5 animate-spin" />
                  <span>Gerando explicação sob medida com o Gemini...</span>
                </div>
              ) : explainedText ? (
                <div className="whitespace-pre-line bg-slate-950 p-4 rounded-xl border border-slate-800">
                  {explainedText}
                </div>
              ) : explanation ? (
                <div className="space-y-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <h4 className="font-bold text-white mb-2">Visão Geral:</h4>
                    <p>{explanation.beginnerSummary}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2">Conceitos Essenciais:</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-400">
                      {explanation.keyConcepts.map((kc, i) => (
                        <li key={i}>{kc}</li>
                      ))}
                    </ul>
                  </div>
                  {mode === 'pro' && (
                    <div className="bg-indigo-950/30 p-3 rounded-xl border border-indigo-900/40">
                      <h4 className="font-bold text-indigo-300 mb-1">Notas de Arquitetura Sênior:</h4>
                      <p className="text-indigo-200/80">{explanation.proArchitecture}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p>Nenhuma explicação disponível no momento.</p>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowExplanationModal(false)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
