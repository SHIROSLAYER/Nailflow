"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { GalleryImage } from "@/lib/types";
import dynamic from "next/dynamic";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Esmalte 3D — só no navegador (three.js precisa de window)
const HeroPolish3D = dynamic(() => import("./HeroPolish3D"), { ssr: false });

const DEFAULT_HERO_TITLE = "Suas mãos merecem arte.";
const DEFAULT_HERO_SUBTITLE =
  "Alongamento, gel e nail art feitos com cuidado de verdade. Reserve seu horário online em segundos.";

/* ---------------------------------------------------------------- data --- */

const SERVICES = [
  { name: "Alongamento em Fibra", desc: "Resistência e naturalidade que duram.", price: "R$ 120" },
  { name: "Unhas em Gel", desc: "Brilho de espelho, força de verdade.", price: "R$ 90" },
  { name: "Esmaltação em Gel", desc: "Cor impecável por semanas.", price: "R$ 60" },
  { name: "Nail Art Autoral", desc: "Designs criados só para você.", price: "sob consulta" },
  { name: "Banho de Gel", desc: "Reforço para unhas naturais.", price: "R$ 75" },
  { name: "Manutenção", desc: "Seu visual sempre em dia.", price: "R$ 70" },
];

const GALLERY = [
  { label: "Francesinha", tone: "from-rose-soft to-cream-deep", span: "row-span-2" },
  { label: "Nude Glow", tone: "from-cream-deep to-rose-soft", span: "" },
  { label: "Cromado", tone: "from-mauve/30 to-cream-deep", span: "" },
  { label: "Floral", tone: "from-rose-soft to-mauve/30", span: "row-span-2" },
  { label: "Glitter", tone: "from-gold/25 to-cream-deep", span: "" },
  { label: "Minimal", tone: "from-cream-deep to-gold/20", span: "" },
];

const STATS = [
  { value: 8, suffix: "+", label: "anos de experiência" },
  { value: 1200, suffix: "+", label: "clientes felizes" },
  { value: 150, suffix: "+", label: "designs exclusivos" },
  { value: 5, suffix: "★", label: "avaliação média" },
];

const TESTIMONIALS = [
  { name: "Marina S.", text: "Saio de lá sempre me sentindo nova. As unhas duram muito e o atendimento é impecável." },
  { name: "Bia R.", text: "A nail art é de outro nível. Levo só uma foto de referência e ela faz melhor ainda." },
  { name: "Carol M.", text: "Agendar online é prático demais. Nunca mais perdi meu horário." },
];

/* ------------------------------------------------------------- helpers --- */

function SplitWords({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <span className="word inline-block will-change-transform">
            {word}&nbsp;
          </span>
        </span>
      ))}
    </>
  );
}

/* ---------------------------------------------------------------- view --- */

export default function Landing({
  heroTitle = DEFAULT_HERO_TITLE,
  heroSubtitle = DEFAULT_HERO_SUBTITLE,
  gallery = [],
}: {
  heroTitle?: string;
  heroSubtitle?: string;
  gallery?: GalleryImage[];
}) {
  const root = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const titleWords = (heroTitle || DEFAULT_HERO_TITLE).trim().split(/\s+/);
  const splitAt = Math.max(1, titleWords.length - 2);
  const titleHead = titleWords.slice(0, splitAt).join(" ");
  const titleTail = titleWords.slice(splitAt).join(" ");

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Reveal everything immediately if the user prefers reduced motion.
      if (reduce) {
        gsap.set("[data-reveal]", { opacity: 1, clearProps: "all" });
        return;
      }

      const mm = gsap.matchMedia();

      mm.add("all", () => {
        // Hero word rise
        gsap.from(".word", {
          yPercent: 115,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.05,
          delay: 0.15,
        });

        // Hero supporting elements
        gsap.from("[data-hero-fade]", {
          opacity: 0,
          y: 24,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          delay: 0.55,
        });

        // Floating hero visual parallax
        gsap.to("[data-hero-visual]", {
          yPercent: -14,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-hero]",
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
        });

        // Generic scroll reveals
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 48 },
            {
              opacity: 1,
              y: 0,
              duration: 0.85,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 85%" },
            }
          );
        });

        // Staggered card grids
        gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((grid) => {
          gsap.from(grid.children, {
            opacity: 0,
            y: 56,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: { trigger: grid, start: "top 80%" },
          });
        });

        // Section underlines draw in
        gsap.utils.toArray<HTMLElement>("[data-line]").forEach((line) => {
          gsap.from(line, {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 0.8,
            ease: "power2.inOut",
            scrollTrigger: { trigger: line, start: "top 90%" },
          });
        });

        // Number counters
        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const end = Number(el.dataset.count || "0");
          const obj = { v: 0 };
          gsap.to(obj, {
            v: end,
            duration: 1.8,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 88%" },
            onUpdate() {
              el.firstChild!.textContent = Math.round(obj.v).toString();
            },
          });
        });
      });

      // Magnetic CTA — desktop pointers only
      mm.add("(min-width: 768px) and (pointer: fine)", () => {
        const magnets = gsap.utils.toArray<HTMLElement>("[data-magnet]");
        const cleanups: Array<() => void> = [];

        magnets.forEach((btn) => {
          const xTo = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3.out" });
          const yTo = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3.out" });

          const move = (e: MouseEvent) => {
            const r = btn.getBoundingClientRect();
            xTo((e.clientX - r.left - r.width / 2) * 0.4);
            yTo((e.clientY - r.top - r.height / 2) * 0.4);
          };
          const leave = () => {
            xTo(0);
            yTo(0);
          };

          btn.addEventListener("mousemove", move);
          btn.addEventListener("mouseleave", leave);
          cleanups.push(() => {
            btn.removeEventListener("mousemove", move);
            btn.removeEventListener("mouseleave", leave);
          });
        });

        return () => cleanups.forEach((fn) => fn());
      });
    },
    { scope: root }
  );

  const nav = [
    { href: "#servicos", label: "Serviços" },
    { href: "#galeria", label: "Galeria" },
    { href: "#sobre", label: "Sobre" },
    { href: "#contato", label: "Contato" },
  ];

  return (
    <div ref={root} className="js-anim overflow-x-hidden">
      {/* ----------------------------------------------------------- NAV --- */}
      <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 pb-4 safe-top safe-x">
          <Link href="#top" className="font-display text-2xl tracking-tight text-rose-deep">
            Nailflow
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-ink-soft md:flex">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="transition-colors hover:text-rose-deep">
                {n.label}
              </a>
            ))}
            <Link
              href="/login"
              className="rounded-full border border-rose/40 px-5 py-2.5 font-semibold text-rose-deep transition-colors hover:bg-rose-soft/50"
            >
              Entrar
            </Link>
            <a
              href="#contato"
              data-magnet
              className="rounded-full bg-rose px-6 py-2.5 font-semibold text-cream shadow-sm transition-colors hover:bg-rose-deep"
            >
              Agendar
            </a>
          </nav>

          <button
            aria-label="Abrir menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span className={`h-0.5 w-6 bg-ink transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 w-6 bg-ink transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-6 bg-ink transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav className="border-t border-rose-soft bg-cream/95 px-6 py-5 md:hidden">
            <div className="flex flex-col gap-4 text-lg">
              {nav.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-ink-soft transition-colors hover:text-rose-deep"
                >
                  {n.label}
                </a>
              ))}
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="mt-2 rounded-full border border-rose/40 px-6 py-3 text-center font-semibold text-rose-deep"
              >
                Entrar
              </Link>
              <a
                href="#contato"
                onClick={() => setMenuOpen(false)}
                className="rounded-full bg-rose px-6 py-3 text-center font-semibold text-cream"
              >
                Agendar horário
              </a>
            </div>
          </nav>
        )}
      </header>

      {/* ---------------------------------------------------------- HERO --- */}
      <section id="top" data-hero className="relative px-6 pb-24 pt-36 md:pt-44">
        {/* ambient blobs */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="animate-floaty absolute -left-16 top-24 h-72 w-72 rounded-full bg-rose-soft/60 blur-3xl" />
          <div className="animate-floaty absolute right-0 top-48 h-80 w-80 rounded-full bg-gold/20 blur-3xl [animation-delay:-3s]" />
        </div>

        <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-2">
          <div>
            <p data-hero-fade className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-rose">
              Estúdio de unhas
            </p>
            <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl">
              <SplitWords text={titleHead} />
              <br />
              <span className="text-rose-deep italic">
                <SplitWords text={titleTail} />
              </span>
            </h1>
            <p data-hero-fade className="mt-7 max-w-md text-lg leading-relaxed text-ink-soft">
              {heroSubtitle}
            </p>
            <div data-hero-fade className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#contato"
                data-magnet
                className="rounded-full bg-rose px-8 py-3.5 font-semibold text-cream shadow-md transition-colors hover:bg-rose-deep"
              >
                Agendar horário
              </a>
              <a
                href="#galeria"
                className="rounded-full border border-rose/40 px-8 py-3.5 font-semibold text-rose-deep transition-colors hover:bg-rose-soft/50"
              >
                Ver trabalhos
              </a>
            </div>
          </div>

          {/* hero visual */}
          <div data-hero-fade className="relative">
            <div
              data-hero-visual
              className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] bg-gradient-to-br from-rose-soft via-cream-deep to-mauve/40 shadow-2xl shadow-rose/20"
            >
              <div className="animate-floaty absolute right-6 top-6 h-16 w-16 rounded-full bg-gold/40 blur-xl" />
              <HeroPolish3D />
              <div className="pointer-events-none absolute inset-0 flex items-end p-7">
                <div className="rounded-2xl bg-cream/70 px-5 py-4 backdrop-blur">
                  <p className="font-display text-2xl text-ink">Marcela Carvalho</p>
                  <p className="text-sm text-ink-soft">Nail Designer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ SERVICES --- */}
      <section id="servicos" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 max-w-xl">
            <h2 data-reveal className="font-display text-4xl text-ink sm:text-5xl">
              Serviços
            </h2>
            <div data-line className="mt-4 h-0.5 w-24 bg-rose" />
            <p data-reveal className="mt-5 text-lg text-ink-soft">
              Cada serviço pensado para realçar a sua beleza com durabilidade e acabamento de salão premium.
            </p>
          </div>

          <div data-stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <div
                key={s.name}
                className="group rounded-3xl border border-rose-soft bg-cream/60 p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-rose/50 hover:shadow-xl hover:shadow-rose/10"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-rose-soft text-rose-deep transition-colors group-hover:bg-rose group-hover:text-cream">
                  ✦
                </div>
                <h3 className="font-display text-xl text-ink">{s.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.desc}</p>
                <p className="mt-5 text-sm font-semibold text-rose-deep">
                  a partir de {s.price}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- GALLERY --- */}
      <section id="galeria" className="bg-cream-deep/50 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <div>
              <h2 data-reveal className="font-display text-4xl text-ink sm:text-5xl">
                Galeria
              </h2>
              <div data-line className="mt-4 h-0.5 w-24 bg-rose" />
            </div>
            <Link
              href="/galeria"
              data-reveal
              className="text-sm font-semibold text-rose-deep underline-offset-4 hover:underline"
            >
              Ver galeria completa →
            </Link>
          </div>

          {gallery.length > 0 ? (
            <div data-stagger className="grid auto-rows-[180px] grid-cols-2 gap-4 md:grid-cols-3">
              {gallery.map((img, i) => (
                <div
                  key={img.id}
                  className={`group relative overflow-hidden rounded-3xl ${
                    i % 4 === 0 ? "row-span-2" : ""
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.public_url}
                    alt={img.title || "Trabalho"}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {img.title && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent p-4">
                      <span className="font-display text-lg text-white">{img.title}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div data-stagger className="grid auto-rows-[180px] grid-cols-2 gap-4 md:grid-cols-3">
              {GALLERY.map((g) => (
                <div
                  key={g.label}
                  className={`group relative overflow-hidden rounded-3xl ${g.span}`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${g.tone} transition-transform duration-500 group-hover:scale-110`}
                  />
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5">
                    <span className="font-display text-lg text-ink">{g.label}</span>
                    <span className="text-rose-deep opacity-0 transition-opacity group-hover:opacity-100">→</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --------------------------------------------------------- STATS --- */}
      <section className="px-6 py-24">
        <div data-stagger className="mx-auto grid max-w-6xl grid-cols-2 gap-8 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-5xl text-rose-deep sm:text-6xl">
                <span data-count={s.value}>0</span>
                {s.suffix}
              </p>
              <p className="mt-2 text-sm uppercase tracking-wider text-ink-soft">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------- ABOUT --- */}
      <section id="sobre" className="px-6 py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-2">
          <div data-reveal className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-gradient-to-tr from-mauve/40 via-rose-soft to-cream-deep shadow-xl">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-7xl text-rose-deep/40">N</span>
            </div>
          </div>
          <div>
            <h2 data-reveal className="font-display text-4xl text-ink sm:text-5xl">
              Cuidado que vira ritual
            </h2>
            <div data-line className="mt-4 h-0.5 w-24 bg-rose" />
            <p data-reveal className="mt-6 text-lg leading-relaxed text-ink-soft">
              No Nailflow, cada atendimento é um momento só seu. Produtos premium,
              biossegurança rigorosa e um olhar de artista para que você saia com as
              unhas — e o humor — renovados.
            </p>
            <ul data-stagger className="mt-8 space-y-3 text-ink">
              {["Ambiente acolhedor e higienizado", "Produtos de alta durabilidade", "Designs personalizados"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose text-xs text-cream">
                      ✓
                    </span>
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- TESTIMONIALS --- */}
      <section className="bg-cream-deep/50 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 data-reveal className="mb-14 text-center font-display text-4xl text-ink sm:text-5xl">
            O que dizem as clientes
          </h2>
          <div data-stagger className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.name}
                className="rounded-3xl border border-rose-soft bg-cream p-8 shadow-sm"
              >
                <div className="mb-4 text-gold">★★★★★</div>
                <blockquote className="text-ink-soft">“{t.text}”</blockquote>
                <figcaption className="mt-6 font-display text-lg text-rose-deep">
                  {t.name}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- CTA --- */}
      <section id="contato" className="px-6 py-28">
        <div
          data-reveal
          className="relative mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-rose-deep via-rose to-mauve px-8 py-16 text-center shadow-2xl shadow-rose/30"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-cream/15 blur-2xl" />
          <h2 className="font-display text-4xl text-cream sm:text-5xl">
            Pronta para brilhar?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-cream/85">
            Garanta seu horário agora. É rápido, online e sem complicação.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/agendar"
              data-magnet
              className="rounded-full bg-cream px-9 py-4 font-semibold text-rose-deep shadow-lg transition-transform hover:scale-105"
            >
              Agendar horário
            </Link>
            <a
              href="https://wa.me/5500000000000"
              className="rounded-full border border-cream/50 px-9 py-4 font-semibold text-cream transition-colors hover:bg-cream/10"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- FOOTER --- */}
      <footer className="border-t border-rose-soft px-6 py-14">
        <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-2xl text-rose-deep">Nailflow</p>
            <p className="mt-3 text-sm text-ink-soft">
              Estúdio de unhas · arte em cada detalhe.
            </p>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-ink">Horário</p>
            <ul className="space-y-1 text-sm text-ink-soft">
              <li>Ter–Sex · 9h às 19h</li>
              <li>Sábado · 9h às 16h</li>
              <li>Dom/Seg · fechado</li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-ink">Contato</p>
            <ul className="space-y-1 text-sm text-ink-soft">
              <li>WhatsApp</li>
              <li>@nailflow.studio</li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-ink">Navegar</p>
            <ul className="space-y-1 text-sm text-ink-soft">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="hover:text-rose-deep">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-12 flex max-w-6xl flex-wrap items-center justify-between gap-3 text-xs text-ink-soft">
          <p>© {new Date().getFullYear()} Nailflow · feito com Next.js + Supabase</p>
          <Link
            href="/login"
            className="rounded-full border border-rose-soft px-3 py-1 font-medium text-rose-deep transition-colors hover:bg-rose-soft/50"
          >
            Entrar (equipe)
          </Link>
        </div>
      </footer>
    </div>
  );
}
