import { Record } from "@/types/record";
import { useEffect, useState } from "react";
import Button from "./Button";
import Input from "./Input";
import MarkdownEditor from "./MarkdownEditor";
import { normalize } from "@/utils/strings";

export type RecordFormData = Pick<Record, "title" | "slug" | "content" | "draft">;

interface Props {
    initialValues?: RecordFormData;
    onSubmit: (data: RecordFormData) => void;
    onDirtyChange?: (isDirty: boolean) => void;
    mode: "create" | "edit";
}

const RecordForm = ({ initialValues, onSubmit, onDirtyChange, mode }: Props) => {
    const defaultValues: RecordFormData = { title: "", slug: "", content: "", draft: true };
    const [formData, setFormData] = useState({ ...defaultValues, ...initialValues });

    useEffect(() => {
        const isDirty = !!formData.title || !!formData.content;
        onDirtyChange?.(isDirty);

    }, [formData.title, formData.content]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;

        setFormData({ ...formData, title: newTitle, slug: normalize(newTitle) });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <>
            <Input label="제목" type="text" placeholder="제목" value={formData.title} onChange={handleTitleChange} />
            <Input label="Slug" type="text" placeholder="slug" value={formData.slug} readOnly />
            <Input label="Draft" type="checkbox" checked={formData.draft} onChange={(e) => setFormData({ ...formData, draft: e.target.checked })} />
            <MarkdownEditor value={formData.content} onChange={(value) => setFormData({ ...formData, content: value ?? "" })} />
            <Button type="submit" onClick={handleSubmit}>{mode === "create" ? "등록하기" : "수정하기"}</Button>
        </>
    );
};

export default RecordForm;
