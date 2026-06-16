import Landing from "@/components/Landing";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { GalleryImage } from "@/lib/types";

export default async function Home() {
  let heroTitle: string | undefined;
  let heroSubtitle: string | undefined;
  let gallery: GalleryImage[] = [];

  if (hasSupabaseEnv()) {
    try {
      const supabase = await createClient();
      const [c, g] = await Promise.all([
        supabase.from("site_content").select("key,value"),
        supabase.from("gallery_images").select("*").order("sort"),
      ]);
      if (c.data) {
        const map = Object.fromEntries(
          (c.data as { key: string; value: string | null }[]).map((r) => [
            r.key,
            r.value,
          ]),
        );
        heroTitle = map.hero_title ?? undefined;
        heroSubtitle = map.hero_subtitle ?? undefined;
      }
      if (g.data) gallery = g.data as GalleryImage[];
    } catch {
      // Supabase indisponível → usa os textos/fotos padrão.
    }
  }

  return (
    <Landing
      heroTitle={heroTitle}
      heroSubtitle={heroSubtitle}
      gallery={gallery}
    />
  );
}
