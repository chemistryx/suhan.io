import MDEditor, { commands, ICommand, ICommandChildHandle, MDEditorProps } from "@uiw/react-md-editor";
import React, { useRef, useState } from "react";
import styles from "@/styles/components/MarkdownEditor.module.scss";
import { X } from "lucide-react";
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
                <X className={styles.close} size={16} onClick={() => close()} />
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
        <MDEditor className={styles.base} commands={toolbars} {...props} />
    );
};

export default React.memo(MarkdownEditor);
