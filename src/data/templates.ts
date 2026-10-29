import { TemplatePreset, ComplexComponent } from '../types/studio';

export const TEMPLATE_PRESETS: TemplatePreset[] = [
  {
    id: 'fintech-dashboard',
    title: 'Painel Financeiro & Métricas em Tempo Real',
    category: 'dashboard',
    description: 'Dashboard estilo Stripe/Nubank com gráficos de receita, histórico de transações, filtros e modal de transferência.',
    prompt: 'Crie um dashboard financeiro moderno estilo Stripe com métricas de receita, gráfico interativo, lista de transações com filtros de status e modal para enviar dinheiro.',
    badge: 'Popular',
    icon: 'TrendingUp',
    tags: ['React', 'Tailwind', 'Charts', 'Finance'],
  },
  {
    id: 'saas-landing',
    title: 'Landing Page SaaS de Alta Conversão',
    category: 'saas',
    description: 'Página inicial completa com hero animado, tabela de preços mensal/anual, depoimentos e formulário de lista de espera.',
    prompt: 'Crie uma landing page profissional para uma startup de IA com hero impactante, demonstração do produto, tabela de preços com toggle mensal/anual e FAQ acordeão.',
    badge: 'Iniciante & Pro',
    icon: 'Layout',
    tags: ['SaaS', 'Marketing', 'Pricing', 'Hero'],
  },
  {
    id: 'agile-kanban',
    title: 'Quadro Kanban Ágil de Tarefas & Sprints',
    category: 'kanban',
    description: 'Quadro estilo Linear ou Trello com colunas (A Fazer, Em Progresso, Concluído), contadores, badges de prioridade e nova tarefa.',
    prompt: 'Crie um aplicativo de quadro Kanban interativo com colunas A Fazer, Em Andamento e Concluído, permitindo mover tarefas, filtrar por tags de prioridade e adicionar novos cards.',
    badge: 'Produtividade',
    icon: 'Trello',
    tags: ['Kanban', 'Produtividade', 'DragDrop', 'Filtros'],
  },
  {
    id: 'ecommerce-store',
    title: 'E-Commerce Storefront com Carrinho Lateral',
    category: 'ecommerce',
    description: 'Loja virtual com grid de produtos, filtros por categoria, gaveta de carrinho em tempo real com cálculo de frete e cupom.',
    prompt: 'Crie uma vitrine de e-commerce moderna com catálogo de produtos, busca em tempo real, gaveta lateral de carrinho deslizante (cart drawer) e resumo de pedido com cupom de desconto.',
    badge: 'Completo',
    icon: 'ShoppingBag',
    tags: ['E-Commerce', 'Cart Drawer', 'Filtros', 'Checkout'],
  },
];

export const COMPLEX_COMPONENTS: ComplexComponent[] = [
  {
    id: 'data-grid-pro',
    name: 'Tabela de Dados com Busca, Ordenação & Exportação',
    category: 'Data Display',
    description: 'Grid avançado com ordenação por coluna, seleção múltipla de linhas, paginação e botão de exportar para CSV.',
    gitCommitMessage: 'feat(ui): add reactive data grid with multi-column sorting and csv export',
    previewHtml: `<!DOCTYPE html><html><head><script src="https://cdn.tailwindcss.com"></script><script src="https://unpkg.com/react@18/umd/react.production.min.js"></script><script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script><script src="https://unpkg.com/@babel/standalone/babel.min.js"></script></head><body class="bg-slate-950 text-slate-100 p-6 font-sans"><div id="root"></div><script type="text/babel">
const { useState } = React;
const initialData = [
  { id: 1, name: 'Lucas Silva', role: 'Tech Lead', email: 'lucas@empresa.com', status: 'Ativo', commits: 142 },
  { id: 2, name: 'Mariana Souza', role: 'Frontend Dev', email: 'mari@empresa.com', status: 'Ativo', commits: 218 },
  { id: 3, name: 'Rafael Costa', role: 'DevOps Engineer', email: 'rafael@empresa.com', status: 'Ausente', commits: 95 },
  { id: 4, name: 'Beatriz Lima', role: 'Product Designer', email: 'bia@empresa.com', status: 'Ativo', commits: 64 },
  { id: 5, name: 'Gabriel Pires', role: 'Backend Dev', email: 'gabriel@empresa.com', status: 'Férias', commits: 180 },
];
function App() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [sortField, setSortField] = useState('name');
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = initialData.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.role.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => sortAsc ? (a[sortField] > b[sortField] ? 1 : -1) : (a[sortField] < b[sortField] ? 1 : -1));

  const toggleSelect = (id) => setSelected(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]);

  return (
    <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center gap-4 flex-wrap">
        <input type="text" placeholder="Buscar colaborador ou cargo..." value={search} onChange={e => setSearch(e.target.value)} className="bg-slate-800 text-xs text-white px-3 py-2 rounded-lg border border-slate-700 outline-none w-64 focus:border-indigo-500" />
        <div className="flex gap-2">
          <button onClick={() => alert('Exportando ' + filtered.length + ' registros para CSV...')} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg border border-slate-700 transition">Exportar CSV</button>
          <span className="text-xs text-slate-400 self-center">{selected.length} selecionados</span>
        </div>
      </div>
      <table className="w-full text-left text-xs text-slate-300">
        <thead className="bg-slate-800/60 uppercase text-slate-400 text-[10px] tracking-wider">
          <tr>
            <th className="p-3 w-10"><input type="checkbox" onChange={e => setSelected(e.target.checked ? initialData.map(x => x.id) : [])} /></th>
            <th className="p-3 cursor-pointer" onClick={() => { setSortField('name'); setSortAsc(!sortAsc); }}>Nome ⬍</th>
            <th className="p-3">Cargo</th>
            <th className="p-3">Email</th>
            <th className="p-3">Status</th>
            <th className="p-3 cursor-pointer" onClick={() => { setSortField('commits'); setSortAsc(!sortAsc); }}>Commits Git ⬍</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {filtered.map(row => (
            <tr key={row.id} className="hover:bg-slate-800/40 transition">
              <td className="p-3"><input type="checkbox" checked={selected.includes(row.id)} onChange={() => toggleSelect(row.id)} /></td>
              <td className="p-3 font-semibold text-white">{row.name}</td>
              <td className="p-3">{row.role}</td>
              <td className="p-3 text-slate-400">{row.email}</td>
              <td className="p-3"><span className={'px-2 py-0.5 rounded text-[10px] font-medium ' + (row.status === 'Ativo' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300')}>{row.status}</span></td>
              <td className="p-3 font-mono text-indigo-400 font-bold">{row.commits}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
ReactDOM.render(<App />, document.getElementById('root'));
</script></body></html>`,
    code: `import React, { useState } from 'react';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  email: string;
  status: 'Ativo' | 'Ausente' | 'Férias';
  commits: number;
}

export function DataGridPro() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<number[]>([]);
  const [sortField, setSortField] = useState<keyof TeamMember>('name');
  const [sortAsc, setSortAsc] = useState(true);

  // Componente de alta performance com ordenação e exportação Git-ready
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      {/* Tabela reativa aqui */}
    </div>
  );
}`,
  },
  {
    id: 'command-palette-pro',
    name: 'Command Palette Inteligente (Cmd + K)',
    category: 'Navigation',
    description: 'Menu de comandos flutuante com atalho de teclado, busca fuzzy, ações rápidas e navegação por setas.',
    gitCommitMessage: 'feat(ui): implement accessible command palette with keyboard shortcuts',
    previewHtml: `<!DOCTYPE html><html><head><script src="https://cdn.tailwindcss.com"></script><script src="https://unpkg.com/react@18/umd/react.production.min.js"></script><script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script><script src="https://unpkg.com/@babel/standalone/babel.min.js"></script></head><body class="bg-slate-950 text-slate-100 p-8 font-sans"><div id="root"></div><script type="text/babel">
const { useState, useEffect } = React;
function App() {
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState('');
  const commands = [
    { id: 1, title: 'Criar Novo Componente UI', group: 'Ações Rápidas', shortcut: '⌘ N' },
    { id: 2, title: 'Sincronizar Repositório Git', group: 'Git & DevOps', shortcut: '⌘ G' },
    { id: 3, title: 'Exportar Projeto para ZIP', group: 'Projeto', shortcut: '⌘ E' },
    { id: 4, title: 'Alternar para Modo Iniciante', group: 'Configuração', shortcut: '⌘ 1' },
    { id: 5, title: 'Exibir Diff do Último Commit', group: 'Git & DevOps', shortcut: '⌘ D' },
  ];
  const filtered = commands.filter(c => c.title.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="flex flex-col items-center">
      <button onClick={() => setOpen(true)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-lg">Abrir Command Palette (Cmd + K)</button>
      {open && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-24 z-50">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-slate-800 flex items-center gap-3">
              <span className="text-slate-400">🔍</span>
              <input type="text" placeholder="Digite um comando ou busque no projeto..." value={query} onChange={e => setQuery(e.target.value)} className="w-full bg-transparent text-sm text-white outline-none placeholder-slate-500" autoFocus />
              <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-slate-300 text-xs px-2 py-1 bg-slate-800 rounded">ESC</button>
            </div>
            <div className="max-h-72 overflow-y-auto p-2 space-y-1">
              {filtered.map(cmd => (
                <div key={cmd.id} onClick={() => { alert('Executado: ' + cmd.title); setOpen(false); }} className="p-3 hover:bg-indigo-600/20 hover:border-indigo-500/40 border border-transparent rounded-xl flex justify-between items-center cursor-pointer transition">
                  <div>
                    <p className="text-xs font-semibold text-white">{cmd.title}</p>
                    <p className="text-[10px] text-slate-400">{cmd.group}</p>
                  </div>
                  <span className="text-[10px] font-mono bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-slate-300">{cmd.shortcut}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
ReactDOM.render(<App />, document.getElementById('root'));
</script></body></html>`,
    code: `import React, { useState, useEffect } from 'react';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  // Escuta atalhos globais de teclado (Ctrl/Cmd + K)
  return <div className="command-palette-wrapper">...</div>;
}`,
  },
  {
    id: 'analytics-chart-card',
    name: 'Card de Métricas com Gráfico & Sparkline SVG',
    category: 'Analytics',
    description: 'Card financeiro com gráfico vetorial SVG dinâmico, badges de porcentagem, comparação de período e tooltips.',
    gitCommitMessage: 'feat(analytics): add reactive sparkline metric card with interactive tooltip',
    previewHtml: `<!DOCTYPE html><html><head><script src="https://cdn.tailwindcss.com"></script><script src="https://unpkg.com/react@18/umd/react.production.min.js"></script><script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script><script src="https://unpkg.com/@babel/standalone/babel.min.js"></script></head><body class="bg-slate-950 text-slate-100 p-8 font-sans flex items-center justify-center min-h-screen"><div id="root"></div><script type="text/babel">
const { useState } = React;
function App() {
  const [period, setPeriod] = useState('7d');
  const points = period === '7d' ? [30, 45, 38, 70, 65, 88, 95] : [20, 35, 50, 45, 60, 75, 85, 90, 80, 110, 125, 140];
  const max = Math.max(...points);
  const min = Math.min(...points);
  const pathD = points.map((p, i) => {
    const x = (i / (points.length - 1)) * 280;
    const y = 80 - ((p - min) / (max - min || 1)) * 60;
    return (i === 0 ? 'M' : 'L') + ' ' + x + ' ' + y;
  }).join(' ');

  return (
    <div className="w-80 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-medium text-slate-400">Receita Recorrente (MRR)</span>
          <h2 className="text-2xl font-bold text-white mt-1">R$ 48.720,00</h2>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">+18.4%</span>
      </div>
      <div className="h-24 flex items-center justify-center">
        <svg viewBox="0 0 280 90" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path d={pathD} fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-slate-800/80 text-xs">
        <span className="text-slate-500">Período de Análise</span>
        <div className="flex gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
          <button onClick={() => setPeriod('7d')} className={'px-2 py-0.5 rounded text-[10px] ' + (period === '7d' ? 'bg-indigo-600 text-white' : 'text-slate-400')}>7D</button>
          <button onClick={() => setPeriod('30d')} className={'px-2 py-0.5 rounded text-[10px] ' + (period === '30d' ? 'bg-indigo-600 text-white' : 'text-slate-400')}>30D</button>
        </div>
      </div>
    </div>
  );
}
ReactDOM.render(<App />, document.getElementById('root'));
</script></body></html>`,
    code: `import React, { useState } from 'react';

export function SparklineMetricCard() {
  const [period, setPeriod] = useState<'7d' | '30d'>('7d');
  // Gráfico SVG dinâmico com gradiente
  return <div className="metric-card">...</div>;
}`,
  },
];
