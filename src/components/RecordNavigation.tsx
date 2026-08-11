import Link from "next/link";
import { ChevronLeft, ChevronRight } from "@carbon/icons-react";
import styles from "@/styles/components/RecordNavigation.module.scss";
import { AdjacentRecords } from "@/types/record";

type Direction = keyof AdjacentRecords;

interface ItemProps {
    direction: Direction;
    record: AdjacentRecords[Direction];
}

const NavigationItem = ({ direction, record }: ItemProps) => {
    const isNext = direction === "next";
    const Icon = isNext ? ChevronRight : ChevronLeft;
    const label = isNext ? "다음 기록" : "이전 기록";
    const className = [styles.item, isNext ? styles.next : ""].join(" ");

    const body = (
        <>
            <Icon className={styles.icon} size={18} />
            <div className={styles.text}>
                <span className={styles.label}>{label}</span>
                <span className={styles.title}>{record ? record.title : "기록이 없습니다"}</span>
            </div>
        </>
    );

    // the slot keeps its card so both sides stay balanced at either end of the archive
    if (!record) return <div className={[className, styles.empty].join(" ")}>{body}</div>;

    return (
        <Link className={className} href={`/records/${decodeURIComponent(record.slug)}`} rel={isNext ? "next" : "prev"}>
            {body}
        </Link>
    );
};

const RecordNavigation = ({ previous, next }: AdjacentRecords) => {
    if (!previous && !next) return null;

    return (
        <nav className={styles.base} aria-label="이전 및 다음 기록">
            <div className={styles.links}>
                <NavigationItem direction="previous" record={previous} />
                <NavigationItem direction="next" record={next} />
            </div>
        </nav>
    );
};

export default RecordNavigation;
