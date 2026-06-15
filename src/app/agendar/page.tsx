import Link from "next/link";

export default function Agendar() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-bold text-zinc-900">Agendar horário</h1>
      <p className="mt-4 text-zinc-500">
        Em breve: escolha de serviço, data e hora com confirmação.
        {" "}<span className="text-rose-500">Fase 2</span> do roadmap.
      </p>
      <Link href="/" className="mt-8 text-rose-600 hover:underline">
        ← Voltar
      </Link>
    </main>
  );
}
