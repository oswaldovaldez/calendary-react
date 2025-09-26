import { useEffect, type ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"; // Bloquear scroll
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop" onClick={onClose}></div>

      {/* Modal */}
      <div className="modal">
        <div className="modal-dialog">
          <div className="modal-content neumo">
            {/* Header */}
            <div className="modal-header">
              {title && <h5 className="modal-title">{title}</h5>}
              <button
                type="button"
                className="modal-close"
                aria-label="Cerrar modal"
                onClick={onClose}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="modal-body">{children}</div>

            {/* Footer */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cerrar
              </button>
              <button type="button" className="btn btn-primary">
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
