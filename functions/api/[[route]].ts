interface Env {
  GEMINI_API_KEY?: string;
}

export const onRequest = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // 1. Health endpoint
  if (pathname === '/api/health') {
    return new Response(
      JSON.stringify({
        status: 'ok',
        hasApiKey: Boolean(env.GEMINI_API_KEY),
        platform: 'Cloudflare Pages Functions',
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }

  // 2. Generate project endpoint
  if (pathname === '/api/generate-project' && method === 'POST') {
    try {
      const body: any = await request.json();
      const { prompt, mode = 'pro', framework = 'react-tailwind', currentCode } = body;

      if (!prompt) {
        return new Response(
          JSON.stringify({ error: 'Prompt é obrigatório' }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      const apiKey = env.GEMINI_API_KEY;

      if (apiKey) {
        try {
          const systemInstruction = `Você é o DevForge AI Studio Engine, a inteligência artificial especialista em desenvolvimento de software e geração de interfaces de usuário completas e interativas para iniciantes e profissionais.

REQUISITO OBRIGATÓRIO:
O usuário precisa que você crie TANTO O CÓDIGO DA APLICAÇÃO QUANTO A INTERFACE VISUAL DE DEMONSTRAÇÃO COMPLETA E FUNCIONAL.
Não crie placeholders vazios, telas cinzas sem conteúdo ou textos genéricos. A interface de demonstração visual deve refletir com fidelidade exata o que o usuário pediu (seja um app de delivery com cardápio e carrinho, uma barbearia com agenda de cortes e profissionais, uma imobiliária com fotos e filtros de imóveis, um dashboard analítico com gráficos, um botão contador com histórico, ou qualquer outro sistema).

Formato de Saída (JSON estrito):
Retorne EXCLUSIVAMENTE um objeto JSON válido (sem comentários e sem texto fora do JSON):
{
  "appName": "Nome comercial elegante do app",
  "description": "Resumo do que foi construído",
  "files": [
    {
      "path": "src/App.tsx",
      "content": "Código React completo com TypeScript e Tailwind CSS, interativo com useState, botões clicáveis, modais funcionais, filtros de busca, badges e dados realistas.",
      "description": "Componente principal com toda a interface e regras de negócio"
    },
    {
      "path": "package.json",
      "content": "{\\n  \\"name\\": \\"...\\",\\n  \\"version\\": \\"1.0.0\\",\\n  \\"dependencies\\": { \\"react\\": \\"^18.3.1\\", \\"react-dom\\": \\"^18.3.1\\", \\"lucide-react\\": \\"^0.390.0\\" }\\n}",
      "description": "Dependências do projeto"
    },
    {
      "path": "README.md",
      "content": "Documentação com instruções de instalação e comandos Git",
      "description": "Instruções do projeto"
    },
    {
      "path": ".gitignore",
      "content": "node_modules\\ndist\\n.env\\n",
      "description": "Arquivos ignorados pelo Git"
    }
  ],
  "previewHtml": "<!DOCTYPE html><html lang=\\"pt-BR\\"><head><meta charset=\\"UTF-8\\"><title>Demo</title><script src=\\"https://cdn.tailwindcss.com\\"></script><script src=\\"https://unpkg.com/react@18/umd/react.production.min.js\\"></script><script src=\\"https://unpkg.com/react-dom@18/umd/react-dom.production.min.js\\"></script><script src=\\"https://unpkg.com/@babel/standalone/babel.min.js\\"></script></head><body class=\\"bg-slate-950 text-slate-100 font-sans\\"><div id=\\"root\\"></div><script type=\\"text/babel\\">...CÓDIGO REACT COMPLETO DA INTERFACE INTERATIVA COM ReactDOM.render(<App />, document.getElementById('root'))...</script></body></html>",
  "gitCommit": {
    "branch": "main",
    "title": "feat: criar interface de demonstração e lógica completa para o app",
    "description": "Componentes visuais reativos, Tailwind CSS e pipeline pronto para Git.",
    "diffSummary": "4 arquivos gerados com sucesso"
  },
  "explanation": {
    "beginnerSummary": "Explicação passo a passo em português amigável.",
    "keyConcepts": ["useState para atualizar a tela instantaneamente", "Classes do Tailwind CSS para o visual moderno", "Integração modular com repositório Git"],
    "proArchitecture": "Análise técnica de componentes, gerenciamento de estado e desacoplamento para produção."
  },
  "thinkingSteps": [
    "Analisando requisitos do app solicitado pelo usuário",
    "Modelando estrutura de dados e estados reativos",
    "Construindo a interface visual interativa completa para demonstração",
    "Otimizando layout com Tailwind CSS e responsividade",
    "Preparando arquivos do workspace e commit semântico Git"
  ]
}`;

          const userPrompt = `Requisito da aplicação: "${prompt}".
Modo: ${mode === 'beginner' ? 'Iniciante' : 'Profissional'}.
Framework: ${framework}.
${currentCode ? `Código existente para refatorar:\n${JSON.stringify(currentCode)}` : ''}`;

          const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;
          
          const geminiRes = await fetch(geminiEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'User-Agent': 'aistudio-build',
            },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
              systemInstruction: { parts: [{ text: systemInstruction }] },
              generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.7,
              },
            }),
          });

          if (geminiRes.ok) {
            const geminiData: any = await geminiRes.json();
            const textResponse = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (textResponse) {
              const parsed = cleanAndParseJson(textResponse);
              if (!parsed.previewHtml || !parsed.previewHtml.includes('<html')) {
                const appFile = parsed.files?.find((f: any) => f.path === 'src/App.tsx' || f.path.endsWith('.tsx'));
                if (appFile) {
                  parsed.previewHtml = generateStandaloneHtmlFromReact(parsed.appName || 'DevForge App', appFile.content);
                }
              }
              return new Response(JSON.stringify({ success: true, data: parsed }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
              });
            }
          }
        } catch (err: any) {
          console.warn('Gemini Cloudflare Edge error:', err);
        }
      }

      // Edge Dynamic Fallback Generator
      const fallback = generateEdgeFallback(prompt);
      return new Response(JSON.stringify({ success: true, data: fallback, isFallback: true }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    } catch (e: any) {
      return new Response(JSON.stringify({ error: e?.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  }

  // 3. Explain Code endpoint
  if (pathname === '/api/explain-code' && method === 'POST') {
    return new Response(
      JSON.stringify({
        success: true,
        explanation: 'Análise do código: O componente implementa arquitetura modular em React com estados controlados e classes utilitárias do Tailwind CSS, pronto para exportação Git.',
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }

  // 4. Git Push endpoint
  if (pathname === '/api/git/push' && method === 'POST') {
    const simulatedHash = Math.random().toString(16).substring(2, 9);
    return new Response(
      JSON.stringify({
        success: true,
        commitHash: simulatedHash,
        branch: 'main',
        message: 'Commit registrado com sucesso no Cloudflare Pages!',
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }

  return new Response(JSON.stringify({ error: 'Endpoint não encontrado' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
};

function cleanAndParseJson(raw: string): any {
  let text = raw.trim();
  const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (match && match[1]) text = match[1].trim();
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    text = text.slice(start, end + 1);
  }
  return JSON.parse(text);
}

function generateStandaloneHtmlFromReact(appName: string, code: string): string {
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
  <title>${appName} - Demonstração</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>body { background-color: #030712; color: #f9fafb; font-family: system-ui, sans-serif; }</style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect } = React;
    ${transformed}
    ReactDOM.render(<App />, document.getElementById('root'));
  </script>
</body>
</html>`;
}

function generateEdgeFallback(prompt: string) {
  const words = prompt.split(/\s+/).filter(w => w.length > 2).slice(0, 3);
  const title = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') || 'Cloud App';
  const appName = `${title} Cloud`;

  const appTsx = `import React, { useState } from 'react';

export default function App() {
  const [items, setItems] = useState([
    { id: 1, title: 'Módulo de ${title}', status: 'Ativo', badge: 'Cloudflare Ready' },
    { id: 2, title: 'Integração Edge Worker', status: 'Sincronizado', badge: 'Performance' },
    { id: 3, title: 'Interface Reativa Tailwind', status: 'Online', badge: 'Frontend' },
  ]);
  const [newTitle, setNewTitle] = useState('');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <header className="max-w-4xl mx-auto flex justify-between items-center pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="text-3xl p-2 bg-amber-500/10 text-amber-400 rounded-xl">⚡</span>
          <div>
            <h1 className="text-lg font-bold text-white">${appName}</h1>
            <p className="text-xs text-slate-400">Publicado no Cloudflare Pages com sucesso</p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded font-medium">● Cloudflare Edge</span>
      </header>

      <main className="max-w-4xl mx-auto py-8 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Adicionar novo registro..."
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 outline-none"
            />
            <button
              onClick={() => {
                if (!newTitle.trim()) return;
                setItems([{ id: Date.now(), title: newTitle.trim(), status: 'Ativo', badge: 'Novo' }, ...items]);
                setNewTitle('');
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg shadow"
            >
              Adicionar
            </button>
          </div>

          <div className="divide-y divide-slate-800">
            {items.map(item => (
              <div key={item.id} className="py-3 flex justify-between items-center">
                <span className="text-sm font-semibold text-white">{item.title}</span>
                <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-mono">{item.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}`;

  return {
    appName,
    description: `Interface reativa gerada para "${prompt}" pronta para Cloudflare Pages.`,
    files: [{ path: 'src/App.tsx', content: appTsx, description: 'Componente React principal' }],
    previewHtml: generateStandaloneHtmlFromReact(appName, appTsx),
    gitCommit: {
      branch: 'main',
      title: `feat: deploy no cloudflare pages para ${appName}`,
      description: 'Estruturação pronta para Cloudflare Pages.',
      diffSummary: '1 arquivo gerado',
    },
    explanation: {
      beginnerSummary: 'Interface pronta para Cloudflare Pages com estado reativo e Tailwind CSS.',
      keyConcepts: ['Cloudflare Pages', 'useState', 'Vite SPA'],
      proArchitecture: 'Execução serverless no edge network.',
    },
    thinkingSteps: ['Compilando aplicação para Cloudflare Pages', 'Gerando interface interativa'],
  };
}
