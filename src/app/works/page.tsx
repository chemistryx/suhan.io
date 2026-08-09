import { Heading, HeadingDescription, HeadingTitle } from "@/components/Heading";
import WorkCard from "@/components/WorkCard";
import { works } from "@/data/works";
import styles from "@/styles/pages/WorksPage.module.scss";
import { Metadata } from "next";

const description = "지금까지 만들어온 것들입니다.";

export const metadata: Metadata = {
    title: "작업물",
    description,
    openGraph: {
        title: "작업물",
        description
    }
};

export default function WorksPage() {
    return (
        <div className={styles.base}>
            <Heading>
                <HeadingTitle>작업물</HeadingTitle>
                <HeadingDescription>{works.length}개의 작업물이 있습니다.</HeadingDescription>
            </Heading>
            <div className={styles.works}>
                {works.map((work, idx) => (
                    <WorkCard key={work.slug} work={work} style={{ animationDelay: `${(idx + 1) * 0.05}s` }} />
                ))}
            </div>
        </div>
    );
}
