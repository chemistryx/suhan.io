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
import { RECORD_TAGS_TABLE_NAME, RECORDS_TABLE_NAME, TAGS_TABLE_NAME } from "@/constants";
import { toast } from "sonner";
import { PostgrestError } from "@supabase/supabase-js";
import { normalize } from "@/utils/strings";

interface Props {
    record: RecordFormData;
}

const EditRecordPageComponent = ({ record }: Props) => {
    const supabase = createClient();
    const router = useRouter();
    const [isDirty, setDirty] = useState(false);
    useNavigationGuard({ enabled: isDirty, confirm: () => window.confirm("작성중인 내용이 있습니다. 계속하시겠습니까?") });

    const handleSubmit = async (data: RecordFormData) => {
        setDirty(false);

        try {
            // 1. find existing tags
            const { data: existingTags, error: selectExistingTagsError } = await supabase
                .from(TAGS_TABLE_NAME)
                .select("*")
                .in("name", data.tags);

            if (selectExistingTagsError) throw selectExistingTagsError;

            const existingTagNames = existingTags.map((tag) => tag.name);
            const newTagNames = data.tags.filter((name) => !existingTagNames.includes(name));

            // 2. insert newly added tags
            let insertedTags = [];

            if (newTagNames.length) {
                const { data: newTags, error: insertNewTagsError } = await supabase
                    .from(TAGS_TABLE_NAME)
                    .insert(newTagNames.map((name) => ({ name, slug: normalize(name) })))
                    .select();

                if (insertNewTagsError) throw insertNewTagsError;
                insertedTags = newTags;
            }

            const allTags = [...existingTags, ...insertedTags];
            const tagIds = allTags.map((tag) => tag.id);

            // 3. delete existing record_tags relation
            const { error: deleteRecordTagsError } = await supabase
                .from(RECORD_TAGS_TABLE_NAME)
                .delete()
                .eq("record_id", record.id);

            if (deleteRecordTagsError) throw deleteRecordTagsError;

            // 4. update record
            const { error: updateRecordError } = await supabase
                .from(RECORDS_TABLE_NAME)
                .update({
                    title: data.title,
                    description: data.description,
                    slug: encodeURIComponent(data.slug),
                    content: data.content,
                    published: data.published
                })
                .eq("id", record.id);

            if (updateRecordError) throw updateRecordError;

            // 5. insert record_tags relation
            const { error: insertRecordTagsError } = await supabase
                .from(RECORD_TAGS_TABLE_NAME)
                .insert(tagIds.map((id) => ({
                    record_id: record.id,
                    tag_id: id
                })));

            if (insertRecordTagsError) throw insertRecordTagsError;

            toast.success("성공적으로 게시물을 수정했습니다.");
            router.push(`/records/${data.slug}`);
        } catch (e) {
            toast.error((e as PostgrestError).message || "게시물 수정 중 오류가 발생했습니다.");
            setDirty(true);
        }
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
            <RecordForm initialValues={{ ...record, slug: decodeURIComponent(record.slug) }} onSubmit={handleSubmit} onDirtyChange={setDirty} mode="edit" />
        </div>
    );
}

export default EditRecordPageComponent;
