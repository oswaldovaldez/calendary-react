import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export const showConfirm = ({
  id,
  title,
  message,
  successText,
  errorText,
  icon = "warning",
  confirmButtonText = "Eliminar",
  cancelButtonText = "Cancelar",
  handleConfirm,
}: {
  id: number;
  title: string;        // Título de la alerta
  message: string;      // Texto completo de la pregunta
  successText: string;  // Texto completo cuando se elimina con éxito
  errorText: string;    // Texto completo si falla
  icon?: "success" | "error" | "warning" | "info" | "question";
  confirmButtonText?: string;
  cancelButtonText?: string;
  handleConfirm: (id: number) => void | Promise<void>;
}) => {
  return MySwal.fire({
    title,
    html: `
      <p>${message}</p>
      <p style="margin-top:12px;color:#dc2626;font-size:0.875rem;">
        Esta acción no se puede deshacer.
      </p>
    `,
    icon,
    width: "380px",
    showCancelButton: true,
    reverseButtons: true,
    focusCancel: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText,
    cancelButtonText,
    customClass: {
      popup: "rounded-2xl shadow-2xl p-6",
      icon: "scale-75",
      htmlContainer: "mt-2 text-base text-gray-700",
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await handleConfirm(id);
        MySwal.fire({
          icon: "success",
          title: "Eliminado",
          html: `<p>${successText}</p>`,
          timer: 2000,
          showConfirmButton: false,
          width: "320px",
          customClass: {
            popup: "rounded-2xl shadow-2xl p-4 space-y-2",
            icon: "scale-75",
          },
        });
      } catch (error) {
        MySwal.fire({
          icon: "error",
          title: "Error",
          text: errorText,
          confirmButtonText: "Entendido",
        });
      }
    }
  });
};
