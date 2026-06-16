"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/env";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/painel";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!hasSupabaseEnv()) {
      setErr("Supabase não configurado. Defina as variáveis de ambiente.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setErr(error.message);
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <main className="flex min-h-dvh items-center justify-center px-6 safe-x">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 block text-center font-display text-3xl text-rose-deep">
          Nailflow
        </Link>

        <form
          onSubmit={onSubmit}
          className="rounded-3xl border border-rose-soft bg-cream/70 p-8 shadow-sm backdrop-blur"
        >
          <h1 className="font-display text-2xl text-ink">Entrar</h1>
          <p className="mt-1 text-sm text-ink-soft">Acesso da equipe do estúdio.</p>

          <label className="mt-6 block text-sm font-medium text-ink">
            E-mail
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-rose-soft bg-white px-4 py-3 text-ink outline-none focus:border-rose"
              placeholder="voce@estudio.com"
            />
          </label>

          <label className="mt-4 block text-sm font-medium text-ink">
            Senha
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-rose-soft bg-white px-4 py-3 text-ink outline-none focus:border-rose"
              placeholder="••••••••"
            />
          </label>

          {err && (
            <p className="mt-4 rounded-lg bg-rose-soft/60 px-3 py-2 text-sm text-rose-deep">
              {err}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-full bg-rose px-6 py-3 font-semibold text-cream transition-colors hover:bg-rose-deep disabled:opacity-60"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <Link href="/" className="mt-6 block text-center text-sm text-ink-soft hover:text-rose-deep">
          ← Voltar ao site
        </Link>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
