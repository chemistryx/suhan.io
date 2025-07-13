import styles from "@/styles/components/Container.module.scss";

interface Props {
    children: Readonly<React.ReactNode>
}

const Container = ({ children }: Props) => {
    return (
        <div className={styles.base}>
            {children}
        </div>
    );
};

export default Container;
