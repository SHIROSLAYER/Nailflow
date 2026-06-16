/** Monta um link wa.me com mensagem pré-preenchida. Normaliza o telefone p/ BR. */
export function waLink(phone: string | null | undefined, message: string): string {
  const digits = (phone || "").replace(/\D/g, "");
  const num = digits ? (digits.startsWith("55") ? digits : `55${digits}`) : "";
  const base = num ? `https://wa.me/${num}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(message)}`;
}

/** Mensagem padrão de lembrete de horário. */
export function reminderMessage(opts: {
  name: string;
  dateLabel: string;
  timeLabel: string;
  service?: string | null;
}): string {
  const svc = opts.service ? ` — ${opts.service}` : "";
  return `Oi ${opts.name}! 💅 Passando pra lembrar do seu horário no Nailflow em ${opts.dateLabel} às ${opts.timeLabel}${svc}. Qualquer coisa me avisa. Até lá! ✨`;
}
