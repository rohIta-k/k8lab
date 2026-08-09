import * as Dialog from "@radix-ui/react-dialog";

import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

export default function Modal({
  open,
  title,
  children,
  onClose,
}: ModalProps) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          onClose();
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay
          className="
            fixed
            inset-0
            z-50
            bg-black/70
            backdrop-blur-sm
          "
        />

        <Dialog.Content
          className="
            fixed
            left-1/2
            top-1/2
            z-50
            w-full
            max-w-xl
            -translate-x-1/2
            -translate-y-1/2
            rounded-[var(--radius-lg)]
            border
            border-[var(--border-color)]
            bg-[var(--background-card)]
            shadow-[var(--shadow-lg)]
          "
        >
          <div className="flex items-center justify-between border-b border-[var(--border-color)] px-6 py-4">
            <Dialog.Title className="text-lg font-semibold text-[var(--text-primary)]">
              {title}
            </Dialog.Title>

            <Dialog.Close asChild>
              <button
                className="
                  rounded-full
                  p-2
                  text-[var(--text-secondary)]
                  transition
                  hover:bg-[var(--background-hover)]
                "
              >
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          <div className="p-6">
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}