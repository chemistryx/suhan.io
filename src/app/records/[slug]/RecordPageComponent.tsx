"use client"
import styles from "@/styles/pages/records/RecordPage.module.scss";
import { Heading, HeadingDescription, HeadingTitle } from "@/components/Heading";
import { toDateString } from "@/utils/strings";
import { AdjacentRecords, Record } from "@/types/record";
import Button, { ButtonColor, ButtonSize, ButtonStyle } from "@/components/Button";
import RecordDeleteModal from "@/components/modals/RecordDeleteModal";
import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "@carbon/icons-react";
import useUser from "@/hooks/useUser";
import ScrollTopButton from "@/components/ScrollTopButton";
import Badge from "@/components/Badge";
import Link from "next/link";
import MDEditor from "@uiw/react-md-editor";
import RecordComments from "@/components/RecordComments";
import rehypeExternalLinks from "rehype-external-links";
import LightboxImage from "@/components/LightboxImage";
import TableOfContents from "@/components/TableOfContents";
import RecordNavigation from "@/components/RecordNavigation";

interface Props {
    record: Record;
    adjacent: AdjacentRecords;
}

const RecordPageComponent = ({ record, adjacent }: Props) => {
    const { user } = useUser();
    const [showDeleteModal, setDeleteModal] = useState(false);
    const endRef = useRef<HTMLDivElement>(null);

    // Reaching the end of the body counts as reading it, once per visit.
    useEffect(() => {
        const end = endRef.current;
        if (!end) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            track("read-complete", { slug: record.slug });
            observer.disconnect();
        });

        observer.observe(end);
        return () => observer.disconnect();
    }, [record.slug]);
    const router = useRouter();

    const handleEdit = () => {
        router.push(`/records/${record.slug}/edit`);
    };

    return (
        <>
            <RecordDeleteModal showModal={showDeleteModal} setModal={setDeleteModal} slug={record.slug} />
            <div className={styles.base}>
                <Heading divider>
                    <HeadingTitle>{record.title}</HeadingTitle>
                    <HeadingDescription>
                        <div className={styles.tags}>
                            {record.tags.map((tag) => (
                                <Link key={tag.slug} href={`/tags/${tag.slug}`} data-umami-event="tag-click" data-umami-event-tag={tag.slug}>
                                    <Badge>{tag.name}</Badge>
                                </Link>
                            ))}
                        </div>
                        <div className={styles.meta}>
                            {record.category &&
                                <Link className={[styles.item, styles.category].join(" ")} href={`/records?category=${record.category.slug}`} data-umami-event="category-filter" data-umami-event-category={record.category.slug}>{record.category.name}</Link>
                            }
                            <span className={styles.item}>{toDateString(record.created_at)}</span>
                        </div>
                        <div className={styles.actions}>
                            {user &&
                                <div className={styles.manage}>
                                    <Button size={ButtonSize.small} color={ButtonColor.secondary} onClick={handleEdit}>수정</Button>
                                    <Button size={ButtonSize.small} color={ButtonColor.secondary} onClick={() => setDeleteModal(true)}>삭제</Button>
                                </div>
                            }
                            <Button className={styles.list} size={ButtonSize.small} style={ButtonStyle.outline} onClick={() => router.push("/records")}><ChevronLeft size={16} />목록</Button>
                        </div>
                    </HeadingDescription>
                </Heading>
                <MDEditor.Markdown className={styles.content} source={record.content}
                    rehypePlugins={[
                        [rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer", "external"] }]
                    ]}
                    components={{
                        img: (props) => <LightboxImage {...props} />
                    }}
                />
                <div ref={endRef} />
                <RecordNavigation {...adjacent} />
                <RecordComments record={record} />
                <TableOfContents contentClassName={styles.content} />
                <ScrollTopButton />
            </div>
        </>
    );
};

export default RecordPageComponent;
