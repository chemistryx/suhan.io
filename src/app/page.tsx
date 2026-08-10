import styles from "@/styles/pages/HomePage.module.scss";
import Link from "next/link";
import WorkCard from "@/components/WorkCard";
import { works } from "@/data/works";

const FEATURED_COUNT = 3;

export default function HomePage() {
    return (
        <div className={styles.base}>
            <div className={styles.leading}>
                <p style={{ animationDelay: "0s" }}>모두가 쉽게 사용할 수 있고, 실생활에서의 불편함을 해결할 수 있는 서비스를 만드는 데 관심이 많습니다.</p>
                <p style={{ animationDelay: "0.2s" }}>새로운 기술을 접하는 것을 꺼리지 않으며, 한번 시작한 것은 끝까지 마무리하는 끈기를 지니고 있습니다.</p>
            </div>
            <div className={styles.works}>
                <div className={styles.worksHeading}>
                    <h3 className={styles.heading}>최근 작업물</h3>
                    <Link className={styles.more} href="/works">전체 보기</Link>
                </div>
                <div className={styles.cards}>
                    {works.slice(0, FEATURED_COUNT).map((work, idx) => (
                        <WorkCard key={work.slug} work={work} preview style={{ animationDelay: `${0.7 + idx * 0.1}s` }} />
                    ))}
                </div>
            </div>
        </div>
    );
}
