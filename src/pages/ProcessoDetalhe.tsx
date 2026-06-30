import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  FileText,
  Plus,
  Download,
  User,
  Scale,
  CalendarClock,
} from "lucide-react";
import { useApp } from "@/store/AppContext";
import { useToast } from "@/components/ui/Toast";
import { Modal } from "@/components/ui/Modal";
import { UrgencyBadge, StatusBadge, Pill } from "@/components/ui/Badge";
import { URGENCIA } from "@/components/ui/urgency";
import { formatarData, diasUteisLabel, moeda } from "@/lib/format";

export function ProcessoDetalhe() {
  const { id } = useParams();
  const { getProcesso, removeProcesso } = useApp();
  const navigate = useNavigate();
  const toast = useToast();
  const [confirmar, setConfirmar] = useState(false);

  const p = id ? getProcesso(id) : undefined;

  if (!p) {
    return (
      <div className="card p-10 text-center">
        <p className="text-muted">Processo não encontrado.</p>
        <Link to="/app/processos" className="btn-ghost mt-4 inline-flex">
          Voltar para processos
        </Link>
      </div>
    );
  }

  const excluir = () => {
    removeProcesso(p.id);
    toast("Processo excluído.", "warning");
    navigate("/app/processos");
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/app/processos" className="inline-flex items-center gap-1.5 text-sm font-medium text-body-2 hover:text-ink">
          <ArrowLeft size={16} /> Voltar
        </Link>
        <div className="flex gap-2.5">
          <Link to={`/app/processos/${p.id}/editar`} className="btn-ghost">
            <Pencil size={15} /> Editar
          </Link>
          <button onClick={() => setConfirmar(true)} className="btn-danger">
            <Trash2 size={15} /> Excluir
          </button>
        </div>
      </div>

      {/* Cabeçalho */}
      <div className="card overflow-hidden">
        <div className="border-b border-line bg-gradient-to-r from-navy-900 to-navy-700 px-6 py-5 text-white">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-sm text-gold">{p.numero}</span>
            <UrgencyBadge urgencia={p.urgencia} />
            <StatusBadge status={p.status} />
          </div>
          <h2 className="mt-2 font-serif text-2xl font-bold text-white">
            {p.tipo} — {p.cliente?.nome}
          </h2>
          <p className="text-white/70">{p.objeto}</p>
        </div>

        <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: User, label: "Cliente", valor: p.cliente?.nome ?? "—" },
            { icon: Scale, label: "Vara / Foro", valor: p.vara },
            { icon: CalendarClock, label: "Prazo final", valor: `${formatarData(p.prazo)} · ${diasUteisLabel(p.diasUteis)}` },
            { icon: FileText, label: "Valor da causa", valor: moeda(p.valor) },
          ].map((c) => (
            <div key={c.label} className="bg-surface p-5">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted">
                <c.icon size={14} /> {c.label}
              </div>
              <div className="mt-1.5 font-medium text-body">{c.valor}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Linha do tempo */}
        <div className="card p-6 lg:col-span-2">
          <h3 className="text-lg">Linha do tempo</h3>
          <p className="text-sm text-muted">Trajetória e cronograma da causa</p>

          <ol className="relative mt-6 space-y-6 border-l-2 border-line pl-6">
            {p.timeline.map((ev, i) => (
              <li key={i} className="relative">
                <span
                  className={`absolute -left-[31px] grid h-5 w-5 place-items-center rounded-full ring-4 ring-surface ${
                    ev.done ? "bg-baixo" : `${URGENCIA[p.urgencia].dot}`
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-body">{ev.titulo}</span>
                  <Pill>{formatarData(ev.data)}</Pill>
                  {!ev.done && <UrgencyBadge urgencia={p.urgencia} />}
                </div>
                <p className="mt-1 text-sm text-body-2">{ev.desc}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Prazo + arquivos */}
        <div className="space-y-5">
          <div className={`card p-5 ${URGENCIA[p.urgencia].bg}`}>
            <div className="text-xs uppercase tracking-wide text-body-2">Prazo monitorado</div>
            <div className="mt-1 font-serif text-3xl font-bold text-ink">{formatarData(p.prazo)}</div>
            <div className={`mt-1 text-sm font-semibold ${URGENCIA[p.urgencia].text}`}>
              {diasUteisLabel(p.diasUteis)} restantes
            </div>
            <div className="mt-3 text-xs text-body-2">
              Lembretes: {p.lembretes.map((d) => `${d}d`).join(" · ") || "nenhum"}
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base">Arquivos</h3>
              <button className="text-sm font-semibold text-gold-600 hover:underline">
                <Plus size={14} className="mr-1 inline" /> Adicionar
              </button>
            </div>
            <ul className="mt-3 space-y-2">
              {p.arquivos.length === 0 && (
                <li className="rounded-xl border border-dashed border-line-2 py-6 text-center text-sm text-muted">
                  Nenhum arquivo anexado.
                </li>
              )}
              {p.arquivos.map((a) => (
                <li key={a.nome} className="flex items-center gap-3 rounded-xl border border-line p-3">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-critico-bg text-critico">
                    <FileText size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-body">{a.nome}</div>
                    <div className="text-xs text-muted">{a.tamanho}</div>
                  </div>
                  <button className="text-muted hover:text-ink">
                    <Download size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Modal
        open={confirmar}
        onClose={() => setConfirmar(false)}
        title="Excluir processo"
        subtitle="Esta ação não poderá ser desfeita."
        footer={
          <>
            <button onClick={() => setConfirmar(false)} className="btn-ghost">
              Cancelar
            </button>
            <button onClick={excluir} className="btn-danger">
              <Trash2 size={15} /> Excluir definitivamente
            </button>
          </>
        }
      >
        <p className="text-sm text-body-2">
          Tem certeza que deseja remover o processo{" "}
          <span className="font-mono text-ink">{p.numero}</span> ({p.cliente?.nome})? Todas as
          informações de prazo e cronograma serão perdidas.
        </p>
      </Modal>
    </div>
  );
}
