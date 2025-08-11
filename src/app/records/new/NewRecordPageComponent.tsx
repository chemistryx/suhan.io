"use client"
import styles from "@/styles/pages/records/NewRecordPage.module.scss";
import { Heading, HeadingDescription, HeadingTitle } from "@/components/Heading";
import { createClient } from "@/utils/supabase/client";
import { PostgrestError, User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Button, { ButtonSize, ButtonStyle } from "@/components/Button";
import { RECORD_TAGS_TABLE_NAME, RECORDS_TABLE_NAME, TAGS_TABLE_NAME } from "@/constants";
import { ChevronLeft } from "lucide-react";
import RecordForm, { RecordFormData } from "@/components/RecordForm";
import { useState } from "react";
import { useNavigationGuard } from "next-navigation-guard";
import { normalize } from "@/utils/strings";

interface Props {
    user: User;
}

const NewRecordPageComponent = ({ user }: Props) => {
    const supabase = createClient();
    const router = useRouter();
    const [isDirty, setIsDirty] = useState(false);
    useNavigationGuard({ enabled: isDirty, confirm: () => window.confirm("작성중인 내용이 있습니다. 계속하시겠습니까?") });

    const handleSubmit = async (data: RecordFormData) => {
        setIsDirty(false);

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

            // 3. insert record
            const { data: record, error: insertRecordError } = await supabase
                .from(RECORDS_TABLE_NAME)
                .insert({
                    title: data.title,
                    description: data.description,
                    slug: encodeURIComponent(data.slug),
                    content: data.content,
                    draft: data.draft,
                    author_id: user?.id,
                })
                .select()
                .single();

            if (insertRecordError) throw insertRecordError;

            // 4. insert record_tags relation
            const { error: insertRecordTagsError } = await supabase
                .from(RECORD_TAGS_TABLE_NAME)
                .insert(tagIds.map((id) => ({
                    record_id: record.id,
                    tag_id: id
                })));

            if (insertRecordTagsError) throw insertRecordTagsError;

            toast.success("성공적으로 게시물을 등록했습니다.");
            router.push("/records");
        } catch (e) {
            toast.error((e as PostgrestError).message || "게시물 등록 중 오류가 발생했습니다.");
            setIsDirty(true);
        }
    };

    return (
        <div className={styles.base}>
            <Heading>
                <HeadingTitle>새 기록</HeadingTitle>
                <HeadingDescription>새 기록을 작성합니다.</HeadingDescription>
            </Heading>
            <div className={styles.actions}>
                <Button size={ButtonSize.small} style={ButtonStyle.outline} onClick={() => router.push("/records")}><ChevronLeft size={16} strokeWidth={1.5} />목록</Button>
            </div>
            <RecordForm onSubmit={handleSubmit} onDirtyChange={setIsDirty} mode="create" />
        </div>
    );
}

export default NewRecordPageComponent;
