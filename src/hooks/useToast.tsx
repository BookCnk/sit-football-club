'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import SystemAlertStack from '@/components/ui/SystemAlertStack';

type ToastVariant = 'success' | 'error' | 'info';

type ToastInput = {
  title?: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;
};

type ToastItem = {
  id: string;
  title: string;
  message: string;
  variant: ToastVariant;
  duration: number;
};

type ToastContextValue = {
  show: (input: ToastInput) => string;
  success: (message: string, title?: string) => string;
  error: (message: string, title?: string) => string;
  info: (message: string, title?: string) => string;
  dismiss: (id: string) => void;
};

const DEFAULT_TITLES: Record<ToastVariant, string> = {
  success: 'Success',
  error: 'Action failed',
  info: 'Notice',
};

const DEFAULT_DURATIONS: Record<ToastVariant, number> = {
  success: 4000,
  error: 6500,
  info: 4500,
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

function createToastId() {
  if (typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }

  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timeoutsRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    return () => {
      Object.values(timeoutsRef.current).forEach((timeout) => clearTimeout(timeout));
    };
  }, []);

  function dismiss(id: string) {
    const timeout = timeoutsRef.current[id];
    if (timeout) {
      clearTimeout(timeout);
      delete timeoutsRef.current[id];
    }

    setToasts((current) => current.filter((toast) => toast.id !== id));
  }

  function show({ title, message, variant = 'info', duration }: ToastInput) {
    const id = createToastId();
    const resolvedDuration = duration ?? DEFAULT_DURATIONS[variant];

    setToasts((current) => [
      ...current,
      {
        id,
        title: title || DEFAULT_TITLES[variant],
        message,
        variant,
        duration: resolvedDuration,
      },
    ]);

    timeoutsRef.current[id] = setTimeout(() => {
      dismiss(id);
    }, resolvedDuration);

    return id;
  }

  const value: ToastContextValue = {
    show,
    success(message, title) {
      return show({ message, title, variant: 'success' });
    },
    error(message, title) {
      return show({ message, title, variant: 'error' });
    },
    info(message, title) {
      return show({ message, title, variant: 'info' });
    },
    dismiss,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <SystemAlertStack alerts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}

export function getErrorMessage(error: unknown, fallbackMessage: string) {
  return error instanceof Error ? error.message : fallbackMessage;
}
