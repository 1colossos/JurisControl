import { cn } from "@/lib/cn";

/** Logotipo do JurisControl (balança da justiça estilizada). */
export function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="shrink-0">
      <rect width="64" height="64" rx="16" fill="#e0a83a" />
      <g fill="#16213e">
        <rect x="30.5" y="14" width="3" height="36" rx="1.5" />
        <circle cx="32" cy="13" r="3.4" />
        <path d="M20 22l-6 12c0 3.3 2.7 6 6 6s6-2.7 6-6l-6-12z" />
        <path d="M44 22l-6 12c0 3.3 2.7 6 6 6s6-2.7 6-6l-6-12z" />
        <rect x="14" y="50" width="36" height="4" rx="2" />
        <rect x="20" y="20" width="24" height="3" rx="1.5" />
      </g>
    </svg>
  );
}

export function Brand({ dark = false, className }: { dark?: boolean; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Logo size={40} />
      <div className="leading-tight">
        <div className={cn("font-serif text-lg font-bold", dark ? "text-white" : "text-ink")}>
          JurisControl
        </div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
          Gestão Jurídica
        </div>
      </div>
    </div>
  );
}
