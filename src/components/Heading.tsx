import styles from "@/styles/components/Heading.module.scss";

interface Props {
    children: React.ReactNode;
    divider?: boolean;
}

const Heading = ({ children, divider = false }: Props) => {
    return (
        <div className={[styles.base, divider ? styles.divider : ""].join(" ")}>
            {children}
        </div>
    );
};

const HeadingTitle = ({ children }: Props) => {
    return (
        <h1 className={styles.title}>{children}</h1>
    );
};

const HeadingDescription = ({ children }: Props) => {
    return (
        <div className={styles.description}>{children}</div>
    );
};

export { Heading, HeadingTitle, HeadingDescription };
