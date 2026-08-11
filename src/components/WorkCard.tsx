import Link from "next/link";
import { Launch, Trophy } from "@carbon/icons-react";
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
    // previews always stay on the site, so only a full card can leave it
    const isExternal = !preview && !!work.href && /^https?:\/\//.test(work.href);

    const content = (
        <>
            <div className={styles.header}>
                <div className={styles.titleWrapper}>
                    <h4 className={styles.title}>{work.title}</h4>
                    {isExternal && <Launch className={styles.external} size={12} aria-label="새 탭에서 열림" />}
                </div>
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

    return (
        <Link
            id={work.slug}
            className={styles.base}
            href={work.href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            style={style}
        >
            {content}
        </Link>
    );
};

export default WorkCard;
