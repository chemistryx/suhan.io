import styles from "@/styles/components/Skeleton.module.scss";

const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div className={[styles.base, className].join(" ")} {...props} />
    );
};

export default Skeleton;
