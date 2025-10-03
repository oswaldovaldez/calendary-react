import React, { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";

interface ModalProps {
  isOpen: boolean;
  onClosex: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full"; 
}

export const ModalFooter = ({
  formId,
  submitLabel = "Guardar",
  cancelLabel = "Cancelar",
  onCancel,
}: {
  formId: string;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel: () => void;
}) => (
  <>
    <button
      type="button"
      className="btn btn-secondary"
      onClick={onCancel}
    >
      {cancelLabel}
    </button>
    <button
      type="submit"
      form={formId}
      className="btn btn-success"
    >
      {submitLabel}
    </button>
  </>
);

const Modal = React.memo(
  ({ isOpen, onClosex, title, children, size = "md"}: ModalProps) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    // abrir/cerrar
    useEffect(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;

      if (isOpen) {
        dialog.showModal();
        document.body.style.overflow = "hidden";
      } else {
        dialog.close();
        document.body.style.overflow = "unset";
      }

      return () => {
        document.body.style.overflow = "unset";
      };
    }, [isOpen]);

    // cerrar con click afuera o escape
    useEffect(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;

      const handleClose = () => onClosex();

      const handleClick = (event: MouseEvent) => {
        const rect = dialog.getBoundingClientRect();
        const isInDialog =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;

        if (!isInDialog) {
          onClosex();
        }
      };

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          event.preventDefault();
          onClosex();
        }
      };

      dialog.addEventListener("close", handleClose);
      dialog.addEventListener("click", handleClick);
      document.addEventListener("keydown", handleEscape);

      return () => {
        dialog.removeEventListener("close", handleClose);
        dialog.removeEventListener("click", handleClick);
        document.removeEventListener("keydown", handleEscape);
      };
    }, [onClosex]);

    if (!isOpen) return null;

    // map de tamaños con tailwind
    const sizeMap: Record<string, string> = {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
      "3xl": "max-w-3xl",
      "4xl": "max-w-4xl",
      full: "max-w-full", 
    };

    const sizeClass = sizeMap[size] || sizeMap["md"];

    return createPortal(
      <dialog
        ref={dialogRef}
        className="modal"
        style={{
          padding: 0,
          border: "none",
          borderRadius: 0,
          maxWidth: "none",
          maxHeight: "none",
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: 0,
        }}
      >
        <div
          className={`modal-dialog w-full px-2 sm:px-6 md:px-0 ${sizeClass}`}
          style={{ margin: 0 }}
        >
          <div className="modal-content card neumo w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            {title && (
              <div className="modal-header flex justify-between items-center border-b border-gray-200 p-3 shrink-0">
                <h5 className="modal-title text-xl font-semibold">{title}</h5>
                <button
                  type="button"
                  className="text-xl text-gray-500 hover:text-gray-700 cursor-pointer"
                  aria-label="Close"
                  onClick={onClosex}
                >
                  <IoClose />
                </button>
              </div>
            )}

            {/* Body */}
            <div className="modal-body overflow-y-auto overflow-x-hidden  flex-1">
              {children}
            </div>

            
          </div>
        </div>
      </dialog>,
      document.body
    );
  }
);

export default Modal;
