'use client';

import { Loader2, TriangleAlert } from 'lucide-react';
import SystemModal from '@/components/ui/SystemModal';

type ConfirmModalProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <SystemModal
      open={open}
      onClose={onCancel}
      title={title}
      description="Please review this action before continuing."
      maxWidthClassName="max-w-lg"
      footer={
        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-widest text-neutral-300 transition-colors hover:border-white/30 hover:text-white"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
              danger
                ? 'border border-red-500/40 bg-red-500/15 text-red-100 hover:bg-red-500/25'
                : 'bg-white text-black hover:bg-neutral-200'
            }`}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      }
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 rounded-full p-2 ${
            danger ? 'bg-red-500/15 text-red-300' : 'bg-white/10 text-white'
          }`}
        >
          <TriangleAlert className="h-4 w-4" />
        </div>
        <p className="text-sm leading-6 text-neutral-300">{message}</p>
      </div>
    </SystemModal>
  );
}
