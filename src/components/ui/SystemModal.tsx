'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

type SystemModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  maxWidthClassName?: string;
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
};

export default function SystemModal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidthClassName = 'max-w-2xl',
  closeOnBackdrop = true,
  showCloseButton = true,
}: SystemModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9500] flex items-center justify-center px-4 py-8"
      role="dialog"
      aria-modal="true"
      onMouseDown={() => {
        if (closeOnBackdrop) {
          onClose();
        }
      }}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

      <div
        className={`relative w-full ${maxWidthClassName} overflow-hidden rounded-3xl border border-white/15 bg-[linear-gradient(150deg,rgba(18,18,18,0.97),rgba(9,9,9,0.94))] shadow-[0_30px_90px_rgba(0,0,0,0.6)] ring-1 ring-white/10 animate-[systemModalIn_220ms_ease-out_both]`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.18),transparent_58%)]" />

        {(title || description || showCloseButton) && (
          <div className="relative z-10 flex items-start justify-between gap-3 border-b border-white/10 px-5 py-4 sm:px-6">
            <div className="min-w-0">
              {title && (
                <h2 className="font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-1 text-sm leading-6 text-neutral-400">{description}</p>
              )}
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/15 bg-white/5 p-2 text-neutral-300 transition-colors hover:border-white/30 hover:text-white"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        <div className="relative z-10 px-5 py-5 sm:px-6">{children}</div>

        {footer && (
          <div className="relative z-10 border-t border-white/10 px-5 py-4 sm:px-6">{footer}</div>
        )}
      </div>
    </div>
  );
}
