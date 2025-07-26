import styles from "@/styles/components/Badge.module.scss";

interface Props {
    children: React.ReactNode;
    onClick?: () => void;
}

const Badge = ({ children, onClick }: Props) => {
    return (
        <span className={styles.base} onClick={onClick}>{children}</span>
    );
};

export default Badge;
