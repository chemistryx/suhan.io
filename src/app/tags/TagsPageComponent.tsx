"use client"
import { Heading, HeadingDescription, HeadingTitle } from "@/components/Heading";
import { useRouter } from "next/navigation";
import styles from "@/styles/pages/tags/TagsPage.module.scss";
import { Tag } from "@/types/tag";
import Badge from "@/components/Badge";

interface Props {
    tags: (Pick<Tag, "id" | "name" | "slug"> & {
        count: number;
    })[];
}

const TagsPageComponent = ({ tags }: Props) => {
    const router = useRouter();

    return (
        <div className={styles.base}>
            <Heading>
                <HeadingTitle>태그</HeadingTitle>
                <HeadingDescription>{tags.length}개의 태그가 있습니다.</HeadingDescription>
            </Heading>
            <div className={styles.tagsWrapper}>
                <ul className={styles.tags}>
                    {tags.map((tag) => (
                        <li key={tag.id} className={styles.tag} onClick={() => router.push(`/tags/${tag.slug}`)}>
                            <Badge>{tag.name}</Badge>
                            <span className={styles.description}>{tag.count}개의 기록이 있습니다.</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TagsPageComponent;
