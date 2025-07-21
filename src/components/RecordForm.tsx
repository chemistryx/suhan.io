import { Record } from "@/types/record";
import { useCallback, useEffect, useRef, useState } from "react";
import Button from "./Button";
import Input from "./Input";
import MarkdownEditor from "./MarkdownEditor";
import { normalize } from "@/utils/strings";
import CreatableSelect from "react-select/creatable";
import styles from "@/styles/components/RecordForm.module.scss";

export type RecordFormData = Pick<Record, "title" | "slug" | "content" | "draft"> & { tags: string[] };

interface Props {
    initialValues?: RecordFormData;
    onSubmit: (data: RecordFormData) => void;
    onDirtyChange?: (isDirty: boolean) => void;
    mode: "create" | "edit";
}

const RecordForm = ({ initialValues, onSubmit, onDirtyChange, mode }: Props) => {
    const defaultValues: RecordFormData = { title: "", slug: "", content: "", tags: [], draft: true };
    const [formData, setFormData] = useState({ ...defaultValues, ...initialValues });

    const initialRef = useRef({ ...defaultValues, ...initialValues });

    useEffect(() => {
        const isDirty = formData.title !== initialRef.current.title || formData.content !== initialRef.current.content || formData.draft !== initialRef.current.draft;
        onDirtyChange?.(isDirty);

    }, [formData.title, formData.content, formData.draft, onDirtyChange]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;

        setFormData({ ...formData, title: newTitle, slug: normalize(newTitle) });
    };

    const handleContentChange = useCallback((value?: string) => {
        setFormData((prev) => prev.content === value ? prev : { ...prev, content: value ?? "" });
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className={styles.base}>
            <Input label={`제목 (${formData.slug})`} type="text" placeholder="제목" value={formData.title} onChange={handleTitleChange} />
            <CreatableSelect
                classNamePrefix="tag_input"
                placeholder="태그 입력"
                value={formData.tags.map((tag) => ({ label: tag, value: tag }))}
                onChange={(value) => setFormData({ ...formData, tags: value.map((tag) => tag.value) })}
                isMulti
            />
            <Input label="초안 (체크 시 비공개)" type="checkbox" checked={formData.draft} onChange={(e) => setFormData({ ...formData, draft: e.target.checked })} />
            <MarkdownEditor value={formData.content} onChange={handleContentChange} />
            <Button type="submit" onClick={handleSubmit}>{mode === "create" ? "등록하기" : "수정하기"}</Button>
        </div>
    );
};

export default RecordForm;
