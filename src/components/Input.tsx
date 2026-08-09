import styles from "@/styles/components/Input.module.scss";
import { InputHTMLAttributes, useId } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

const Input = ({ label, id, ...props }: Props) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
        <div className={styles.base}>
            {label &&
                <label className={styles.label} htmlFor={inputId}>{label}</label>
            }
            <input id={inputId} className={styles.input} {...props} />
        </div>
    );
};

export default Input;
