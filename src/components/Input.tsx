import styles from "@/styles/components/Input.module.scss";
import { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

const Input = ({ label, ...props }: Props) => {
    return (
        <div className={styles.base}>
            {label &&
                <label className={styles.label}>{label}</label>
            }
            <input className={styles.input} {...props} />
        </div>
    );
};

export default Input;
