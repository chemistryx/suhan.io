"use client"
import styles from "@/styles/pages/records/NewRecordPage.module.scss";
import { Heading, HeadingDescription, HeadingTitle } from "@/components/Heading";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Button, { ButtonSize, ButtonStyle } from "@/components/Button";
import { ChevronLeft } from "@carbon/icons-react";
import RecordForm, { RecordFormData } from "@/components/RecordForm";
import { useState } from "react";
import { useNavigationGuard } from "@/hooks/useNavigationGuard";
import NavigationGuardModal from "@/components/modals/NavigationGuardModal";
import { createRecord } from "../actions";

interface Props {
    tagOptions: string[];
}

const NewRecordPageComponent = ({ tagOptions }: Props) => {
    const router = useRouter();
    const [isDirty, setDirty] = useState(false);
    const { navigate, isBlocked, confirmNavigation, cancelNavigation } = useNavigationGuard({ enabled: isDirty });

    const handleSubmit = async (data: RecordFormData) => {
        setDirty(false);

        const result = await createRecord(data);

        if (!result.ok) {
            toast.error(result.error);
            setDirty(true);
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
                <Button size={ButtonSize.small} style={ButtonStyle.outline} onClick={() => navigate("/records")}><ChevronLeft size={16} />목록</Button>
            </div>
            <RecordForm tagOptions={tagOptions} onSubmit={handleSubmit} onDirtyChange={setDirty} mode="create" />
            <NavigationGuardModal showModal={isBlocked} setModal={(open) => { if (!open) cancelNavigation(); }} onConfirm={confirmNavigation} />
        </div>
    );
}

export default NewRecordPageComponent;
