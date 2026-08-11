import Link from "next/link";
import { ChevronLeft, ChevronRight } from "@carbon/icons-react";
import styles from "@/styles/components/RecordNavigation.module.scss";
import { AdjacentRecords } from "@/types/record";

const RecordNavigation = ({ previous, next }: AdjacentRecords) => {
    if (!previous && !next) return null;

    return (
        <nav className={styles.base} aria-label="이전 및 다음 게시글">
            <div className={styles.links}>
                {previous ? (
                    <Link className={styles.item} href={`/records/${decodeURIComponent(previous.slug)}`} rel="prev">
                        <ChevronLeft className={styles.icon} size={18} />
                        <div className={styles.text}>
                            <span className={styles.label}>이전 글</span>
                            <span className={styles.title}>{previous.title}</span>
                        </div>
                    </Link>
                ) : (
                    <div className={styles.placeholder} aria-hidden />
                )}
                {next ? (
                    <Link className={[styles.item, styles.next].join(" ")} href={`/records/${decodeURIComponent(next.slug)}`} rel="next">
                        <ChevronRight className={styles.icon} size={18} />
                        <div className={styles.text}>
                            <span className={styles.label}>다음 글</span>
                            <span className={styles.title}>{next.title}</span>
                        </div>
                    </Link>
                ) : (
                    <div className={styles.placeholder} aria-hidden />
                )}
            </div>
        </nav>
    );
};

export default RecordNavigation;
