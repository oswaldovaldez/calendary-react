import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";

interface ModalProps {
  isOpen: boolean;
  onClosex: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "lg" | "xl" | "";
}

export default function Modal({
  isOpen,
  onClosex,
  title,
  children,
  size = "",
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = "hidden";
    } else {
      dialog.close();
      document.body.style.overflow = "unset";
    }

    // Cleanup al desmontar
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      onClosex();
    };

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

  const sizeClass = size ? `modal-${size}` : "";

  // No renderizar nada si el modal no está abierto
  if (!isOpen) {
    return null;
  }

  // ✅ Usar Portal para renderizar en el root del documento
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
        zIndex: 9999, // Z-index muy alto
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: 0,
      }}
    >
      <div className={`modal-dialog ${sizeClass}`} style={{ margin: 0 }}>
        <div className="modal-content">
          {title && (
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button
                type="button"
                className="btn btn-danger neumo"
                aria-label="Close"
                onClick={onClosex}
              >
                <IoClose />
              </button>
            </div>
          )}
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </dialog>,
    document.body // ✅ Renderizar directamente en el body
  );
}
