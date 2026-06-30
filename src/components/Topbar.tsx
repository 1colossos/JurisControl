import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, Menu } from "lucide-react";
import { useApp } from "@/store/AppContext";
import { iniciais } from "@/lib/format";

interface TopbarProps {
  titulo: string;
  subtitulo: string;
  onMenu?: () => void;
}

export function Topbar({ titulo, subtitulo, onMenu }: TopbarProps) {
  const { usuario, processos } = useApp();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/app/processos?q=${encodeURIComponent(q)}`);
  };

  const criticos = processos.filter((p) => p.urgencia === "critico").length;

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-line bg-canvas/80 px-5 py-4 backdrop-blur-md lg:px-8">
      <button
        onClick={onMenu}
        className="rounded-lg p-2 text-body-2 hover:bg-surface lg:hidden"
        aria-label="Menu"
      >
        <Menu size={20} />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-xl lg:text-2xl">{titulo}</h1>
        <p className="truncate text-sm text-muted">{subtitulo}</p>
      </div>

      <form onSubmit={submit} className="relative hidden md:block">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar processos, clientes…"
          className="w-64 rounded-xl border border-line bg-surface py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30 lg:w-80"
        />
      </form>

      <button
        className="relative rounded-xl border border-line bg-surface p-2.5 text-body-2 transition hover:text-ink"
        aria-label="Notificações"
      >
        <Bell size={18} />
        {criticos > 0 && (
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-critico ring-2 ring-surface" />
        )}
      </button>

      <div
        className="grid h-10 w-10 place-items-center rounded-full bg-navy-900 text-sm font-semibold text-white"
        title={usuario.nome}
      >
        {iniciais(usuario.nome)}
      </div>
    </header>
  );
}
