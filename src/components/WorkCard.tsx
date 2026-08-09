import Link from "next/link";
import Badge from "./Badge";
import { Work } from "@/types/work";
import { toPeriodString } from "@/utils/works";
import styles from "@/styles/components/WorkCard.module.scss";
import { CSSProperties } from "react";

interface Props {
    work: Work;
    style?: CSSProperties;
}

const WorkCard = ({ work, style }: Props) => {
    return (
        <Link className={styles.base} href={work.href} target="_blank" style={style}>
            <div className={styles.header}>
                <h4 className={styles.title}>{work.title}</h4>
                <span className={styles.period}>{toPeriodString(work)}</span>
            </div>
            <p className={styles.description}>{work.description}</p>
            <div className={styles.stack}>
                {work.stack.map((item) => (
                    <Badge key={item}>{item}</Badge>
                ))}
            </div>
        </Link>
    );
};

export default WorkCard;
