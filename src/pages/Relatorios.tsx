import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from "recharts";
import { FileDown } from "lucide-react";
import { useApp } from "@/store/AppContext";
import { useToast } from "@/components/ui/Toast";
import { UrgencyBadge } from "@/components/ui/Badge";
import { ORDEM_URGENCIA, URGENCIA } from "@/components/ui/urgency";
import { relatorio } from "@/data/seed";
import { formatarData, moeda } from "@/lib/format";

export function Relatorios() {
  const { processos, clientes } = useApp();
  const toast = useToast();
  const [inicio, setInicio] = useState("2026-01-01");
  const [fim, setFim] = useState("2026-06-30");
  const [tipo] = useState("Todos");
  const [clienteId, setClienteId] = useState("todos");

  const filtrados = useMemo(
    () => processos.filter((p) => clienteId === "todos" || p.clienteId === clienteId),
    [processos, clienteId],
  );

  const distribuicao = useMemo(() => {
    const ativos = processos.filter((p) => p.status === "Em andamento");
    const total = ativos.length || 1;
    return ORDEM_URGENCIA.map((u) => {
      const qtd = ativos.filter((p) => p.urgencia === u).length;
      return { key: u, qtd, pct: Math.round((qtd / total) * 100) };
    });
  }, [processos]);

  const totais = { total: 30, cumpridos: 24, pendentes: 4, perdidos: 0 };

  const exportar = () => toast("Relatório exportado em PDF (simulado).", "success");

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button onClick={exportar} className="btn-primary">
          <FileDown size={16} /> Exportar em PDF
        </button>
      </div>

      {/* Filtros */}
      <div className="card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="label">Data inicial</label>
          <input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} className="input" />
        </div>
        <div>
          <label className="label">Data final</label>
          <input type="date" value={fim} onChange={(e) => setFim(e.target.value)} className="input" />
        </div>
        <div>
          <label className="label">Tipo de prazo</label>
          <select defaultValue={tipo} className="input">
            <option>Todos</option>
            <option>Recursal</option>
            <option>Contestação</option>
            <option>Manifestação</option>
          </select>
        </div>
        <div>
          <label className="label">Cliente</label>
          <select value={clienteId} onChange={(e) => setClienteId(e.target.value)} className="input">
            <option value="todos">Todos clientes</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total no período", valor: totais.total, cor: "text-ink" },
          { label: "Prazos cumpridos", valor: totais.cumpridos, cor: "text-baixo" },
          { label: "Pendentes", valor: totais.pendentes, cor: "text-alto" },
          { label: "Perdidos", valor: totais.perdidos, cor: "text-critico" },
        ].map((k) => (
          <div key={k.label} className="card p-5">
            <div className="text-xs uppercase tracking-wide text-muted">{k.label}</div>
            <div className={`mt-1 font-serif text-4xl font-bold ${k.cor}`}>{k.valor}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Gráfico de volume */}
        <div className="card p-6 lg:col-span-2">
          <h3 className="text-lg">Volume de prazos por mês</h3>
          <p className="text-sm text-muted">Primeiro semestre de 2026</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={relatorio.volumeMensal} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="mes" tickLine={false} axisLine={false} tick={{ fill: "#8a93a6", fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: "#f4f6fa" }}
                  contentStyle={{ borderRadius: 12, border: "1px solid #e6e9f1", fontSize: 13 }}
                />
                <Bar dataKey="v" radius={[8, 8, 0, 0]}>
                  {relatorio.volumeMensal.map((_, i) => (
                    <Cell key={i} fill={i === relatorio.volumeMensal.length - 1 ? "#e0a83a" : "#243a66"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribuição por urgência */}
        <div className="card p-6">
          <h3 className="text-lg">Distribuição por urgência</h3>
          <p className="text-sm text-muted">Processos ativos</p>
          <ul className="mt-4 space-y-4">
            {distribuicao.map((d) => (
              <li key={d.key}>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium text-body">
                    <span className={`h-2.5 w-2.5 rounded-full ${URGENCIA[d.key].dot}`} />
                    {URGENCIA[d.key].label}
                  </span>
                  <span className="text-muted">
                    {d.qtd} ({d.pct}%)
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-canvas">
                  <div className={`h-full rounded-full ${URGENCIA[d.key].dot}`} style={{ width: `${d.pct}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pré-visualização */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <div>
            <h3 className="text-lg">Pré-visualização do relatório</h3>
            <p className="text-sm text-muted">Os dados abaixo serão incluídos na exportação</p>
          </div>
          <button onClick={exportar} className="btn-ghost">
            <FileDown size={15} /> Baixar PDF
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
                <th className="px-6 py-3 font-semibold">Processo</th>
                <th className="px-6 py-3 font-semibold">Cliente</th>
                <th className="px-6 py-3 font-semibold">Tipo</th>
                <th className="px-6 py-3 font-semibold">Prazo</th>
                <th className="px-6 py-3 font-semibold">Valor</th>
                <th className="px-6 py-3 font-semibold">Urgência</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtrados.map((p) => (
                <tr key={p.id}>
                  <td className="px-6 py-3 font-mono text-xs text-body-2">{p.numero}</td>
                  <td className="px-6 py-3 font-medium text-body">{p.cliente?.nome}</td>
                  <td className="px-6 py-3 text-body-2">{p.tipo}</td>
                  <td className="px-6 py-3 text-body-2">{formatarData(p.prazo)}</td>
                  <td className="px-6 py-3 text-body-2">{moeda(p.valor)}</td>
                  <td className="px-6 py-3">
                    <UrgencyBadge urgencia={p.urgencia} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
