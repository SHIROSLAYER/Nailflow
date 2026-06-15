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

---

## ☁️ Deploy (Vercel)

Next.js **não** vira `index.html` estático — a Vercel faz o build (`npm run build`) a cada push.
O repositório guarda só o código-fonte; nada de `index.html` é necessário no git.

**Passo a passo (uma vez só):**
1. Acesse <https://vercel.com> → entre com a conta do **GitHub**.
2. **Add New… → Project** → importe `SHIROSLAYER/Nailflow`.
3. A Vercel detecta Next.js sozinha. **Deploy**.
4. (Quando houver Supabase) **Project → Settings → Environment Variables**, adicione:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Pronto: URL tipo `nailflow.vercel.app`. Cada `git push` na `main` redeploya automático.

> A landing atual builda e publica **sem** as variáveis (ainda não há chamada ao Supabase).
> Elas só passam a ser necessárias a partir da Fase 1/2.
