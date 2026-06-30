import { useMemo, useState } from "react";
import { Search, Plus, Mail, Phone } from "lucide-react";
import { useApp } from "@/store/AppContext";
import { useToast } from "@/components/ui/Toast";
import { Modal } from "@/components/ui/Modal";
import { Pill } from "@/components/ui/Badge";
import { iniciais } from "@/lib/format";
import type { Cliente, TipoCliente } from "@/data/seed";

const vazio = { nome: "", doc: "", email: "", tel: "", tipo: "PF" as TipoCliente };

export function Clientes() {
  const { clientes, addCliente, updateCliente, processosPorCliente } = useApp();
  const toast = useToast();
  const [q, setQ] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState<"todos" | TipoCliente>("todos");
  const [aberto, setAberto] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(vazio);

  const filtrados = useMemo(() => {
    const termo = q.trim().toLowerCase();
    return clientes.filter(
      (c) =>
        (tipoFiltro === "todos" || c.tipo === tipoFiltro) &&
        (!termo || c.nome.toLowerCase().includes(termo) || c.doc.includes(termo)),
    );
  }, [clientes, q, tipoFiltro]);

  const abrirNovo = () => {
    setForm(vazio);
    setEditId(null);
    setAberto(true);
  };
  const abrirEdicao = (c: Cliente) => {
    setForm({ nome: c.nome, doc: c.doc, email: c.email, tel: c.tel, tipo: c.tipo });
    setEditId(c.id);
    setAberto(true);
  };

  const salvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      updateCliente(editId, form);
      toast("Cliente atualizado.");
    } else {
      addCliente(form);
      toast("Cliente cadastrado com sucesso.");
    }
    setAberto(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button onClick={abrirNovo} className="btn-primary">
          <Plus size={16} /> Novo cliente
        </button>
      </div>

      <div className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nome ou documento…"
            className="input pl-10"
          />
        </div>
        <select
          value={tipoFiltro}
          onChange={(e) => setTipoFiltro(e.target.value as typeof tipoFiltro)}
          className="input sm:w-44"
        >
          <option value="todos">Todos tipos</option>
          <option value="PF">Pessoa Física</option>
          <option value="PJ">Pessoa Jurídica</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
                <th className="px-5 py-3 font-semibold">Cliente</th>
                <th className="px-5 py-3 font-semibold">Documento</th>
                <th className="px-5 py-3 font-semibold">Contato</th>
                <th className="px-5 py-3 font-semibold">Tipo</th>
                <th className="px-5 py-3 text-right font-semibold">Processos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtrados.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => abrirEdicao(c)}
                  className="cursor-pointer transition hover:bg-canvas"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-navy-900 text-xs font-semibold text-white">
                        {iniciais(c.nome)}
                      </span>
                      <span className="font-medium text-body">{c.nome}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-body-2">{c.doc}</td>
                  <td className="px-5 py-4 text-body-2">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Mail size={12} className="text-muted" /> {c.email}
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs">
                      <Phone size={12} className="text-muted" /> {c.tel}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <Pill>{c.tipo === "PJ" ? "Pessoa Jurídica" : "Pessoa Física"}</Pill>
                  </td>
                  <td className="px-5 py-4 text-right font-serif text-lg font-bold text-ink">
                    {processosPorCliente(c.id)}
                  </td>
                </tr>
              ))}
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-muted">
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={aberto}
        onClose={() => setAberto(false)}
        title={editId ? "Editar cliente" : "Novo cliente"}
        subtitle="Identificação pessoal e canais de comunicação"
        footer={
          <>
            <button onClick={() => setAberto(false)} className="btn-ghost">
              Cancelar
            </button>
            <button type="submit" form="form-cliente" className="btn-gold">
              Salvar
            </button>
          </>
        }
      >
        <form id="form-cliente" onSubmit={salvar} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label">Nome / Razão social</label>
            <input
              required
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="label">Tipo</label>
            <select
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value as TipoCliente })}
              className="input"
            >
              <option value="PF">Pessoa Física</option>
              <option value="PJ">Pessoa Jurídica</option>
            </select>
          </div>
          <div>
            <label className="label">CPF / CNPJ</label>
            <input
              required
              value={form.doc}
              onChange={(e) => setForm({ ...form, doc: e.target.value })}
              className="input font-mono"
            />
          </div>
          <div>
            <label className="label">E-mail</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="label">Telefone / WhatsApp</label>
            <input
              value={form.tel}
              onChange={(e) => setForm({ ...form, tel: e.target.value })}
              className="input"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
