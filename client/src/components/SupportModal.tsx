import { X } from "lucide-react";
import SupportForm from "./SupportForm";

/**
 * Support Modal: Modal para Formulário de Suporte
 * Componente wrapper que exibe o formulário em um modal responsivo
 */

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
}

export default function SupportModal({ isOpen, onClose, email }: SupportModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-background border border-border shadow-2xl animate-in fade-in zoom-in-95 duration-300">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-4 sm:p-6 border-b border-border bg-background/95 backdrop-blur-sm">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold">Suporte Técnico</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Relatar problema de instalação
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-card rounded-lg transition flex-shrink-0"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6">
            <SupportForm onClose={onClose} email={email} />
          </div>
        </div>
      </div>
    </>
  );
}
