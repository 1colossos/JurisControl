import type { Urgencia } from "@/lib/businessDays";

export interface UrgenciaMeta {
  label: string;
  dot: string;
  text: string;
  bg: string;
  desc: string;
}

export const URGENCIA: Record<Urgencia, UrgenciaMeta> = {
  critico: {
    label: "Crítico",
    dot: "bg-critico",
    text: "text-critico",
    bg: "bg-critico-bg",
    desc: "Vencimento em até 3 dias úteis",
  },
  alto: {
    label: "Alto",
    dot: "bg-alto",
    text: "text-alto",
    bg: "bg-alto-bg",
    desc: "Vencimento em até 7 dias úteis",
  },
  medio: {
    label: "Médio",
    dot: "bg-medio",
    text: "text-medio",
    bg: "bg-medio-bg",
    desc: "Vencimento em até 15 dias úteis",
  },
  baixo: {
    label: "Baixo",
    dot: "bg-baixo",
    text: "text-baixo",
    bg: "bg-baixo-bg",
    desc: "Vencimento superior a 15 dias",
  },
};

export const ORDEM_URGENCIA: Urgencia[] = ["critico", "alto", "medio", "baixo"];
