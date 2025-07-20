import styles from "@/styles/components/Badge.module.scss";

interface Props {
    children: React.ReactNode;
}

const Badge = ({ children }: Props) => {
    return (
        <span className={styles.base}>{children}</span>
    );
};

export default Badge;
