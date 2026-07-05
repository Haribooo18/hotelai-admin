"use client";

import { Dialog } from "@base-ui/react/dialog";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  loading = false,
  onConfirm,
}: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="ds-dialog-backdrop fixed inset-0 z-50 bg-black/50 backdrop-blur-[3px]" />

        <Dialog.Popup
          className={cn(
            "ds-dialog-content fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2",
            "rounded-[var(--ds-radius)] bg-[var(--shell-surface-raised)] p-5 shadow-[var(--shell-shadow-lg)] outline-none"
          )}
        >
          <Dialog.Title className="ds-section-title text-[15px]">
            {title}
          </Dialog.Title>

          {description ? (
            <Dialog.Description className="mt-2 text-[13px] leading-relaxed text-[var(--shell-muted)]">
              {description}
            </Dialog.Description>
          ) : null}

          <div className="mt-5 flex justify-end gap-2.5">
            <Dialog.Close
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                loading && "pointer-events-none opacity-50"
              )}
              disabled={loading}
            >
              {cancelLabel}
            </Dialog.Close>

            <Button
              variant={destructive ? "destructive" : "default"}
              size="sm"
              loading={loading}
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
