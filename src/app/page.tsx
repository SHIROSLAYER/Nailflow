import Link from "next/link";

const services = [
  { name: "Alongamento em Fibra", desc: "Resistência e naturalidade", price: "a partir de R$ 120" },
  { name: "Unhas em Gel", desc: "Brilho e durabilidade", price: "a partir de R$ 90" },
  { name: "Esmaltação em Gel", desc: "Cor que dura semanas", price: "a partir de R$ 60" },
  { name: "Nail Art", desc: "Designs autorais", price: "sob consulta" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-rose-50 text-zinc-800">
      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="text-xl font-semibold tracking-tight text-rose-600">
          Nailflow<span className="text-zinc-400">.studio</span>
        </span>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/galeria" className="hover:text-rose-600">Galeria</Link>
          <Link
            href="/agendar"
            className="rounded-full bg-rose-600 px-5 py-2 font-medium text-white shadow-sm transition hover:bg-rose-500"
          >
            Agendar
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-12 text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-rose-500">
          Estúdio de unhas
        </p>
        <h1 className="mx-auto max-w-3xl text-balance text-5xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-6xl">
          Suas mãos merecem um cuidado{" "}
          <span className="text-rose-600">impecável</span>.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-zinc-600">
          Alongamento, gel e nail art com hora marcada. Reserve seu horário
          online em segundos.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/agendar"
            className="rounded-full bg-rose-600 px-8 py-3 font-semibold text-white shadow-md transition hover:bg-rose-500"
          >
            Agendar horário
          </Link>
          <Link
            href="/galeria"
            className="rounded-full border border-rose-200 bg-white px-8 py-3 font-semibold text-rose-600 transition hover:border-rose-300"
          >
            Ver trabalhos
          </Link>
        </div>
      </section>

      {/* Serviços */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="mb-8 text-center text-2xl font-bold text-zinc-900">
          Serviços
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <div
              key={s.name}
              className="rounded-2xl border border-rose-100 bg-white/70 p-6 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-zinc-900">{s.name}</h3>
              <p className="mt-1 text-sm text-zinc-500">{s.desc}</p>
              <p className="mt-4 text-sm font-medium text-rose-600">{s.price}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-rose-100 py-8 text-center text-sm text-zinc-400">
        Nailflow · feito com Next.js + Supabase
      </footer>
    </main>
  );
}
