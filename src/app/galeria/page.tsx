import Link from "next/link";

export default function Galeria() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-bold text-zinc-900">Galeria</h1>
      <p className="mt-4 text-zinc-500">
        Em breve: portfólio filtrável de designs (gel, fibra, francesinha…).
        {" "}<span className="text-rose-500">Fase 1</span> do roadmap.
      </p>
      <Link href="/" className="mt-8 text-rose-600 hover:underline">
        ← Voltar
      </Link>
    </main>
  );
}
