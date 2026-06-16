"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { reminderMessage, waLink } from "@/lib/whatsapp";
import type { Appointment, Service } from "@/lib/types";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;

const STATUS_STYLE: Record<string, string> = {
  agendado: "bg-rose-soft text-rose-deep",
  concluido: "bg-emerald-100 text-emerald-700",
  cancelado: "bg-zinc-200 text-zinc-500 line-through",
};

function buildMonth(cursor: Date): Date[][] {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay()); // volta até domingo
  const weeks: Date[][] = [];
  const d = new Date(start);
  for (let w = 0; w < 6; w++) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

export default function AgendaPage() {
  const [cursor, setCursor] = useState(() => new Date());
  const [selected, setSelected] = useState(() => new Date());
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const configured = hasSupabaseEnv();

  const load = useCallback(async () => {
    if (!configured) {
      setLoading(false);
      setError("Supabase não configurado — defina as variáveis de ambiente.");
      return;
    }
    setLoading(true);
    setError(null);
    const supabase = createClient();

    const monthStart = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const monthEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);

    const [aRes, sRes] = await Promise.all([
      supabase
        .from("appointments")
        .select("*")
        .gte("starts_at", monthStart.toISOString())
        .lt("starts_at", monthEnd.toISOString())
        .order("starts_at"),
      supabase.from("services").select("*").order("name"),
    ]);

    if (aRes.error) setError(aRes.error.message);
    else setAppts(aRes.data as Appointment[]);
    if (!sRes.error && sRes.data) setServices(sRes.data as Service[]);
    setLoading(false);
  }, [cursor, configured]);

  useEffect(() => {
    load();
  }, [load]);

  const weeks = useMemo(() => buildMonth(cursor), [cursor]);

  const countByDay = useMemo(() => {
    const m = new Map<string, number>();
    for (const a of appts) {
      if (a.status === "cancelado") continue;
      const k = dayKey(new Date(a.starts_at));
      m.set(k, (m.get(k) || 0) + 1);
    }
    return m;
  }, [appts]);

  const dayAppts = useMemo(
    () =>
      appts
        .filter((a) => dayKey(new Date(a.starts_at)) === dayKey(selected))
        .sort((a, b) => a.starts_at.localeCompare(b.starts_at)),
    [appts, selected],
  );

  const todayKey = dayKey(new Date());

  async function setStatus(id: string, status: Appointment["status"]) {
    await createClient().from("appointments").update({ status }).eq("id", id);
    load();
  }
  async function removeAppt(id: string) {
    if (!confirm("Excluir este agendamento?")) return;
    await createClient().from("appointments").delete().eq("id", id);
    load();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      {/* ----------------------------------------------------- CALENDÁRIO --- */}
      <section className="rounded-3xl border border-rose-soft bg-white/60 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="font-display text-2xl text-ink">
            {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
          </h1>
          <div className="flex items-center gap-1">
            <button
              onClick={() =>
                setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
              }
              className="h-9 w-9 rounded-full text-ink-soft hover:bg-rose-soft/50"
              aria-label="Mês anterior"
            >
              ‹
            </button>
            <button
              onClick={() => {
                const t = new Date();
                setCursor(new Date(t.getFullYear(), t.getMonth(), 1));
                setSelected(t);
              }}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-rose-deep hover:bg-rose-soft/50"
            >
              Hoje
            </button>
            <button
              onClick={() =>
                setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
              }
              className="h-9 w-9 rounded-full text-ink-soft hover:bg-rose-soft/50"
              aria-label="Próximo mês"
            >
              ›
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 text-center text-xs font-semibold uppercase tracking-wide text-ink-soft">
          {WEEKDAYS.map((w) => (
            <div key={w} className="py-2">
              {w}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {weeks.flat().map((d) => {
            const k = dayKey(d);
            const inMonth = d.getMonth() === cursor.getMonth();
            const isToday = k === todayKey;
            const isSel = k === dayKey(selected);
            const count = countByDay.get(k) || 0;
            return (
              <button
                key={k}
                onClick={() => {
                  setSelected(new Date(d));
                  setShowForm(false);
                }}
                className={`relative flex h-16 flex-col items-center justify-start rounded-xl p-1.5 text-sm transition-colors ${
                  isSel
                    ? "bg-rose text-cream"
                    : inMonth
                      ? "text-ink hover:bg-rose-soft/40"
                      : "text-ink-soft/40 hover:bg-rose-soft/20"
                }`}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full ${
                    isToday && !isSel ? "bg-rose-soft text-rose-deep font-bold" : ""
                  }`}
                >
                  {d.getDate()}
                </span>
                {count > 0 && (
                  <span
                    className={`mt-auto rounded-full px-1.5 text-[10px] font-semibold ${
                      isSel ? "bg-cream/30 text-cream" : "bg-rose text-cream"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* --------------------------------------------------------- DIA --- */}
      <section className="rounded-3xl border border-rose-soft bg-white/60 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-ink">
            {selected.getDate()} de {MONTHS[selected.getMonth()]}
          </h2>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="rounded-full bg-rose px-4 py-1.5 text-sm font-semibold text-cream hover:bg-rose-deep"
          >
            {showForm ? "Fechar" : "+ Agendar"}
          </button>
        </div>

        {showForm && (
          <NewAppointmentForm
            date={selected}
            services={services}
            onDone={() => {
              setShowForm(false);
              load();
            }}
          />
        )}

        {loading && <p className="text-sm text-ink-soft">Carregando…</p>}
        {error && (
          <p className="rounded-lg bg-rose-soft/60 px-3 py-2 text-sm text-rose-deep">
            {error}
          </p>
        )}

        {!loading && !error && dayAppts.length === 0 && (
          <p className="py-8 text-center text-sm text-ink-soft">
            Nenhum cliente neste dia.
          </p>
        )}

        <ul className="space-y-3">
          {dayAppts.map((a) => {
            const start = new Date(a.starts_at);
            const time = start.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            });
            const dateLabel = start.toLocaleDateString("pt-BR");
            const msg = reminderMessage({
              name: a.client_name,
              dateLabel,
              timeLabel: time,
              service: a.service_name,
            });
            return (
              <li
                key={a.id}
                className="rounded-2xl border border-rose-soft bg-cream/60 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ink">
                      <span className="text-rose-deep">{time}</span> ·{" "}
                      {a.client_name}
                    </p>
                    <p className="text-sm text-ink-soft">
                      {a.service_name || "Serviço não definido"}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      STATUS_STYLE[a.status] || ""
                    }`}
                  >
                    {a.status}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                    className="rounded-full border border-rose/40 px-3 py-1 text-xs font-medium text-rose-deep hover:bg-rose-soft/50"
                  >
                    Serviço
                  </button>
                  <a
                    href={waLink(a.client_phone, msg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-500"
                  >
                    Lembrar (WhatsApp)
                  </a>
                  {a.status !== "concluido" && (
                    <button
                      onClick={() => setStatus(a.id, "concluido")}
                      className="rounded-full px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50"
                    >
                      Concluir
                    </button>
                  )}
                  {a.status !== "cancelado" && (
                    <button
                      onClick={() => setStatus(a.id, "cancelado")}
                      className="rounded-full px-3 py-1 text-xs font-medium text-ink-soft hover:bg-zinc-100"
                    >
                      Cancelar
                    </button>
                  )}
                  <button
                    onClick={() => removeAppt(a.id)}
                    className="ml-auto rounded-full px-3 py-1 text-xs font-medium text-rose-deep hover:bg-rose-soft/50"
                  >
                    Excluir
                  </button>
                </div>

                {expanded === a.id && (
                  <div className="mt-3 rounded-xl bg-white/70 p-3 text-sm text-ink-soft">
                    <p>
                      <strong className="text-ink">Serviço:</strong>{" "}
                      {a.service_name || "—"} ({a.duration_min} min)
                    </p>
                    <p>
                      <strong className="text-ink">Telefone:</strong>{" "}
                      {a.client_phone || "—"}
                    </p>
                    {a.notes && (
                      <p>
                        <strong className="text-ink">Notas:</strong> {a.notes}
                      </p>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

/* ------------------------------------------------ formulário de agendar --- */

function NewAppointmentForm({
  date,
  services,
  onDone,
}: {
  date: Date;
  services: Service[];
  onDone: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [time, setTime] = useState("09:00");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!name.trim()) {
      setErr("Informe o nome da cliente.");
      return;
    }
    const svc = services.find((s) => s.id === serviceId);
    const [hh, mm] = time.split(":").map(Number);
    const starts = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      hh,
      mm,
    );

    setSaving(true);
    const { error } = await createClient()
      .from("appointments")
      .insert({
        client_name: name.trim(),
        client_phone: phone.trim() || null,
        service_id: svc?.id ?? null,
        service_name: svc?.name ?? null,
        starts_at: starts.toISOString(),
        duration_min: svc?.duration_min ?? 60,
        notes: notes.trim() || null,
      });
    setSaving(false);

    if (error) setErr(error.message);
    else onDone();
  }

  return (
    <form
      onSubmit={save}
      className="mb-4 space-y-3 rounded-2xl border border-rose-soft bg-cream/70 p-4"
    >
      <div className="grid grid-cols-2 gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome da cliente"
          className="col-span-2 rounded-xl border border-rose-soft bg-white px-3 py-2 text-sm outline-none focus:border-rose"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="WhatsApp (ex: 11999999999)"
          className="rounded-xl border border-rose-soft bg-white px-3 py-2 text-sm outline-none focus:border-rose"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="rounded-xl border border-rose-soft bg-white px-3 py-2 text-sm outline-none focus:border-rose"
        />
        <select
          value={serviceId}
          onChange={(e) => setServiceId(e.target.value)}
          className="col-span-2 rounded-xl border border-rose-soft bg-white px-3 py-2 text-sm outline-none focus:border-rose"
        >
          <option value="">Serviço…</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notas (opcional)"
          rows={2}
          className="col-span-2 rounded-xl border border-rose-soft bg-white px-3 py-2 text-sm outline-none focus:border-rose"
        />
      </div>
      {err && <p className="text-sm text-rose-deep">{err}</p>}
      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-full bg-rose px-4 py-2 text-sm font-semibold text-cream hover:bg-rose-deep disabled:opacity-60"
      >
        {saving ? "Salvando…" : "Salvar agendamento"}
      </button>
    </form>
  );
}
