"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import type { GalleryImage } from "@/lib/types";

export default function ConteudoPage() {
  const configured = hasSupabaseEnv();

  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingText, setSavingText] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!configured) {
      setLoading(false);
      setError("Supabase não configurado — defina as variáveis de ambiente.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const [c, g] = await Promise.all([
      supabase.from("site_content").select("*"),
      supabase.from("gallery_images").select("*").order("sort"),
    ]);
    if (c.data) {
      const map = Object.fromEntries(c.data.map((r) => [r.key, r.value]));
      setHeroTitle(map.hero_title ?? "");
      setHeroSubtitle(map.hero_subtitle ?? "");
    }
    if (g.data) setImages(g.data as GalleryImage[]);
    setLoading(false);
  }, [configured]);

  useEffect(() => {
    load();
  }, [load]);

  async function saveText(e: React.FormEvent) {
    e.preventDefault();
    setSavingText(true);
    setMsg(null);
    const { error } = await createClient()
      .from("site_content")
      .upsert([
        { key: "hero_title", value: heroTitle },
        { key: "hero_subtitle", value: heroSubtitle },
      ]);
    setSavingText(false);
    setMsg(error ? null : "Textos salvos ✓");
    if (error) setError(error.message);
  }

  async function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    const supabase = createClient();
    const safe = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const path = `${Date.now()}-${safe}`;

    const up = await supabase.storage.from("gallery").upload(path, file);
    if (up.error) {
      setError(up.error.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("gallery").getPublicUrl(path);
    const ins = await supabase.from("gallery_images").insert({
      storage_path: path,
      public_url: data.publicUrl,
      title: file.name.replace(/\.[^.]+$/, ""),
      sort: images.length,
    });
    setUploading(false);
    e.target.value = "";
    if (ins.error) setError(ins.error.message);
    else load();
  }

  async function removeImage(img: GalleryImage) {
    if (!confirm("Remover esta foto?")) return;
    const supabase = createClient();
    await supabase.storage.from("gallery").remove([img.storage_path]);
    await supabase.from("gallery_images").delete().eq("id", img.id);
    load();
  }

  if (loading) return <p className="text-sm text-ink-soft">Carregando…</p>;

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl text-ink">Conteúdo do site</h1>

      {error && (
        <p className="rounded-lg bg-rose-soft/60 px-3 py-2 text-sm text-rose-deep">
          {error}
        </p>
      )}

      {/* Textos da landing */}
      <form
        onSubmit={saveText}
        className="space-y-3 rounded-3xl border border-rose-soft bg-white/60 p-5"
      >
        <h2 className="font-display text-lg text-ink">Texto principal (hero)</h2>
        <label className="block text-sm font-medium text-ink">
          Título
          <input
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-rose-soft bg-white px-3 py-2 outline-none focus:border-rose"
          />
        </label>
        <label className="block text-sm font-medium text-ink">
          Subtítulo
          <textarea
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
            rows={3}
            className="mt-1.5 w-full rounded-xl border border-rose-soft bg-white px-3 py-2 outline-none focus:border-rose"
          />
        </label>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={savingText}
            className="rounded-full bg-rose px-5 py-2 text-sm font-semibold text-cream hover:bg-rose-deep disabled:opacity-60"
          >
            {savingText ? "Salvando…" : "Salvar textos"}
          </button>
          {msg && <span className="text-sm text-emerald-700">{msg}</span>}
        </div>
      </form>

      {/* Galeria */}
      <section className="rounded-3xl border border-rose-soft bg-white/60 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg text-ink">Galeria de fotos</h2>
          <label className="cursor-pointer rounded-full bg-rose px-5 py-2 text-sm font-semibold text-cream hover:bg-rose-deep">
            {uploading ? "Enviando…" : "+ Adicionar foto"}
            <input
              type="file"
              accept="image/*"
              onChange={uploadImage}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        {images.length === 0 ? (
          <p className="py-6 text-center text-sm text-ink-soft">
            Nenhuma foto ainda. O site mostra os modelos padrão até você adicionar.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {images.map((img) => (
              <div
                key={img.id}
                className="group relative aspect-square overflow-hidden rounded-2xl border border-rose-soft"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.public_url}
                  alt={img.title || "Foto da galeria"}
                  className="h-full w-full object-cover"
                />
                <button
                  onClick={() => removeImage(img)}
                  className="absolute right-2 top-2 rounded-full bg-black/55 px-2 py-1 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
