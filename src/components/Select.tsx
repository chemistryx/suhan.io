import styles from "@/styles/components/Select.module.scss";
import { ChevronDown } from "@carbon/icons-react";
import { SelectHTMLAttributes, useId } from "react";

export type SelectOption = {
    label: string;
    value: string;
};

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: SelectOption[];
    // Rendered as an empty-valued option, so choosing it also clears the field.
    placeholder?: string;
}

const Select = ({ label, id, options, placeholder, ...props }: Props) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;

    return (
        <div className={styles.base}>
            {label &&
                <label className={styles.label} htmlFor={selectId}>{label}</label>
            }
            <div className={styles.control}>
                <select id={selectId} className={styles.select} {...props}>
                    {placeholder && <option value="">{placeholder}</option>}
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
                <ChevronDown className={styles.indicator} size={16} />
            </div>
        </div>
    );
};

export default Select;
