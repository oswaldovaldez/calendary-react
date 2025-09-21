import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)


// 🔹 Confirmación (OK/Cancelar)
export const showConfirm = ({
  title,
  text,
  icon = 'warning',
  id=0,
  confirmButtonText = 'Sí',
  cancelButtonText = 'Cancelar',
  handleConfirm
}: {
  title: string | JSX.Element
  text?: string | JSX.Element
  id:number
  icon?: 'success' | 'error' | 'warning' | 'info' | 'question'
  confirmButtonText?: string
  cancelButtonText?: string
  handleConfirm: (id:number)=> void
}) => {
  return MySwal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
  }).then((result) => {
      if (result.isConfirmed) { 
          handleConfirm(id);
      }
   })
}
