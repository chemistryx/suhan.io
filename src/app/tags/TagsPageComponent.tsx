import { Heading, HeadingDescription, HeadingTitle } from "@/components/Heading";
import styles from "@/styles/pages/tags/TagsPage.module.scss";
import { Tag } from "@/types/tag";
import Badge from "@/components/Badge";
import Link from "next/link";
import { toStaggerDelay } from "@/utils/animations";

interface Props {
    tags: (Tag & { count: number })[];
}

const TagsPageComponent = ({ tags }: Props) => {
    return (
        <div className={styles.base}>
            <Heading>
                <HeadingTitle>태그</HeadingTitle>
                <HeadingDescription>{tags.length}개의 태그가 있습니다.</HeadingDescription>
            </Heading>
            <div className={styles.tagsWrapper}>
                <ul className={styles.tags}>
                    {tags.map((tag, idx) => (
                        <Link key={tag.slug} href={`/tags/${tag.slug}`} data-umami-event="tag-click" data-umami-event-tag={tag.slug} style={{ animationDelay: toStaggerDelay(idx) }}>
                            <li className={styles.tag}>
                                <Badge>{tag.name}</Badge>
                                <span className={styles.description}>{tag.count}개의 기록이 있습니다.</span>
                            </li>
                        </Link>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TagsPageComponent;
