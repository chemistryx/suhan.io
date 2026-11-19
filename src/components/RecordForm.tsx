import { useCallback, useEffect, useId, useRef, useState } from "react";
import Button from "./Button";
import Input from "./Input";
import Select from "./Select";
import MarkdownEditor from "./MarkdownEditor";
import { normalize } from "@/utils/strings";
import CreatableSelect from "react-select/creatable";
import { components, ClearIndicatorProps, DropdownIndicatorProps, MultiValueRemoveProps } from "react-select";
import { ChevronDown, Close } from "@carbon/icons-react";
import styles from "@/styles/components/RecordForm.module.scss";
import { CATEGORIES } from "@/constants";
import type { RecordInput } from "@/app/records/actions";

export type RecordFormData = RecordInput;

interface Props {
    initialValues?: RecordFormData;
    // every tag name already in use, offered as suggestions
    tagOptions: string[];
    onSubmit: (data: RecordFormData) => void;
    onDirtyChange?: (isDirty: boolean) => void;
    mode: "create" | "edit";
}

type SelectOption = { label: string, value: string };

const DropdownIndicator = (props: DropdownIndicatorProps<SelectOption, true>) => (
    <components.DropdownIndicator {...props}>
        <ChevronDown size={16} />
    </components.DropdownIndicator>
);

const ClearIndicator = (props: ClearIndicatorProps<SelectOption, true>) => (
    <components.ClearIndicator {...props}>
        <Close size={16} />
    </components.ClearIndicator>
);

const MultiValueRemove = (props: MultiValueRemoveProps<SelectOption, true>) => (
    <components.MultiValueRemove {...props}>
        <Close size={12} />
    </components.MultiValueRemove>
);

const selectComponents = { DropdownIndicator, ClearIndicator, MultiValueRemove };

// Categories are picked, never created here — the list is curated in
// CATEGORIES so the sidebar stays short.
const categoryOptions: SelectOption[] = CATEGORIES.map((c) => ({ label: c.name, value: c.slug }));

const RecordForm = ({ initialValues, tagOptions, onSubmit, onDirtyChange, mode }: Props) => {
    const defaultValues: RecordFormData = { title: "", description: "", content: "", tags: [], category: null, published: false };
    const [formData, setFormData] = useState({ ...defaultValues, ...initialValues });
    const initialRef = useRef({ ...defaultValues, ...initialValues });
    const tagsInputId = useId();
    const slug = normalize(formData.title);

    useEffect(() => {
        const isDirty = formData.title !== initialRef.current.title ||
            formData.description !== initialRef.current.description ||
            formData.content !== initialRef.current.content ||
            formData.category !== initialRef.current.category ||
            formData.tags.join("\n") !== initialRef.current.tags.join("\n") ||
            formData.published !== initialRef.current.published;

        onDirtyChange?.(isDirty);
    }, [formData.title, formData.description, formData.content, formData.category, formData.tags, formData.published, onDirtyChange]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;

        setFormData({ ...formData, title: newTitle });
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, description: e.target.value });
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
            <Input label={`제목 (${slug})`} type="text" placeholder="제목" value={formData.title} onChange={handleTitleChange} />
            <Input label="설명" type="text" placeholder="설명" value={formData.description} onChange={handleDescriptionChange} />
            <div className={styles.tagField}>
                <label className={styles.label} htmlFor={tagsInputId}>태그</label>
                <CreatableSelect
                    inputId={tagsInputId}
                    classNamePrefix="tag_input"
                    placeholder="태그 입력"
                    value={formData.tags.map((tag) => ({ label: tag, value: tag }))}
                    onChange={(value) => setFormData({ ...formData, tags: value.map((tag) => tag.value) })}
                    options={tagOptions.map((name) => ({ label: name, value: name }))}
                    components={selectComponents}
                    formatCreateLabel={(inputValue) => `"${inputValue}" 추가`}
                    noOptionsMessage={() => "태그가 없습니다"}
                    isMulti
                />
            </div>
            <Select
                label="카테고리"
                placeholder="카테고리 선택"
                options={categoryOptions}
                value={formData.category ?? ""}
                onChange={(e) => setFormData({ ...formData, category: e.target.value || null })}
            />
            <div className={styles.publishField}>
                <Input label="발행" type="checkbox" checked={formData.published} onChange={(e) => setFormData({ ...formData, published: e.target.checked })} />
            </div>
            <MarkdownEditor value={formData.content} onChange={handleContentChange} />
            <Button onClick={handleSubmit}>{mode === "create" ? "등록하기" : "수정하기"}</Button>
        </div>
    );
};

export default RecordForm;
