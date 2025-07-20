"use client"
import styles from "@/styles/pages/records/NewRecordPage.module.scss";
import { Heading, HeadingDescription, HeadingTitle } from "@/components/Heading";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Button, { ButtonSize, ButtonStyle } from "@/components/Button";
import { RECORDS_TABLE_NAME } from "@/constants";
import { ChevronLeft } from "lucide-react";
import RecordForm, { RecordFormData } from "@/components/RecordForm";
import { useState } from "react";
import { useNavigationGuard } from "next-navigation-guard";

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
        const { error } = await supabase.from(RECORDS_TABLE_NAME).insert({
            title: data.title,
            slug: encodeURIComponent(data.slug),
            content: data.content,
            draft: data.draft,
            author_id: user?.id,
            tags: data.tags
        });

        if (error) {
            toast.error(error.message);
            setIsDirty(true);
            return;
        }


        toast.success("성공적으로 게시물을 등록했습니다.");
        router.push("/records");
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
