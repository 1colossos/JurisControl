import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useApp } from "@/store/AppContext";
import { tipoDeDia } from "@/lib/businessDays";
import { formatarDataLonga } from "@/lib/format";
import { HOJE_REF, type TipoEvento } from "@/data/seed";
import { cn } from "@/lib/cn";

const DIAS = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const EVENTO_META: Record<TipoEvento, { cor: string; label: string }> = {
  prazo: { cor: "bg-critico", label: "Prazo processual" },
  audiencia: { cor: "bg-alto", label: "Audiência" },
  reuniao: { cor: "bg-navy-700", label: "Reunião" },
  feriado: { cor: "bg-critico/40", label: "Feriado / suspensão" },
};

function iso(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function Calendario() {
  const { eventos } = useApp();
  const [ref] = useState(() => {
    const [y, m] = HOJE_REF.split("-").map(Number);
    return { y, m: m - 1 };
  });
  const [cursor, setCursor] = useState({ ano: ref.y, mes: ref.m });
  const [selecionado, setSelecionado] = useState(HOJE_REF);

  const porData = useMemo(() => {
    const map: Record<string, typeof eventos> = {};
    for (const e of eventos) (map[e.data] ??= []).push(e);
    return map;
  }, [eventos]);

  const celulas = useMemo(() => {
    const primeiro = new Date(cursor.ano, cursor.mes, 1).getDay();
    const dias = new Date(cursor.ano, cursor.mes + 1, 0).getDate();
    const arr: (number | null)[] = Array(primeiro).fill(null);
    for (let d = 1; d <= dias; d++) arr.push(d);
    while (arr.length % 7 !== 0) arr.push(null);
    return arr;
  }, [cursor]);

  const mudarMes = (delta: number) => {
    setCursor((c) => {
      const novo = new Date(c.ano, c.mes + delta, 1);
      return { ano: novo.getFullYear(), mes: novo.getMonth() };
    });
  };

  const eventosDoDia = porData[selecionado] ?? [];

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="card p-6 lg:col-span-2">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-ink">
            {MESES[cursor.mes]} {cursor.ano}
          </h2>
          <div className="flex items-center gap-1.5">
            <button onClick={() => mudarMes(-1)} className="btn-ghost px-2.5 py-2">
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setCursor({ ano: ref.y, mes: ref.m })}
              className="btn-ghost"
            >
              Hoje
            </button>
            <button onClick={() => mudarMes(1)} className="btn-ghost px-2.5 py-2">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-semibold text-muted">
          {DIAS.map((d) => (
            <div key={d} className="pb-2">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {celulas.map((d, i) => {
            if (d === null) return <div key={i} />;
            const data = iso(cursor.ano, cursor.mes, d);
            const date = new Date(cursor.ano, cursor.mes, d);
            const tipo = tipoDeDia(date);
            const evs = porData[data] ?? [];
            const isHoje = data === HOJE_REF;
            const isSel = data === selecionado;
            return (
              <button
                key={i}
                onClick={() => setSelecionado(data)}
                className={cn(
                  "relative flex h-20 flex-col rounded-xl border p-2 text-left transition",
                  isSel ? "border-navy-700 ring-2 ring-navy-700/20" : "border-line hover:border-line-2",
                  tipo === "fim-de-semana" && "bg-canvas/60",
                  (tipo === "feriado" || tipo === "suspensao") && "bg-critico-bg",
                )}
              >
                <span
                  className={cn(
                    "text-sm font-semibold",
                    isHoje
                      ? "grid h-6 w-6 place-items-center rounded-full bg-navy-900 text-white"
                      : tipo === "util"
                        ? "text-body"
                        : "text-critico",
                  )}
                >
                  {d}
                </span>
                <span className="mt-auto flex gap-1">
                  {evs.slice(0, 3).map((e, j) => (
                    <span key={j} className={cn("h-1.5 w-1.5 rounded-full", EVENTO_META[e.tipo].cor)} />
                  ))}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap gap-4 border-t border-line pt-4 text-xs">
          {Object.values(EVENTO_META).map((m) => (
            <span key={m.label} className="flex items-center gap-1.5 text-body-2">
              <span className={cn("h-2.5 w-2.5 rounded-full", m.cor)} /> {m.label}
            </span>
          ))}
          <span className="flex items-center gap-1.5 text-body-2">
            <span className="h-2.5 w-2.5 rounded-full bg-canvas ring-1 ring-line-2" /> Fim de semana
          </span>
        </div>
      </div>

      {/* Detalhes do dia */}
      <motion.div key={selecionado} {...{ initial: { opacity: 0, x: 8 }, animate: { opacity: 1, x: 0 } }} className="card p-6">
        <div className="text-xs uppercase tracking-wide text-muted">Detalhes do dia</div>
        <h3 className="mt-1 text-xl">{formatarDataLonga(selecionado)}</h3>

        <div className="mt-4 space-y-3">
          {eventosDoDia.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line-2 py-10 text-center">
              <Calendar size={28} className="mx-auto text-line-2" />
              <p className="mt-2 text-sm text-muted">Nenhum evento neste dia.</p>
            </div>
          ) : (
            eventosDoDia.map((e, i) => (
              <div key={i} className="flex gap-3 rounded-xl border border-line p-3.5">
                <span className={cn("mt-1 h-2.5 w-2.5 shrink-0 rounded-full", EVENTO_META[e.tipo].cor)} />
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted">
                    {EVENTO_META[e.tipo].label}
                  </div>
                  <div className="text-sm font-medium text-body">{e.nome}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
