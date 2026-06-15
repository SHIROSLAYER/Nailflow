# 💅 Nailflow

Plataforma completa para estúdio de unhas: **site público + galeria/portfólio + agendamento online + painel de gestão**.

Stack: **Next.js (App Router) · TypeScript · Tailwind CSS · Supabase**.

---

## 🚀 Rodar localmente

```bash
npm install
cp .env.local.example .env.local   # preencha as chaves do Supabase
npm run dev                        # http://localhost:3000
```

> Requer Node 18+ (testado com Node 24).

---

## 🧱 Arquitetura

| Área | Rota | Quem usa | Status |
|------|------|----------|--------|
| **Site público** | `/` | Visitantes | 🟡 esqueleto |
| **Galeria / Portfólio** | `/galeria` | Visitantes | 🟡 stub |
| **Agendamento online** | `/agendar` | Clientes | 🟡 stub |
| **Painel de gestão** | `/painel` | Dona / profissionais | 🟡 stub (protegido) |

```
src/
├── app/                 # rotas (App Router)
│   ├── page.tsx         # landing pública
│   ├── galeria/
│   ├── agendar/
│   └── painel/          # área interna (futuro: auth + RLS)
└── lib/
    └── supabase/        # clients browser + server (@supabase/ssr)
```

---

## 🗺️ Roadmap (MVP em fases)

**Fase 0 — Fundação** ✅ _(atual)_
- Scaffold Next.js + Tailwind + TS
- Clientes Supabase (browser/server)
- Estrutura de rotas das 4 áreas

**Fase 1 — Site público + Galeria**
- Landing real (hero, serviços, preços, depoimentos, contato/WhatsApp)
- Galeria filtrável de designs (gel, fibra, francesinha…) com imagens no Supabase Storage

**Fase 2 — Agendamento**
- Tabelas `services`, `availability`, `appointments` (Supabase)
- Fluxo: cliente escolhe serviço → data/hora livre → confirma → e-mail/WhatsApp
- RLS: cliente vê só os próprios agendamentos

**Fase 3 — Painel de gestão**
- Auth (Supabase) + papéis (dona/profissional)
- Agenda do dia, CRUD de clientes/serviços, status de agendamentos
- Financeiro: faturamento, comissões

**Fase 4 — Polimento**
- Notificações, lembretes, responsivo/mobile, deploy (Vercel)

---

## 🔐 Supabase
Chaves em `.env.local` (nunca commitadas). Toda tabela com **RLS deny-by-default**.
Schema e policies entram a partir da Fase 2.
