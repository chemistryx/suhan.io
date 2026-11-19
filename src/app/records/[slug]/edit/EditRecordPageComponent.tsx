"use client"
import Button, { ButtonSize, ButtonStyle } from "@/components/Button";
import { Heading, HeadingDescription, HeadingTitle } from "@/components/Heading";
import { ChevronLeft } from "@carbon/icons-react";
import styles from "@/styles/pages/records/EditRecordPage.module.scss";
import { useRouter } from "next/navigation";
import RecordForm, { RecordFormData } from "@/components/RecordForm";
import { useState } from "react";
import { useNavigationGuard } from "@/hooks/useNavigationGuard";
import NavigationGuardModal from "@/components/modals/NavigationGuardModal";
import { toast } from "sonner";
import { RecordDoc } from "@/types/record";
import { updateRecord } from "../../actions";

interface Props {
    record: RecordDoc;
    tagOptions: string[];
}

const EditRecordPageComponent = ({ record, tagOptions }: Props) => {
    const router = useRouter();
    const [isDirty, setDirty] = useState(false);
    const { navigate, isBlocked, confirmNavigation, cancelNavigation } = useNavigationGuard({ enabled: isDirty });

    const handleSubmit = async (data: RecordFormData) => {
        setDirty(false);

        const result = await updateRecord(record.slug, data);

        if (!result.ok) {
            toast.error(result.error);
            setDirty(true);
            return;
        }

        toast.success("성공적으로 게시물을 수정했습니다.");
        router.push(`/records/${result.slug}`);
    };

    const { title, description, content, category, tags, published } = record;

    return (
        <div className={styles.base}>
            <Heading>
                <HeadingTitle>기록 수정</HeadingTitle>
                <HeadingDescription>기록을 수정합니다.</HeadingDescription>
            </Heading>
            <div className={styles.actions}>
                <Button size={ButtonSize.small} style={ButtonStyle.outline} onClick={() => navigate(`/records/${record.slug}`)}><ChevronLeft size={16} />돌아가기</Button>
            </div>
            <RecordForm
                initialValues={{ title, description, content, category, tags, published }}
                tagOptions={tagOptions}
                onSubmit={handleSubmit}
                onDirtyChange={setDirty}
                mode="edit"
            />
            <NavigationGuardModal showModal={isBlocked} setModal={(open) => { if (!open) cancelNavigation(); }} onConfirm={confirmNavigation} />
        </div>
    );
}

export default EditRecordPageComponent;
