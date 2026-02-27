'use client';

import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

type AlertVariant = 'success' | 'error' | 'info';

type SystemAlertItem = {
  id: string;
  title: string;
  message: string;
  variant: AlertVariant;
  duration: number;
};

type SystemAlertStackProps = {
  alerts: SystemAlertItem[];
  onDismiss: (id: string) => void;
};

const ICON_BY_VARIANT = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const ICON_STYLE_BY_VARIANT: Record<AlertVariant, string> = {
  success: 'text-emerald-300',
  error: 'text-red-300',
  info: 'text-red-300',
};

const PROGRESS_STYLE_BY_VARIANT: Record<AlertVariant, string> = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  info: 'bg-red-500',
};

const CARD_STYLE_BY_VARIANT: Record<AlertVariant, string> = {
  success: 'border-emerald-500/35 bg-[linear-gradient(140deg,rgba(6,18,14,0.96),rgba(7,15,11,0.92))]',
  error: 'border-red-500/35 bg-[linear-gradient(140deg,rgba(24,8,10,0.96),rgba(14,7,8,0.92))]',
  info: 'border-white/15 bg-[linear-gradient(140deg,rgba(16,16,16,0.96),rgba(8,8,8,0.92))]',
};

const TITLE_STYLE_BY_VARIANT: Record<AlertVariant, string> = {
  success: 'text-emerald-200/90',
  error: 'text-red-200/90',
  info: 'text-red-200/90',
};

export default function SystemAlertStack({ alerts, onDismiss }: SystemAlertStackProps) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-4 left-1/2 z-[10000] flex w-[calc(100vw-1.5rem)] max-w-md -translate-x-1/2 flex-col gap-3 sm:bottom-6"
    >
      {alerts.map((alert) => {
        const Icon = ICON_BY_VARIANT[alert.variant];

        return (
          <div
            key={alert.id}
            className={`pointer-events-auto relative overflow-hidden rounded-2xl border text-neutral-100 shadow-[0_24px_70px_rgba(0,0,0,0.55)] ring-1 ring-white/10 backdrop-blur-xl animate-[systemAlertIn_220ms_ease-out_both] ${CARD_STYLE_BY_VARIANT[alert.variant]}`}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.14),transparent_55%)]" />
            <div className="flex gap-3 px-4 py-4">
              <div className="mt-0.5">
                <Icon className={`h-5 w-5 ${ICON_STYLE_BY_VARIANT[alert.variant]}`} />
              </div>

              <div className="min-w-0 flex-1">
                <div className={`text-[11px] font-bold uppercase tracking-[0.18em] ${TITLE_STYLE_BY_VARIANT[alert.variant]}`}>
                  {alert.title}
                </div>
                <div className="mt-1 text-sm leading-6 text-neutral-100">{alert.message}</div>
              </div>

              <button
                type="button"
                onClick={() => onDismiss(alert.id)}
                className="text-neutral-500 transition-colors hover:text-white"
                aria-label="Dismiss alert"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="h-1 bg-white/10">
              <div
                className={`system-alert-progress h-full ${PROGRESS_STYLE_BY_VARIANT[alert.variant]}`}
                style={{ animationDuration: `${alert.duration}ms` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
