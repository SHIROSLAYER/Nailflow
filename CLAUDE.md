@AGENTS.md

# 💅 Nailflow — Guia do Projeto

Plataforma completa para estúdio de unhas: **site público + galeria/portfólio + agendamento online + painel de gestão**. Estúdio de referência: **Marcela Carvalho Studio**.

## Stack
- **Next.js 16** (App Router, Turbopack) · **TypeScript** · **Tailwind CSS v4** · **Supabase** (`@supabase/ssr`)
- Motion: **GSAP + @gsap/react** (`useGSAP`, ScrollTrigger)
- Fontes: **Playfair Display** (display) + **Inter** (corpo). Paleta rose/cream editorial (tokens em `globals.css`).

## Ambiente de dev (Windows)
- Node v24 está em `C:\Program Files\nodejs` mas **FORA do PATH** do shell. Prefixe nos comandos:
  `$env:Path = "C:\Program Files\nodejs;" + $env:Path` (PowerShell). Use **PowerShell**, não o Bash, pra `npm`/`npx` (o wrapper `.cmd` quebra com espaço no caminho).
- Rodar: `npm run dev` → http://localhost:3000 · Build: `npm run build`.
- Preview (Claude Code): config `nailflow` em `.claude/launch.json`, porta 3000.

## Supabase
- **Projeto: `doqsuoxofjtzigsfvxgc`** (MCP hospedado configurado em `.mcp.json`, gitignored).
- O MCP só conecta com o Claude aberto **nesta pasta** + login OAuth no navegador (1ª vez).
- Com o MCP ligado: puxar URL/anon key via `get_project_url` / `get_publishable_keys` → montar `.env.local` (gitignored) e env vars na Vercel. **Nunca** commitar chaves.
- RLS **deny-by-default** em toda tabela.

## Deploy
- **Vercel** (auto-deploy a cada `git push` na `main`). URL pública: **https://nailflow-ruby.vercel.app**.
- Repo: `https://github.com/SHIROSLAYER/Nailflow.git`. Git já autenticado nesta máquina.

## Estrutura
```
src/
├── app/
│   ├── page.tsx          # landing → renderiza <Landing/>
│   ├── layout.tsx        # fontes + metadata
│   ├── globals.css       # tokens da marca (cores, fontes)
│   ├── galeria/          # stub (Fase 1)
│   ├── agendar/          # stub (Fase 2)
│   └── painel/           # stub (Fase 3, protegido)
└── components/
    └── Landing.tsx       # landing completa com GSAP (client component)
└── lib/supabase/         # clients browser + server (@supabase/ssr)
```

## Convenções de motion (GSAP)
- Só animar `transform`/`opacity` (GPU). Respeitar `prefers-reduced-motion` (via `gsap.matchMedia`).
- SplitText é pago → split manual de palavras (componente `SplitWords` em `Landing.tsx`).
- Elementos com `data-reveal` começam invisíveis (`.js-anim [data-reveal]` no CSS) e o GSAP revela no scroll.

## Status / Roadmap
- **Fase 0 — Fundação** ✅ scaffold, clients Supabase, rotas.
- **Fase 1 — Site + Galeria** 🟡 landing pronta ✅; **falta galeria com fotos reais** (Supabase Storage).
- **Fase 2 — Agendamento** ⬜ tabelas `services`/`availability`/`appointments` + RLS + tela de marcar horário (aqui o servidor da Vercel entra).
- **Fase 3 — Painel** ⬜ auth + papéis, agenda, clientes, financeiro.
- **Fase 4 — Polimento** ⬜ notificações, lembretes, domínio próprio.

### Próximo passo sugerido
Com o Supabase MCP ligado: começar a **Fase 2** — criar o schema de agendamento (`services`, `appointments`) com RLS, ou fechar a **Fase 1** (galeria real via Storage). Confirmar com o usuário qual primeiro.

> Histórico desta fundação foi construído a partir de uma sessão no projeto FiberMap Pro (via caminhos absolutos). Daqui em diante, trabalhar **nesta pasta**.
