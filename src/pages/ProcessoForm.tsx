import { useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Save, CalendarClock, Info } from "lucide-react";
import { useApp } from "@/store/AppContext";
import { useToast } from "@/components/ui/Toast";
import { UrgencyBadge } from "@/components/ui/Badge";
import { URGENCIA } from "@/components/ui/urgency";
import { tiposProcesso } from "@/data/seed";
import {
  somarDiasUteis,
  diasUteisAte,
  classificarUrgencia,
} from "@/lib/businessDays";
import { formatarData, diasUteisLabel } from "@/lib/format";
import { HOJE_REF } from "@/data/seed";

const PRAZOS_LEGAIS = [
  { label: "Contestação (15 dias)", dias: 15 },
  { label: "Recurso / Apelação (15 dias)", dias: 15 },
  { label: "Embargos de declaração (5 dias)", dias: 5 },
  { label: "Manifestação simples (5 dias)", dias: 5 },
];

const LEMBRETES = [1, 3, 7, 15];

export function ProcessoForm() {
  const { id } = useParams();
  const { clientes, addProcesso, updateProcesso, getProcesso } = useApp();
  const navigate = useNavigate();
  const toast = useToast();

  const existente = id ? getProcesso(id) : undefined;
  const editando = Boolean(existente);

  const [numero, setNumero] = useState(existente?.numero ?? "");
  const [clienteId, setClienteId] = useState(existente?.clienteId ?? clientes[0]?.id ?? "");
  const [tipo, setTipo] = useState(existente?.tipo ?? tiposProcesso[0]);
  const [vara, setVara] = useState(existente?.vara ?? "");
  const [objeto, setObjeto] = useState(existente?.objeto ?? "");
  const [valor, setValor] = useState(String(existente?.valor ?? ""));
  const [termoInicial, setTermoInicial] = useState(existente?.termoInicial ?? HOJE_REF);
  const [prazoLegal, setPrazoLegal] = useState(15);
  const [prazo, setPrazo] = useState(existente?.prazo ?? "");
  const [modoPrazo, setModoPrazo] = useState<"auto" | "manual">(editando ? "manual" : "auto");
  const [lembretes, setLembretes] = useState<number[]>(existente?.lembretes ?? [3, 7]);
  const [status, setStatus] = useState(existente?.status ?? "Em andamento");

  // Prazo calculado em dias úteis a partir do termo inicial + prazo legal.
  const prazoCalculado = useMemo(
    () => (termoInicial ? somarDiasUteis(termoInicial, prazoLegal) : ""),
    [termoInicial, prazoLegal],
  );
  const prazoFinal = modoPrazo === "auto" ? prazoCalculado : prazo;

  const previa = useMemo(() => {
    if (!prazoFinal) return null;
    const dias = diasUteisAte(prazoFinal, HOJE_REF);
    return { dias, urgencia: classificarUrgencia(dias) };
  }, [prazoFinal]);

  const toggleLembrete = (d: number) =>
    setLembretes((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort((a, b) => a - b)));

  const salvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prazoFinal) {
      toast("Defina um prazo final válido.", "warning");
      return;
    }
    const dados = {
      numero,
      clienteId,
      tipo,
      vara,
      objeto,
      valor: Number(valor) || 0,
      termoInicial,
      prazo: prazoFinal,
      status: status as never,
      lembretes,
    };
    if (editando && id) {
      updateProcesso(id, dados);
      toast("Processo atualizado com sucesso.");
      navigate(`/app/processos/${id}`);
    } else {
      const novoId = addProcesso(dados);
      toast("Processo cadastrado e prazo em monitoramento.");
      navigate(`/app/processos/${novoId}`);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <Link to="/app/processos" className="inline-flex items-center gap-1.5 text-sm font-medium text-body-2 hover:text-ink">
        <ArrowLeft size={16} /> Voltar para processos
      </Link>

      <form onSubmit={salvar} className="grid gap-5 lg:grid-cols-3">
        {/* Coluna principal */}
        <div className="space-y-5 lg:col-span-2">
          <section className="card p-6">
            <h3 className="text-lg">Dados do processo</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label">Número do processo (CNJ)</label>
                <input
                  required
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  placeholder="0000000-00.0000.0.00.0000"
                  className="input font-mono"
                />
              </div>
              <div>
                <label className="label">Cliente vinculado</label>
                <select value={clienteId} onChange={(e) => setClienteId(e.target.value)} className="input">
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Tipo / Peça</label>
                <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="input">
                  {tiposProcesso.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Vara / Foro</label>
                <input value={vara} onChange={(e) => setVara(e.target.value)} placeholder="3ª Vara Cível - SP" className="input" />
              </div>
              <div>
                <label className="label">Valor da causa</label>
                <input
                  value={valor}
                  onChange={(e) => setValor(e.target.value.replace(/[^\d]/g, ""))}
                  inputMode="numeric"
                  placeholder="25000"
                  className="input"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Objeto / Descrição</label>
                <textarea
                  value={objeto}
                  onChange={(e) => setObjeto(e.target.value)}
                  rows={2}
                  placeholder="Ação de cobrança — débitos de obra"
                  className="input resize-none"
                />
              </div>
            </div>
          </section>

          <section className="card p-6">
            <h3 className="text-lg">Contagem de prazo</h3>
            <p className="text-sm text-muted">
              O sistema conta apenas dias úteis, excluindo fins de semana, feriados nacionais e
              suspensões forenses regionais (MA / SP).
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Termo inicial</label>
                <input
                  type="date"
                  value={termoInicial}
                  onChange={(e) => setTermoInicial(e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Regra de contagem</label>
                <select
                  value={String(prazoLegal)}
                  onChange={(e) => {
                    setPrazoLegal(Number(e.target.value));
                    setModoPrazo("auto");
                  }}
                  className="input"
                >
                  {PRAZOS_LEGAIS.map((p) => (
                    <option key={p.label} value={p.dias}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl bg-canvas p-4">
              <input
                type="radio"
                id="auto"
                checked={modoPrazo === "auto"}
                onChange={() => setModoPrazo("auto")}
                className="accent-gold"
              />
              <label htmlFor="auto" className="text-sm text-body">
                Usar prazo calculado: <strong>{prazoCalculado ? formatarData(prazoCalculado) : "—"}</strong>
              </label>
              <span className="mx-2 hidden h-4 w-px bg-line-2 sm:block" />
              <input
                type="radio"
                id="manual"
                checked={modoPrazo === "manual"}
                onChange={() => setModoPrazo("manual")}
                className="accent-gold"
              />
              <label htmlFor="manual" className="text-sm text-body">
                Definir manualmente
              </label>
              {modoPrazo === "manual" && (
                <input
                  type="date"
                  value={prazo}
                  onChange={(e) => setPrazo(e.target.value)}
                  className="input mt-2 w-full sm:mt-0 sm:w-auto"
                />
              )}
            </div>
          </section>
        </div>

        {/* Coluna lateral — prévia + lembretes */}
        <div className="space-y-5">
          <section className="card overflow-hidden">
            <div className="bg-navy-900 px-5 py-4 text-white">
              <span className="flex items-center gap-2 text-sm font-medium text-white/70">
                <CalendarClock size={16} className="text-gold" /> Prévia do prazo
              </span>
            </div>
            <div className="p-5 text-center">
              {previa && prazoFinal ? (
                <>
                  <div className="font-serif text-3xl font-bold text-ink">{formatarData(prazoFinal)}</div>
                  <div className="mt-1 text-sm text-muted">{diasUteisLabel(previa.dias)} restantes</div>
                  <div className="mt-3 flex justify-center">
                    <UrgencyBadge urgencia={previa.urgencia} />
                  </div>
                  <div className={`mt-4 rounded-xl ${URGENCIA[previa.urgencia].bg} p-3 text-xs ${URGENCIA[previa.urgencia].text}`}>
                    {URGENCIA[previa.urgencia].desc}
                  </div>
                </>
              ) : (
                <p className="py-6 text-sm text-muted">Informe o termo inicial para calcular o prazo.</p>
              )}
            </div>
          </section>

          <section className="card p-5">
            <h3 className="text-base">Lembretes automáticos</h3>
            <p className="text-xs text-muted">Dias úteis de antecedência para alertar</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {LEMBRETES.map((d) => {
                const on = lembretes.includes(d);
                return (
                  <button
                    type="button"
                    key={d}
                    onClick={() => toggleLembrete(d)}
                    className={
                      on
                        ? "rounded-xl border border-gold bg-gold-bg py-2 text-sm font-semibold text-ink"
                        : "rounded-xl border border-line-2 py-2 text-sm text-body-2 hover:bg-canvas"
                    }
                  >
                    {d} dia{d > 1 ? "s" : ""}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex gap-2 text-xs text-muted">
              <Info size={14} className="mt-0.5 shrink-0" />
              Enviados por e-mail (SMTP) e WhatsApp (Z-API) conforme as configurações.
            </div>
          </section>

          {editando && (
            <div>
              <label className="label">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as never)} className="input">
                <option>Em andamento</option>
                <option>Suspenso</option>
                <option>Arquivado</option>
              </select>
            </div>
          )}

          <div className="flex gap-3">
            <Link to="/app/processos" className="btn-ghost flex-1">
              Cancelar
            </Link>
            <button type="submit" className="btn-gold flex-1">
              <Save size={16} /> Salvar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
