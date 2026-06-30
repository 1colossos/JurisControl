import { cn } from "@/lib/cn";
import type { Urgencia } from "@/lib/businessDays";
import { URGENCIA } from "./urgency";

export function UrgencyBadge({ urgencia }: { urgencia: Urgencia }) {
  const m = URGENCIA[urgencia];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        m.bg,
        m.text,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", m.dot)} />
      {m.label}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "Suspenso"
      ? "bg-alto-bg text-alto"
      : status === "Arquivado"
        ? "bg-canvas text-muted"
        : "bg-baixo-bg text-baixo";
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", tone)}>
      {status}
    </span>
  );
}

export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-line-2 bg-canvas px-2.5 py-0.5 text-xs font-medium text-body-2">
      {children}
    </span>
  );
}
