import MDEditor, { commands, ICommand, ICommandChildHandle, MDEditorProps } from "@uiw/react-md-editor";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/components/MarkdownEditor.module.scss";
import { Close } from "@carbon/icons-react";
import Button, { ButtonSize } from "./Button";
import Input from "./Input";
import { createClient } from "@/utils/supabase/client";
import { IMAGES_BUCKET_NAME } from "@/constants";
import { toast } from "sonner";
import { normalize } from "@/utils/strings";

type CommandChildHandleProps = Parameters<NonNullable<ICommandChildHandle["children"]>>[0];

const ImageUploadComponent = ({ close, textApi }: CommandChildHandleProps) => {
    const [mode, setMode] = useState<"url" | "upload">("url");
    const [url, setUrl] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInsertImage = async () => {
        const file = fileInputRef.current?.files?.[0];
        let imageUrl = url;
        let altText = "";

        if (mode === "upload" && file) {
            // upload to supabase bucket
            // TODO: fix korean letters not being supported
            const path = `uploads/${Date.now()}-${normalize(file.name)}`;

            const supabase = createClient();
            const { data: uploadData, error } = await supabase.storage
                .from(IMAGES_BUCKET_NAME)
                .upload(path, file);

            if (error) {
                toast.error(error.message);
                return;
            }

            const { data: publicUrlData } = supabase.storage
                .from(IMAGES_BUCKET_NAME)
                .getPublicUrl(uploadData.path);

            imageUrl = publicUrlData.publicUrl;
            altText = file.name;
        } else if (mode === "url" && url) {
            altText = decodeURIComponent(new URL(url).pathname.split("/").pop() || "");
        }

        if (imageUrl) {
            if (textApi) textApi.replaceSelection(`![${altText}](${imageUrl})`);
            close();
        }
    };

    return (
        <div className={styles.imageUploadWrapper}>
            <div className={styles.heading}>
                <h4>이미지 삽입</h4>
                <Close className={styles.close} size={16} onClick={() => close()} />
            </div>
            <div className={styles.tabs}>
                <button className={[styles.tab, mode === "url" ? styles.active : ""].join(" ")} onClick={() => setMode("url")}>URL</button>
                <button className={[styles.tab, mode === "upload" ? styles.active : ""].join(" ")} onClick={() => setMode("upload")}>이미지 업로드</button>
            </div>
            <div className={styles.content}>
                {mode === "url" ? (
                    <Input type="text" placeholder="이미지 URL 입력" value={url} onChange={(e) => setUrl(e.target.value)} />
                ) : (
                    <input type="file" accept="image/*" ref={fileInputRef} />
                )}
            </div>
            <Button size={ButtonSize.small} onClick={handleInsertImage}>삽입</Button>
        </div>
    );
};

const MarkdownEditor = ({ ...props }: MDEditorProps) => {
    const wrapperRef = useRef<HTMLDivElement>(null);

    // HACK: @uiw/react-md-editor는 Enter로 목록을 이어쓸지 `/^\d+.\s/`로 판정하는데,
    // `.`이 이스케이프되지 않아 "1년 전에"처럼 숫자 뒤에 아무 글자나 와도 목록으로 본다.
    // 진짜 순서 목록이 아닐 때만 캡처 단계에서 라이브러리 keydown 핸들러를 막는다.
    // Related PR: https://github.com/uiwjs/react-md-editor/pull/711
    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        const suppressFalseOrderedList = (e: KeyboardEvent) => {
            if (e.key !== "Enter" || e.shiftKey) return;

            const target = e.target as HTMLElement | null;
            if (!(target instanceof HTMLTextAreaElement)) return;

            const currentLine = target.value.slice(0, target.selectionStart).split("\n").pop() ?? "";
            if (/^\d+.\s/.test(currentLine) && !/^\d+\.\s/.test(currentLine)) {
                e.stopPropagation();
            }
        };

        wrapper.addEventListener("keydown", suppressFalseOrderedList, true);
        return () => wrapper.removeEventListener("keydown", suppressFalseOrderedList, true);
    }, []);

    const imageUploadCommand: ICommand = {
        name: "image-upload",
        groupName: "image-upload",
        buttonProps: { title: "Upload Image", "aria-label": "Upload Image" },
        icon: (
            <svg viewBox="0 0 20 20" width={13} height={13}>
                <path fill="currentColor" d="M15 9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4-7H1c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 13l-6-5-2 2-4-5-4 8V4h16v11z" />
            </svg>
        ),
        children: (props) => <ImageUploadComponent {...props} />,
    };

    const toolbars = [
        commands.bold,
        commands.italic,
        commands.strikethrough,
        commands.hr,
        commands.title,
        commands.divider,
        commands.link,
        commands.quote,
        commands.code,
        commands.codeBlock,
        commands.comment,
        commands.group([], imageUploadCommand),
        commands.table,
        commands.divider,
        commands.unorderedListCommand,
        commands.orderedListCommand,
        commands.checkedListCommand,
        commands.divider,
        commands.help
    ];

    return (
        <div ref={wrapperRef} style={{ display: "contents" }}>
            <MDEditor className={styles.base} height={400} commands={toolbars} {...props} />
        </div>
    );
};

export default React.memo(MarkdownEditor);
