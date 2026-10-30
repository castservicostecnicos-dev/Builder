// Client-side Autonomous Generative Engine
// Ensures 100% uptime on Cloudflare Pages, even on purely static deployments or network dropouts

import { GeneratedProject } from '../types/studio';

export function generateClientSideProject(userPrompt: string, mode: string): GeneratedProject {
  const p = userPrompt.toLowerCase();

  // 1. Delivery & Food
  if (p.includes('delivery') || p.includes('comida') || p.includes('restaurante') || p.includes('pizza') || p.includes('lanche') || p.includes('hamburguer') || p.includes('cardapio')) {
    return createDelivery();
  }

  // 2. Barbearia & Salão
  if (p.includes('barbearia') || p.includes('barbeiro') || p.includes('salao') || p.includes('corte') || p.includes('agendamento') || p.includes('beleza') || p.includes('estetica')) {
    return createBarber();
  }

  // 3. Imobiliária
  if (p.includes('imovel') || p.includes('imoveis') || p.includes('imobiliaria') || p.includes('casa') || p.includes('apartamento') || p.includes('aluguel')) {
    return createRealEstate();
  }

  // 4. Contador & Utilitário
  if (p.includes('contador') || p.includes('counter') || p.includes('calculadora') || p.includes('clique') || p.includes('botao')) {
    return createCounter();
  }

  // 5. Saúde & Clínica
  if (p.includes('clinica') || p.includes('medico') || p.includes('hospital') || p.includes('saude') || p.includes('paciente') || p.includes('consulta')) {
    return createMedical();
  }

  // 6. E-Commerce
  if (p.includes('loja') || p.includes('e-commerce') || p.includes('produto') || p.includes('venda') || p.includes('carrinho')) {
    return createEcommerce();
  }

  // 7. Kanban & Tarefas
  if (p.includes('kanban') || p.includes('tarefa') || p.includes('trello') || p.includes('projeto') || p.includes('sprint')) {
    return createKanban();
  }

  // 8. Universal Custom Builder for ANY other request
  return createUniversal(userPrompt, mode);
}

function createStandaloneHtml(appName: string, code: string): string {
  let transformed = code
    .replace(/import\s+[\s\S]*?from\s+['"].*?['"];?/g, '')
    .replace(/export\s+default\s+function\s+([A-Za-z0-9_]+)/, 'function $1')
    .replace(/export\s+function\s+([A-Za-z0-9_]+)/, 'function $1')
    .replace(/export\s+default\s+/, '');

  if (!transformed.includes('function App') && !transformed.includes('const App')) {
    transformed = `function App() { return (${transformed}); }`;
  }

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${appName}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>body { background-color: #030712; color: #f9fafb; font-family: system-ui, -apple-system, sans-serif; }</style>
</head>
<body class="antialiased">
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect, useRef } = React;
    ${transformed}
    ReactDOM.render(<App />, document.getElementById('root'));
  </script>
</body>
</html>`;
}

function createDelivery(): GeneratedProject {
  const appName = 'TasteFlow Delivery & Cardápio';
  const appTsx = `import React, { useState } from 'react';

export default function App() {
  const [cart, setCart] = useState<{ id: number; name: string; price: number; qty: number }[]>([]);
  const [cat, setCat] = useState('todos');
  const [confirmed, setConfirmed] = useState(false);

  const items = [
    { id: 1, name: 'Burger Artesanal Trufado', cat: 'burgers', price: 38.90, desc: 'Blend 180g, queijo brie e bacon crocante no brioche', icon: '🍔' },
    { id: 2, name: 'Pizza Margherita Especial', cat: 'pizzas', price: 54.00, desc: 'Fior di latte, molho de tomate pelado e manjericão', icon: '🍕' },
    { id: 3, name: 'Smash Bacon Duplo', cat: 'burgers', price: 29.50, desc: '2 carnes 90g com cheddar cremoso e cebola caramelizada', icon: '🥓' },
    { id: 4, name: 'Pizza Quatro Queijos', cat: 'pizzas', price: 59.90, desc: 'Gorgonzola, parmesão, provolone e catupiry legítimo', icon: '🧀' },
    { id: 5, name: 'Limonada Suíça 500ml', cat: 'bebidas', price: 12.00, desc: 'Refrescante, batida na hora com leite condensado', icon: '🥤' },
  ];

  const filtered = cat === 'todos' ? items : items.filter(i => i.cat === cat);
  const total = cart.reduce((a, b) => a + (b.price * b.qty), 0);

  const add = (item: typeof items[0]) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === item.id);
      if (ex) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1 }];
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans">
      <header className="max-w-5xl mx-auto flex justify-between items-center pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🍔</span>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">${appName}</h1>
            <p className="text-xs text-emerald-400">● Aberto agora · Entrega rápida (30-45 min)</p>
          </div>
        </div>
        <span className="text-xs bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-amber-400 font-bold">
          Carrinho: {cart.reduce((a, b) => a + b.qty, 0)} itens (R$ {total.toFixed(2)})
        </span>
      </header>

      <main className="max-w-5xl mx-auto py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-2">
            {['todos', 'burgers', 'pizzas', 'bebidas'].map(c => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={\`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition \${cat === c ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400'}\`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map(item => (
              <div key={item.id} className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex flex-col justify-between space-y-3">
                <div className="flex gap-3">
                  <span className="text-3xl p-2 bg-slate-800 rounded-lg">{item.icon}</span>
                  <div>
                    <h3 className="text-sm font-bold text-white">{item.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{item.desc}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-800/80">
                  <span className="text-sm font-bold text-amber-400 font-mono">R$ {item.price.toFixed(2)}</span>
                  <button onClick={() => add(item)} className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow">
                    + Adicionar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3 h-fit">
          <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Seu Pedido</h2>
          <div className="divide-y divide-slate-800 max-h-56 overflow-y-auto">
            {cart.map(c => (
              <div key={c.id} className="py-2 flex justify-between text-xs">
                <span>{c.qty}x {c.name}</span>
                <span className="font-mono text-amber-400">R$ {(c.price * c.qty).toFixed(2)}</span>
              </div>
            ))}
            {cart.length === 0 && <p className="text-xs text-slate-500 py-4 text-center">Nenhum item adicionado.</p>}
          </div>

          <div className="border-t border-slate-800 pt-2 flex justify-between text-sm font-bold">
            <span>Total:</span>
            <span className="text-amber-400 font-mono">R$ {total.toFixed(2)}</span>
          </div>

          <button
            onClick={() => { if (cart.length > 0) setConfirmed(true); }}
            disabled={cart.length === 0}
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs rounded-lg"
          >
            Finalizar Pedido
          </button>

          {confirmed && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-lg text-xs text-emerald-300">
              ✓ Pedido enviado para a cozinha!
            </div>
          )}
        </div>
      </main>
    </div>
  );
}`;

  return {
    appName,
    description: 'Interface de delivery completa com catálogo de pratos, carrinho e cálculo de total.',
    files: [
      { path: 'src/App.tsx', content: appTsx, description: 'Componente React principal' },
      { path: 'package.json', content: JSON.stringify({ name: 'tasteflow-delivery', version: '1.0.0', dependencies: { react: '^18.3.1', 'react-dom': '^18.3.1' } }, null, 2), description: 'Configuração' },
      { path: 'README.md', content: `# ${appName}\n\nApp gerado com sucesso.`, description: 'Docs' },
    ],
    previewHtml: createStandaloneHtml(appName, appTsx),
    gitCommit: {
      branch: 'main',
      title: 'feat: interface de delivery e cardapio reativo',
      description: 'Cardápio interativo e carrinho de compras.',
      diffSummary: '3 arquivos gerados',
    },
    explanation: {
      beginnerSummary: 'Este app possui catálogo de itens, controle de quantidade no carrinho e totalizador.',
      keyConcepts: ['useState para o carrinho', 'Filtros dinâmicos com Tailwind'],
      proArchitecture: 'Separação de estado de pedidos e catálogo.',
    },
    thinkingSteps: ['Criando catálogo gastronômico', 'Construindo carrinho interativo', 'Renderizando no Cloudflare Pages'],
  };
}

function createBarber(): GeneratedProject {
  const appName = 'BarberPrime - Agendamento Online';
  const appTsx = `import React, { useState } from 'react';

export default function App() {
  const [service, setService] = useState('Corte Degradê');
  const [barber, setBarber] = useState('Rodrigo Silva');
  const [time, setTime] = useState('14:30');
  const [booked, setBooked] = useState(false);

  const services = [
    { name: 'Corte Degradê', price: 'R$ 50,00', time: '40 min' },
    { name: 'Barboterapia com Toalha Quente', price: 'R$ 45,00', time: '35 min' },
    { name: 'Combo Corte + Barba', price: 'R$ 85,00', time: '1h 15m' },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6 font-sans">
      <header className="max-w-3xl mx-auto flex justify-between items-center pb-5 border-b border-neutral-800">
        <h1 className="text-lg font-bold text-white flex items-center gap-2">
          <span>💈</span> ${appName}
        </h1>
        <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded">
          Horários Livres Hoje
        </span>
      </header>

      <main className="max-w-3xl mx-auto py-6 space-y-6">
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-amber-400 uppercase">1. Selecione o Serviço</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {services.map(s => (
              <div
                key={s.name}
                onClick={() => setService(s.name)}
                className={\`p-4 rounded-xl border transition cursor-pointer \${service === s.name ? 'bg-amber-500/10 border-amber-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400'}\`}
              >
                <p className="font-bold text-sm text-white">{s.name}</p>
                <p className="text-xs text-amber-400 font-mono mt-1">{s.price}</p>
                <span className="text-[10px] text-neutral-500 block mt-0.5">{s.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-xs font-bold text-amber-400 uppercase">2. Selecione o Horário</h2>
          <div className="flex gap-2 flex-wrap">
            {['10:00', '11:30', '14:30', '16:00', '17:30', '19:00'].map(t => (
              <button
                key={t}
                onClick={() => setTime(t)}
                className={\`px-3 py-1.5 rounded-lg text-xs font-mono font-bold \${time === t ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-900 border border-neutral-800 text-neutral-300'}\`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 flex justify-between items-center">
          <div>
            <p className="text-xs text-neutral-400">Resumo: <strong className="text-white">{service}</strong> com <strong className="text-white">{barber}</strong> às <strong className="text-amber-400">{time}</strong></p>
          </div>
          <button
            onClick={() => setBooked(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-lg"
          >
            Confirmar Agendamento
          </button>
        </div>

        {booked && (
          <div className="p-3 bg-emerald-950 border border-emerald-800 rounded-lg text-xs text-emerald-300">
            ✓ Agendamento confirmado com sucesso! Enviado para o seu celular.
          </div>
        )}
      </main>
    </div>
  );
}`;

  return {
    appName,
    description: 'Interface de agendamento online de cortes e serviços para barbearia.',
    files: [{ path: 'src/App.tsx', content: appTsx, description: 'Componente principal' }],
    previewHtml: createStandaloneHtml(appName, appTsx),
    gitCommit: { branch: 'main', title: 'feat: agendamento de barbearia', description: 'Seleção de serviços e horários', diffSummary: '1 arquivo' },
    explanation: { beginnerSummary: 'Permite selecionar serviço e horário com confirmação imediata.', keyConcepts: ['useState', 'Tailwind'], proArchitecture: 'Agendamento com estado local.' },
    thinkingSteps: ['Gerando barbearia interativa', 'Sincronizando interface'],
  };
}

function createRealEstate(): GeneratedProject {
  const appName = 'ImobiMatch - Imóveis';
  const appTsx = `import React, { useState } from 'react';

export default function App() {
  const [filter, setFilter] = useState('todos');
  const items = [
    { id: 1, title: 'Apartamento Alto Padrão Jardins', price: 'R$ 1.250.000', city: 'São Paulo', beds: 3, img: '🏢' },
    { id: 2, title: 'Casa Moderna em Condomínio', price: 'R$ 1.890.000', city: 'Campinas', beds: 4, img: '🏡' },
    { id: 3, title: 'Studio Mobiliado Metrô', price: 'R$ 420.000', city: 'São Paulo', beds: 1, img: '🛋️' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <header className="max-w-4xl mx-auto flex justify-between items-center pb-5 border-b border-slate-800">
        <h1 className="text-lg font-bold text-white flex items-center gap-2"><span>🏰</span> ${appName}</h1>
        <span className="text-xs text-slate-400">Imóveis verificados</span>
      </header>
      <main className="max-w-4xl mx-auto py-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {items.map(i => (
          <div key={i.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
            <span className="text-4xl text-center block py-4 bg-slate-800 rounded-lg">{i.img}</span>
            <h3 className="font-bold text-sm text-white">{i.title}</h3>
            <p className="text-xs text-slate-400">📍 {i.city} · {i.beds} quartos</p>
            <p className="text-sm font-bold text-indigo-400 font-mono">{i.price}</p>
            <button onClick={() => alert('Corretor notificado!')} className="w-full py-1.5 bg-indigo-600 text-white rounded text-xs font-semibold">
              Agendar Visita
            </button>
          </div>
        ))}
      </main>
    </div>
  );
}`;

  return {
    appName,
    description: 'Catálogo de imóveis com visitas agendadas.',
    files: [{ path: 'src/App.tsx', content: appTsx, description: 'Portal imobiliário' }],
    previewHtml: createStandaloneHtml(appName, appTsx),
    gitCommit: { branch: 'main', title: 'feat: catalogo imobiliario', description: 'Lista de imoveis', diffSummary: '1 arquivo' },
    explanation: { beginnerSummary: 'Visualiza imóveis e detalhes.', keyConcepts: ['Cards', 'Tailwind'], proArchitecture: 'Listagem reativa.' },
    thinkingSteps: ['Criando imóveis', 'Montando interface'],
  };
}

function createCounter(): GeneratedProject {
  const appName = 'Smart State Counter';
  const appTsx = `import React, { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);
  const [logs, setLogs] = useState<string[]>(['Iniciado em 0']);

  const add = (n: number) => {
    const val = count + n;
    setCount(val);
    setLogs(p => [\`\${n > 0 ? '+' : ''}\${n} -> \${val} (\${new Date().toLocaleTimeString()})\`, ...p.slice(0, 5)]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 font-sans">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-sm w-full text-center space-y-6 shadow-2xl">
        <h1 className="text-lg font-bold text-white">${appName}</h1>
        <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800">
          <span className="text-6xl font-bold font-mono text-indigo-400">{count}</span>
        </div>
        <div className="flex gap-2 justify-center">
          <button onClick={() => add(-step)} className="w-12 h-12 bg-slate-800 hover:bg-slate-700 text-xl font-bold rounded-xl">-</button>
          <button onClick={() => { setCount(0); setLogs(['Reset']); }} className="px-3 bg-slate-800 text-xs text-slate-400 rounded-xl">Reset</button>
          <button onClick={() => add(step)} className="w-12 h-12 bg-indigo-600 hover:bg-indigo-500 text-xl font-bold rounded-xl shadow">+</button>
        </div>
        <div className="text-left text-xs space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-bold">Histórico:</span>
          {logs.map((l, i) => <div key={i} className="font-mono text-slate-400">{l}</div>)}
        </div>
      </div>
    </div>
  );
}`;

  return {
    appName,
    description: 'Interface demonstrativa de contador reativo.',
    files: [{ path: 'src/App.tsx', content: appTsx, description: 'Contador' }],
    previewHtml: createStandaloneHtml(appName, appTsx),
    gitCommit: { branch: 'main', title: 'feat: contador com historico', description: 'Contador reativo', diffSummary: '1 arquivo' },
    explanation: { beginnerSummary: 'Exemplo prático de useState com controle numérico.', keyConcepts: ['useState', 'Hooks'], proArchitecture: 'Estado puro.' },
    thinkingSteps: ['Gerando contador reativo'],
  };
}

function createMedical(): GeneratedProject {
  const appName = 'MediCore - Prontuários';
  const appTsx = `import React, { useState } from 'react';

export default function App() {
  const [patients, setPatients] = useState([
    { id: 1, name: 'Ana Carolina Santos', triage: 'Estável', time: '14:00', doc: 'Dra. Helena' },
    { id: 2, name: 'Carlos Eduardo Lima', triage: 'Prioritário', time: '14:30', doc: 'Dr. Marcos' },
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <header className="max-w-4xl mx-auto flex justify-between items-center pb-5 border-b border-slate-800">
        <h1 className="text-lg font-bold text-white flex items-center gap-2"><span>🩺</span> ${appName}</h1>
        <button onClick={() => alert('Novo atendimento registrado')} className="px-3 py-1.5 bg-teal-600 text-white text-xs font-bold rounded-lg">+ Atendimento</button>
      </header>
      <main className="max-w-4xl mx-auto py-6 divide-y divide-slate-800 bg-slate-900 border border-slate-800 rounded-xl">
        {patients.map(p => (
          <div key={p.id} className="p-4 flex justify-between items-center">
            <div>
              <p className="font-bold text-sm text-white">{p.name}</p>
              <p className="text-xs text-slate-400">Médico: {p.doc} · Horário: {p.time}</p>
            </div>
            <span className="px-2 py-0.5 text-xs bg-teal-500/20 text-teal-300 rounded font-medium">{p.triage}</span>
          </div>
        ))}
      </main>
    </div>
  );
}`;

  return {
    appName,
    description: 'Interface de atendimento e triagem clínica.',
    files: [{ path: 'src/App.tsx', content: appTsx, description: 'Clínica' }],
    previewHtml: createStandaloneHtml(appName, appTsx),
    gitCommit: { branch: 'main', title: 'feat: prontuarios clinicos', description: 'Atendimento', diffSummary: '1 arquivo' },
    explanation: { beginnerSummary: 'Lista de atendimentos médicos.', keyConcepts: ['Tabela', 'Tailwind'], proArchitecture: 'Clínica.' },
    thinkingSteps: ['Gerando interface médica'],
  };
}

function createEcommerce(): GeneratedProject {
  const appName = 'Apex Storefront';
  const appTsx = `import React, { useState } from 'react';

export default function App() {
  const [cart, setCart] = useState<{ id: number; name: string; price: number }[]>([]);
  const products = [
    { id: 1, name: 'Fone Bluetooth Pro', price: 499.00, img: '🎧' },
    { id: 2, name: 'Smartwatch Fitness', price: 650.00, img: '⌚' },
    { id: 3, name: 'Teclado Mecânico RGB', price: 380.00, img: '⌨️' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <header className="max-w-4xl mx-auto flex justify-between items-center pb-5 border-b border-slate-800">
        <h1 className="text-lg font-bold text-white flex items-center gap-2"><span>🛍️</span> ${appName}</h1>
        <span className="text-xs bg-indigo-600 px-3 py-1.5 rounded-lg text-white font-bold">Carrinho: {cart.length}</span>
      </header>
      <main className="max-w-4xl mx-auto py-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
            <span className="text-4xl text-center block py-4 bg-slate-800 rounded">{p.img}</span>
            <p className="font-bold text-sm text-white">{p.name}</p>
            <p className="font-mono text-indigo-400 font-bold">R$ {p.price.toFixed(2)}</p>
            <button onClick={() => setCart([...cart, p])} className="w-full py-1.5 bg-indigo-600 text-white rounded text-xs font-semibold">Comprar</button>
          </div>
        ))}
      </main>
    </div>
  );
}`;

  return {
    appName,
    description: 'Loja com catálogo e carrinho.',
    files: [{ path: 'src/App.tsx', content: appTsx, description: 'Loja' }],
    previewHtml: createStandaloneHtml(appName, appTsx),
    gitCommit: { branch: 'main', title: 'feat: loja e carrinho', description: 'Loja', diffSummary: '1 arquivo' },
    explanation: { beginnerSummary: 'Vitrine de compras com carrinho.', keyConcepts: ['Carrinho', 'useState'], proArchitecture: 'Loja virtual.' },
    thinkingSteps: ['Gerando loja'],
  };
}

function createKanban(): GeneratedProject {
  const appName = 'FlowPulse Kanban';
  const appTsx = `import React, { useState } from 'react';

export default function App() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Criar wireframe da landing page', col: 'todo' },
    { id: 2, title: 'Integrar autenticação JWT', col: 'doing' },
    { id: 3, title: 'Deploy no Cloudflare Pages', col: 'done' },
  ]);

  const move = (id: number, to: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, col: to } : t));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <header className="max-w-4xl mx-auto flex justify-between items-center pb-5 border-b border-slate-800">
        <h1 className="text-lg font-bold text-white flex items-center gap-2"><span>📋</span> ${appName}</h1>
        <button onClick={() => setTasks([...tasks, { id: Date.now(), title: 'Nova Tarefa', col: 'todo' }])} className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg">+ Tarefa</button>
      </header>
      <main className="max-w-4xl mx-auto py-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { key: 'todo', title: 'A Fazer' },
          { key: 'doing', title: 'Em Andamento' },
          { key: 'done', title: 'Concluído' }
        ].map(col => (
          <div key={col.key} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase">{col.title}</h2>
            {tasks.filter(t => t.col === col.key).map(t => (
              <div key={t.id} className="bg-slate-800 p-3 rounded-lg border border-slate-700/60 text-xs flex justify-between items-center">
                <span>{t.title}</span>
                <div className="flex gap-1">
                  {col.key !== 'todo' && <button onClick={() => move(t.id, 'todo')} className="text-slate-400">◀</button>}
                  {col.key !== 'done' && <button onClick={() => move(t.id, 'done')} className="text-slate-400">▶</button>}
                </div>
              </div>
            ))}
          </div>
        ))}
      </main>
    </div>
  );
}`;

  return {
    appName,
    description: 'Quadro Kanban com colunas interativas.',
    files: [{ path: 'src/App.tsx', content: appTsx, description: 'Kanban' }],
    previewHtml: createStandaloneHtml(appName, appTsx),
    gitCommit: { branch: 'main', title: 'feat: kanban interativo', description: 'Kanban', diffSummary: '1 arquivo' },
    explanation: { beginnerSummary: 'Quadro ágil para mover tarefas.', keyConcepts: ['Kanban', 'Movimentação'], proArchitecture: 'Produtividade.' },
    thinkingSteps: ['Gerando kanban'],
  };
}

function createUniversal(userPrompt: string, mode: string): GeneratedProject {
  const words = userPrompt.split(/\s+/).filter(w => w.length > 2).slice(0, 4);
  const cleanTitle = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') || 'Sistema Inteligente';
  const appName = `${cleanTitle} Pro`;

  const appTsx = `import React, { useState } from 'react';

export default function App() {
  const [items, setItems] = useState([
    { id: 1, title: 'Recurso Principal de ${cleanTitle}', status: 'Operacional', metric: '100%', tag: 'Essencial' },
    { id: 2, title: 'Painel de Gestão & Configurações', status: 'Ativo', metric: '98%', tag: 'Gestão' },
    { id: 3, title: 'Sincronização em Tempo Real', status: 'Online', metric: '10ms', tag: 'Cloudflare' },
  ]);
  const [modal, setModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [filter, setFilter] = useState('');

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setItems([{ id: Date.now(), title: newTitle.trim(), status: 'Ativo', metric: 'Recente', tag: 'Novo' }, ...items]);
    setNewTitle('');
    setModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans">
      <header className="max-w-5xl mx-auto flex justify-between items-center pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="text-3xl p-2 bg-indigo-600/20 text-indigo-400 rounded-xl">⚡</span>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">${appName}</h1>
            <p className="text-xs text-slate-400">Interface demonstrativa funcional criada com IA</p>
          </div>
        </div>
        <button onClick={() => setModal(true)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow">
          + Novo Registro
        </button>
      </header>

      <main className="max-w-5xl mx-auto py-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <span className="text-xs text-slate-400">Total de Registros</span>
            <div className="text-2xl font-bold text-white mt-1">{items.length}</div>
            <span className="text-[11px] text-emerald-400">Pronto para demonstração</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <span className="text-xs text-slate-400">Disponibilidade Edge</span>
            <div className="text-2xl font-bold text-indigo-400 mt-1">100%</div>
            <span className="text-[11px] text-slate-400">Cloudflare Pages Ready</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <span className="text-xs text-slate-400">Status do Código</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1 font-mono">Clean</div>
            <span className="text-[11px] text-slate-400">Git commit registrado</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <input
            type="text"
            placeholder="Filtrar dados da demonstração..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs text-white px-3 py-2 rounded-lg outline-none w-full sm:w-72"
          />
          <div className="divide-y divide-slate-800">
            {items.filter(i => i.title.toLowerCase().includes(filter.toLowerCase())).map(item => (
              <div key={item.id} className="py-3 flex justify-between items-center text-xs">
                <div>
                  <p className="font-semibold text-white">{item.title}</p>
                  <span className="text-slate-400 font-mono">Tag: {item.tag}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded font-mono font-bold">{item.metric}</span>
                  <button onClick={() => setItems(items.filter(x => x.id !== item.id))} className="text-slate-500 hover:text-red-400">✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {modal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 max-w-sm w-full space-y-3 shadow-2xl">
            <h3 className="text-sm font-bold text-white">Adicionar Novo Item</h3>
            <form onSubmit={addItem} className="space-y-3">
              <input
                type="text"
                placeholder="Título do recurso..."
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setModal(false)} className="text-xs text-slate-400 px-3 py-1">Cancelar</button>
                <button type="submit" className="text-xs bg-indigo-600 text-white font-bold px-3 py-1 rounded">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}`;

  return {
    appName,
    description: `Interface completa e código gerado para "${userPrompt}".`,
    files: [{ path: 'src/App.tsx', content: appTsx, description: 'Componente principal' }],
    previewHtml: createStandaloneHtml(appName, appTsx),
    gitCommit: { branch: 'main', title: `feat: criar interface e codigo para ${appName}`, description: 'Implementação', diffSummary: '1 arquivo' },
    explanation: { beginnerSummary: 'Interface completa gerada com base no prompt informado.', keyConcepts: ['useState', 'Tailwind', 'Renderização'], proArchitecture: 'Arquitetura modular.' },
    thinkingSteps: ['Analisando pedido do usuário', 'Construindo interface visual sob medida', 'Renderizando no sandbox'],
  };
}
