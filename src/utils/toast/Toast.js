import { toast } from 'react-toastify';
const opt = {
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  className: 'react-toastify',
};
// Function is expecting 2 params, first is the type
// Second is the message
// Types: success, error, warn, info
export const Toast = (type, info) =>
  type === 'error'
    ? toast.error(info, {
        position: 'top-right',
        ...opt,
      })
    : type === 'success'
    ? toast.success(info, {
        position: 'top-right',
        ...opt,
      })
    : type === 'info'
    ? toast.info(info, {
        position: 'top-right',
        ...opt,
      })
    : type === 'warn'
    ? toast.warn(info, {
        position: 'top-right',
        ...opt,
      })
    : toast.success(info, {
        position: 'top-right',
        ...opt,
      });