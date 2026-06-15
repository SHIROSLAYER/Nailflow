import Link from "next/link";

export default function Painel() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-bold text-zinc-900">Painel de gestão</h1>
      <p className="mt-4 text-zinc-500">
        Área interna protegida. Em breve: agenda, clientes, serviços e financeiro.
        {" "}<span className="text-rose-500">Fase 3</span> do roadmap.
      </p>
      <Link href="/" className="mt-8 text-rose-600 hover:underline">
        ← Voltar
      </Link>
    </main>
  );
}
