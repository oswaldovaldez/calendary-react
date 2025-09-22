import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

export const showConfirm = ({
  title,
  text,
  icon = 'warning',
  id = 0,
  confirmButtonText = 'Sí, eliminar',
  cancelButtonText = 'Cancelar',
  handleConfirm
}: {
  title: string | JSX.Element
  text?: string | JSX.Element
  id: number
  icon?: 'success' | 'error' | 'warning' | 'info' | 'question'
  confirmButtonText?: string
  cancelButtonText?: string
  handleConfirm: (id: number) => void | Promise<void>
}) => {
  return MySwal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    reverseButtons: true,        
    focusCancel: true,          
    confirmButtonColor: '#d33',  
    cancelButtonColor: '#3085d6',
    confirmButtonText,
    cancelButtonText,
    customClass: {
      popup: 'rounded-xl shadow-lg', 
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await handleConfirm(id);
        MySwal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El registro se eliminó correctamente',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el registro. Intenta de nuevo.',
          confirmButtonText: 'Entendido'
        });
      }
    }
  });
};
