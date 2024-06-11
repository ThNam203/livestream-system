"use client";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//go to react-toastify documentation for more custom Toast in playground
const Toast = () => {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={true}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      transition={Bounce}
    />
  );
};

const showSuccessToast = (message: string) => {
  toast.success(message);
};

const showErrorToast = (message: string) => {
  toast.error(message);
};

const showWarningToast = (message: string) => {
  toast.warning(message);
};

const showDefaultToast = (message: string) => {
  toast.info(message);
};

export {
  Toast,
  showSuccessToast,
  showErrorToast,
  showDefaultToast,
  showWarningToast,
};
