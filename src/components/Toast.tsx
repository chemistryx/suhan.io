import { Toaster } from "sonner";
import styles from "@/styles/components/Toast.module.scss";

const Toast = () => {
    return (
        <Toaster
            position="top-center"
            toastOptions={{
                className: styles.base,
                duration: 3500,
            }}
            theme="system"
        />
    );
};

export default Toast;
