import styles from "@/styles/components/Heading.module.scss";

interface Props {
    title: string;
    description?: string;
    divider?: boolean;
}

const Heading = ({ title, description, divider }: Props) => {
    return (
        <div className={[styles.base, divider ? styles.divider : ""].join(" ")}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.description}>{description}</p>
        </div>
    );
};

export default Heading;
