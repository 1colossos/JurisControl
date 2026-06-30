import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, AlertTriangle } from "lucide-react";

type Tone = "success" | "info" | "warning";
interface Toast {
  id: number;
  msg: string;
  tone: Tone;
}

const ToastCtx = createContext<(msg: string, tone?: Tone) => void>(() => {});

const ICON: Record<Tone, typeof Info> = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
};
const COLOR: Record<Tone, string> = {
  success: "text-baixo",
  info: "text-medio",
  warning: "text-alto",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((msg: string, tone: Tone = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2.5">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = ICON[t.tone];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 40, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: 0.9 }}
                className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 shadow-lift"
              >
                <Icon size={18} className={COLOR[t.tone]} />
                <span className="text-sm font-medium text-body">{t.msg}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  return useContext(ToastCtx);
}
