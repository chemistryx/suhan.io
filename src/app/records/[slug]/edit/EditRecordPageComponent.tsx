"use client"
import Button, { ButtonSize, ButtonStyle } from "@/components/Button";
import { Heading, HeadingDescription, HeadingTitle } from "@/components/Heading";
import { ChevronLeft } from "lucide-react";
import styles from "@/styles/pages/records/EditRecordPage.module.scss";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import RecordForm, { RecordFormData } from "@/components/RecordForm";
import { useState } from "react";
import { useNavigationGuard } from "next-navigation-guard";
import { RECORDS_TABLE_NAME } from "@/constants";
import { toast } from "sonner";

interface Props {
    record: RecordFormData;
}

const EditRecordPageComponent = ({ record }: Props) => {
    const supabase = createClient();
    const router = useRouter();
    const [isDirty, setIsDirty] = useState(false);
    useNavigationGuard({ enabled: isDirty, confirm: () => window.confirm("작성중인 내용이 있습니다. 계속하시겠습니까?") });

    const handleSubmit = async (formData: RecordFormData) => {
        setIsDirty(false);
        const { error, count } = await supabase.from(RECORDS_TABLE_NAME).update({
            title: formData.title,
            slug: encodeURIComponent(formData.slug),
            content: formData.content,
            draft: formData.draft,
            tags: formData.tags
        }, { count: "exact" }).eq("slug", record.slug);

        if (error || count === 0) {
            toast.error("게시물 수정 중 오류가 발생했습니다.");
            console.error(error?.message);
            setIsDirty(true);
            return;
        }

        toast.success("성공적으로 게시물을 수정했습니다.");
        router.push(`/records/${formData.slug}`);
    }

    return (
        <div className={styles.base}>
            <Heading>
                <HeadingTitle>기록 수정</HeadingTitle>
                <HeadingDescription>기록을 수정합니다.</HeadingDescription>
            </Heading>
            <div className={styles.actions}>
                <Button size={ButtonSize.small} style={ButtonStyle.outline} onClick={() => router.push("/records")}><ChevronLeft size={16} strokeWidth={1.5} />목록</Button>
            </div>
            <RecordForm initialValues={{ ...record, slug: decodeURIComponent(record.slug) }} onSubmit={handleSubmit} onDirtyChange={setIsDirty} mode="edit" />
        </div>
    );
}

export default EditRecordPageComponent;
