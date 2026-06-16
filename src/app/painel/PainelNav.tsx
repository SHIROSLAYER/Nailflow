"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export default function PainelNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    if (hasSupabaseEnv()) {
      await createClient().auth.signOut();
    }
    router.push("/login");
    router.refresh();
  }

  const links = [
    { href: "/painel", label: "Agenda" },
    { href: "/painel/conteudo", label: "Conteúdo" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-rose-soft bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 safe-x">
        <div className="flex items-center gap-6">
          <Link href="/painel" className="font-display text-xl text-rose-deep">
            Nailflow
          </Link>
          <nav className="flex gap-1">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-rose text-cream"
                      : "text-ink-soft hover:bg-rose-soft/50"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <button
          onClick={logout}
          className="rounded-full border border-rose/40 px-4 py-1.5 text-sm font-medium text-rose-deep transition-colors hover:bg-rose-soft/50"
        >
          Sair
        </button>
      </div>
    </header>
  );
}
