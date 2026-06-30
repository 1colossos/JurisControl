import { cn } from "@/lib/cn";

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  desc?: string;
}

export function Toggle({ checked, onChange, label, desc }: ToggleProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4">
      {(label || desc) && (
        <span>
          {label && <span className="block text-sm font-semibold text-body">{label}</span>}
          {desc && <span className="block text-xs text-muted">{desc}</span>}
        </span>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-baixo" : "bg-line-2",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-[22px]" : "translate-x-0.5",
          )}
        />
      </button>
    </label>
  );
}
