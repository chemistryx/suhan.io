import Link from "next/link";
import { Trophy } from "@carbon/icons-react";
import Badge from "./Badge";
import Tooltip from "./Tooltip";
import { Work } from "@/types/work";
import { toPeriodString } from "@/utils/works";
import styles from "@/styles/components/WorkCard.module.scss";
import { CSSProperties } from "react";

interface Props {
    work: Work;
    preview?: boolean;
    style?: CSSProperties;
}

const WorkCard = ({ work, preview, style }: Props) => {
    const content = (
        <>
            <div className={styles.header}>
                <h4 className={styles.title}>{work.title}</h4>
                {work.award &&
                    <Tooltip className={styles.award} content={work.award.competition}>
                        <Trophy size={14} />
                        {work.award.prize}
                    </Tooltip>
                }
            </div>
            <div className={styles.meta}>
                {work.role && <span>{work.role}</span>}
                <span className={styles.period}>{toPeriodString(work)}</span>
            </div>
            <p className={styles.description}>{work.description}</p>
            {!preview &&
                <div className={styles.stack}>
                    {work.stack.map((item) => (
                        <Badge key={item}>{item}</Badge>
                    ))}
                </div>
            }
        </>
    );

    // Every preview points at its own entry on /works, including the private
    // ones that have nowhere else to send the reader.
    if (preview) {
        return (
            <Link className={styles.base} href={`/works#${work.slug}`} style={style}>
                {content}
            </Link>
        );
    }

    if (!work.href) {
        return <div id={work.slug} className={styles.base} style={style}>{content}</div>;
    }

    const isExternal = /^https?:\/\//.test(work.href);

    return (
        <Link
            id={work.slug}
            className={styles.base}
            href={work.href}
            target={isExternal ? "_blank" : undefined}
            style={style}
        >
            {content}
        </Link>
    );
};

export default WorkCard;
