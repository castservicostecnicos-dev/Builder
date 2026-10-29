import React, { useState } from 'react';
import { GitCompare, FileCode2, Plus, Minus, Check } from 'lucide-react';
import { ProjectFile } from '../types/studio';

interface DiffViewerProps {
  currentFiles: ProjectFile[];
  previousFiles: ProjectFile[];
}

export const DiffViewer: React.FC<DiffViewerProps> = ({
  currentFiles,
  previousFiles,
}) => {
  const [selectedPath, setSelectedPath] = useState(
    currentFiles[0]?.path || 'src/App.tsx'
  );

  const currentFile = currentFiles.find((f) => f.path === selectedPath);
  const previousFile = previousFiles.find((f) => f.path === selectedPath);

  // Compute simple unified line diff
  const computeDiffLines = () => {
    const curLines = currentFile ? currentFile.content.split('\n') : [];
    const prevLines = previousFile ? previousFile.content.split('\n') : [];

    if (prevLines.length === 0) {
      // Entirely new file
      return curLines.map((line, idx) => ({
        type: 'add' as const,
        lineNumNew: idx + 1,
        lineNumOld: null,
        text: line,
      }));
    }

    const diff: Array<{
      type: 'add' | 'remove' | 'normal';
      lineNumNew: number | null;
      lineNumOld: number | null;
      text: string;
    }> = [];

    const maxLines = Math.max(curLines.length, prevLines.length);

    for (let i = 0; i < maxLines; i++) {
      const c = curLines[i];
      const p = prevLines[i];

      if (c === p) {
        diff.push({
          type: 'normal',
          lineNumNew: i + 1,
          lineNumOld: i + 1,
          text: c,
        });
      } else {
        if (p !== undefined) {
          diff.push({
            type: 'remove',
            lineNumNew: null,
            lineNumOld: i + 1,
            text: p,
          });
        }
        if (c !== undefined) {
          diff.push({
            type: 'add',
            lineNumNew: i + 1,
            lineNumOld: null,
            text: c,
          });
        }
      }
    }

    return diff;
  };

  const diffLines = computeDiffLines();
  const additions = diffLines.filter((l) => l.type === 'add').length;
  const deletions = diffLines.filter((l) => l.type === 'remove').length;

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full bg-[#080c14] overflow-hidden select-none font-sans">
      {/* File selector sidebar */}
      <div className="w-full md:w-60 border-b md:border-b-0 md:border-r border-slate-800 bg-[#0d1322] p-3 space-y-2 shrink-0">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          Arquivos com Alterações
        </span>
        <div className="space-y-1">
          {currentFiles.map((f) => (
            <button
              key={f.path}
              onClick={() => setSelectedPath(f.path)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono transition text-left cursor-pointer ${
                selectedPath === f.path
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <FileCode2 className="w-3.5 h-3.5 text-indigo-400" />
                <span className="truncate">{f.path}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Diff Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Diff Header */}
        <div className="h-10 border-b border-slate-800 bg-[#0d1322] px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="font-semibold text-white">{selectedPath}</span>
            <span className="text-slate-500">|</span>
            <span className="text-emerald-400 font-bold">+{additions}</span>
            <span className="text-rose-400 font-bold">-{deletions}</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Visualizador Git Diff</span>
        </div>

        {/* Diff lines view */}
        <div className="flex-1 overflow-auto p-2 font-mono text-[11px] leading-5 select-text">
          {diffLines.map((line, idx) => {
            let bgClass = 'hover:bg-slate-800/30 text-slate-300';
            let sign = ' ';
            let signClass = 'text-slate-600';

            if (line.type === 'add') {
              bgClass = 'bg-emerald-950/40 text-emerald-200';
              sign = '+';
              signClass = 'text-emerald-400 font-bold';
            } else if (line.type === 'remove') {
              bgClass = 'bg-rose-950/40 text-rose-200 line-through opacity-80';
              sign = '-';
              signClass = 'text-rose-400 font-bold';
            }

            return (
              <div key={idx} className={`flex items-start gap-2 px-2 py-0.5 rounded ${bgClass}`}>
                <span className="w-8 text-right select-none text-slate-600 text-[10px]">
                  {line.lineNumOld ?? ''}
                </span>
                <span className="w-8 text-right select-none text-slate-600 text-[10px]">
                  {line.lineNumNew ?? ''}
                </span>
                <span className={`w-3 select-none ${signClass}`}>{sign}</span>
                <span className="flex-1 whitespace-pre">{line.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
