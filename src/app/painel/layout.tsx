import PainelNav from "./PainelNav";

export default function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-cream">
      <PainelNav />
      <div className="mx-auto max-w-6xl px-4 py-6 safe-x">{children}</div>
    </div>
  );
}
