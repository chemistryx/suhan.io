import { Record } from "@/types/record";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import Button from "./Button";
import Input from "./Input";
import MarkdownEditor from "./MarkdownEditor";
import { normalize } from "@/utils/strings";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { components, ClearIndicatorProps, DropdownIndicatorProps, MultiValueRemoveProps } from "react-select";
import { ChevronDown, Close } from "@carbon/icons-react";
import styles from "@/styles/components/RecordForm.module.scss";
import { createClient } from "@/utils/supabase/client";
import { RECORD_CATEGORIES, RecordCategory, TAGS_TABLE_NAME } from "@/constants";

export type RecordFormData = Pick<Record, "id" | "title" | "description" | "slug" | "content" | "category" | "published"> & {
    tags: string[]
};

interface Props {
    initialValues?: RecordFormData;
    onSubmit: (data: RecordFormData) => void;
    onDirtyChange?: (isDirty: boolean) => void;
    mode: "create" | "edit";
}

type SelectOption = { label: string, value: string };

const DropdownIndicator = <IsMulti extends boolean>(props: DropdownIndicatorProps<SelectOption, IsMulti>) => (
    <components.DropdownIndicator {...props}>
        <ChevronDown size={16} />
    </components.DropdownIndicator>
);

const ClearIndicator = <IsMulti extends boolean>(props: ClearIndicatorProps<SelectOption, IsMulti>) => (
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
const categoryComponents = { DropdownIndicator, ClearIndicator };

const categoryOptions: SelectOption[] = RECORD_CATEGORIES.map((c) => ({ label: c.name, value: c.slug }));

const RecordForm = ({ initialValues, onSubmit, onDirtyChange, mode }: Props) => {
    const defaultValues: RecordFormData = { id: -1, title: "", description: "", slug: "", content: "", tags: [], category: null, published: false };
    const [formData, setFormData] = useState({ ...defaultValues, ...initialValues });
    const initialRef = useRef({ ...defaultValues, ...initialValues });
    const [tagOptions, setTagOptions] = useState<SelectOption[]>([]);
    const tagsInputId = useId();
    const categoryInputId = useId();

    useEffect(() => {
        const loadTags = async () => {
            const supabase = createClient();

            const { data } = await supabase.from(TAGS_TABLE_NAME).select("name");
            if (data) setTagOptions(data.map((d) => ({ label: d.name, value: d.name })));
        };

        loadTags();
    }, []);

    useEffect(() => {
        const isDirty = formData.title !== initialRef.current.title ||
            formData.description !== initialRef.current.description ||
            formData.content !== initialRef.current.content ||
            formData.category !== initialRef.current.category ||
            formData.published !== initialRef.current.published;

        onDirtyChange?.(isDirty);
    }, [formData.title, formData.description, formData.content, formData.category, formData.published, onDirtyChange]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;

        setFormData({ ...formData, title: newTitle, slug: normalize(newTitle) });
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
            <Input label={`제목 (${formData.slug})`} type="text" placeholder="제목" value={formData.title} onChange={handleTitleChange} />
            <Input label="설명" type="text" placeholder="설명" value={formData.description} onChange={handleDescriptionChange} />
            <div className={styles.tagField}>
                <label className={styles.label} htmlFor={tagsInputId}>태그</label>
                <CreatableSelect
                    inputId={tagsInputId}
                    classNamePrefix="tag_input"
                    placeholder="태그 입력"
                    value={formData.tags.map((tag) => ({ label: tag, value: tag }))}
                    onChange={(value) => setFormData({ ...formData, tags: value.map((tag) => tag.value) })}
                    options={tagOptions}
                    components={selectComponents}
                    formatCreateLabel={(inputValue) => `"${inputValue}" 추가`}
                    noOptionsMessage={() => "태그가 없습니다"}
                    isMulti
                />
            </div>
            <div className={styles.tagField}>
                <label className={styles.label} htmlFor={categoryInputId}>카테고리</label>
                <Select<SelectOption, false>
                    inputId={categoryInputId}
                    classNamePrefix="tag_input"
                    placeholder="카테고리 선택"
                    value={categoryOptions.find((option) => option.value === formData.category) ?? null}
                    onChange={(option) => setFormData({ ...formData, category: (option?.value as RecordCategory) ?? null })}
                    options={categoryOptions}
                    components={categoryComponents}
                    noOptionsMessage={() => "카테고리가 없습니다"}
                    isClearable
                />
            </div>
            <div className={styles.publishField}>
                <Input label="발행" type="checkbox" checked={formData.published} onChange={(e) => setFormData({ ...formData, published: e.target.checked })} />
            </div>
            <MarkdownEditor value={formData.content} onChange={handleContentChange} />
            <Button onClick={handleSubmit}>{mode === "create" ? "등록하기" : "수정하기"}</Button>
        </div>
    );
};

export default RecordForm;
