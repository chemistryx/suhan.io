import styles from "@/styles/components/RecordComments.module.scss";
import Input from "./Input";
import Button from "./Button";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Comment } from "@/types/comment";
import { generateNickname, toDateDistanceString } from "@/utils/strings";
import Skeleton from "./Skeleton";
import PasswordModal from "./modals/PasswordModal";
import useUser from "@/hooks/useUser";
import { Record } from "@/types/record";
import { siteConfig } from "@/site.config";
import CommentDeleteModal from "./modals/CommentDeleteModal";
import Turnstile from "./Turnstile";

interface Props {
    record: Record;
}

enum ActionType { CREATE, EDIT, DELETE };

type CommentForm = {
    author: string;
    content: string;
    password: string;
};

const LOAD_ERROR = "댓글을 불러오는 중 오류가 발생했습니다.";

const requestComments = async (recordId: number): Promise<Comment[]> => {
    const res = await fetch(`/api/comments?recordId=${recordId}`);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error);

    return data.comments;
};

const RecordComments = ({ record }: Props) => {
    const { user } = useUser();
    const [comments, setComments] = useState<Comment[]>([]);
    const [form, setForm] = useState<CommentForm>({ author: "", content: "", password: "" });
    const [actionType, setActionType] = useState<ActionType>(ActionType.CREATE);
    const [actionPassword, setActionPassword] = useState("");
    const [selectedComment, setSelectedComment] = useState<typeof comments[0]>();
    const [showPasswordModal, setPasswordModal] = useState(false);
    const [showDeleteModal, setDeleteModal] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [nickname, setNickname] = useState("");
    // A token is single-use, so the widget is remounted after each new comment.
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const [turnstileKey, setTurnstileKey] = useState(0);
    const needsTurnstile = !user && actionType === ActionType.CREATE && Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

    // Edits keep the comment's own name; new comments are the author's or a generated nickname.
    const authorName = form.author || (user ? siteConfig.author.name : nickname);
    // Visitors need a password, except when editing with one already verified.
    const isPasswordRequired = !user && !(actionType === ActionType.EDIT && actionPassword);

    const updateForm = (key: keyof CommentForm, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const canSubmit = (() => {
        if (!authorName || !form.content) return false;
        if (isPasswordRequired && !form.password) return false;
        if (needsTurnstile && !turnstileToken) return false;
        return true;
    })();

    const applyComments = useCallback((list: Comment[]) => {
        setComments(list);
        setNickname((prev) => prev || generateNickname(list.map((c) => c.author_name)));
    }, []);

    const loadComments = () =>
        requestComments(record.id).then(applyComments).catch((e) => toast.error((e as Error).message || LOAD_ERROR));

    useEffect(() => {
        let active = true;

        requestComments(record.id)
            .then((list) => { if (active) applyComments(list); })
            .catch((e) => { if (active) toast.error((e as Error).message || LOAD_ERROR); })
            .finally(() => { if (active) setLoading(false); });

        return () => { active = false; };
    }, [record.id, applyComments]);

    const invalidateForm = () => {
        setForm({ author: "", content: "", password: "" });
        setActionPassword("");
        setActionType(ActionType.CREATE);
    };

    const handleSubmit = async () => {
        const isEdit = actionType === ActionType.EDIT;

        try {
            const res = isEdit
                ? await fetch(`/api/comments/${selectedComment?.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content: form.content, password: actionPassword || undefined })
                })
                : await fetch("/api/comments", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ recordId: record.id, authorName, content: form.content, password: user ? undefined : form.password, turnstileToken })
                });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.error);

            toast.success(`성공적으로 댓글을 ${isEdit ? "수정" : "등록"}했습니다.`);

            invalidateForm();
            loadComments();
        } catch (e) {
            toast.error((e as Error).message || `댓글 ${isEdit ? "수정" : "등록"} 중 오류가 발생했습니다.`);
        } finally {
            if (!isEdit) {
                setTurnstileToken(null);
                setTurnstileKey((k) => k + 1);
            }
        }
    };

    const handleActionClick = (type: ActionType, comment: Comment) => {
        setActionPassword("");
        setActionType(type);
        setSelectedComment(comment);

        // The author edits their own comments and deletes any without a password.
        if (user) {
            if (type === ActionType.EDIT) {
                updateForm("author", comment.author_name);
                updateForm("content", comment.content);
            } else {
                setDeleteModal(true);
            }
        } else {
            setPasswordModal(true);
        }
    };

    const handlePasswordSuccess = async (inputPassword: string) => {
        if (!selectedComment) return;
        setActionPassword(inputPassword);

        if (actionType == ActionType.EDIT) {
            updateForm("author", selectedComment.author_name);
            updateForm("content", selectedComment.content);
        } else {
            setDeleteModal(true);
        }
    };

    const handleDeleteSuccess = () => {
        invalidateForm();
        loadComments();
    };

    const canEdit = (comment: Comment) => (user ? comment.is_author : !comment.is_author);
    const canDelete = (comment: Comment) => Boolean(user) || !comment.is_author;

    return (
        <>
            <PasswordModal showModal={showPasswordModal} setModal={setPasswordModal} commentId={selectedComment?.id} onSuccess={handlePasswordSuccess} />
            <CommentDeleteModal showModal={showDeleteModal} setModal={setDeleteModal} commentId={selectedComment?.id} password={actionPassword} onSuccess={handleDeleteSuccess} />
            <div className={styles.base}>
                <div className={styles.heading}>
                    <h3 className={styles.title}>댓글</h3>
                    {isLoading ?
                        <Skeleton style={{ width: "12rem", height: "1.5rem" }} /> :
                        <span className={styles.description}>{comments?.length ?? 0}개의 댓글이 있습니다.</span>
                    }
                </div>
                {!isLoading ?
                    (comments && comments.length ?
                        <ul className={styles.comments}>
                            {comments.map((comment) => (
                                <li key={comment.id} className={styles.comment}>
                                    <div className={styles.header}>
                                        <span className={styles.author}>
                                            {comment.author_name}
                                            {comment.is_author && <span className={styles.writer}>작성자</span>}
                                        </span>
                                        <div className={styles.metaWrapper}>
                                            <span className={styles.metaItem}>{toDateDistanceString(comment.created_at)}</span>
                                            {comment.created_at != comment.updated_at ? <span className={styles.metaItem}>수정됨</span> : null}
                                        </div>
                                        <div className={styles.actions}>
                                            {canEdit(comment) && <span className={styles.action} onClick={() => handleActionClick(ActionType.EDIT, comment)}>수정</span>}
                                            {canDelete(comment) && <span className={styles.action} onClick={() => handleActionClick(ActionType.DELETE, comment)}>삭제</span>}
                                        </div>
                                    </div>
                                    <p className={styles.content}>{comment.content}</p>
                                </li>
                            ))}
                        </ul> : null
                    ) : <Skeleton style={{ width: "100%", height: "4.5rem" }} />}
                <div className={styles.inputWrapper}>
                    <Input label="이름" type="text" value={authorName} disabled />
                    <div className={styles.contentWrapper}>
                        <label className={styles.contentLabel}>내용</label>
                        <textarea className={styles.contentInput} value={form.content} onChange={(e) => updateForm("content", e.target.value)} rows={5} />
                    </div>
                    {isPasswordRequired && (
                        <Input label="비밀번호" type="password" value={form.password} onChange={(e) => updateForm("password", e.target.value)} />
                    )}
                    {needsTurnstile && <Turnstile key={turnstileKey} onToken={setTurnstileToken} />}
                    <Button onClick={handleSubmit} disabled={!canSubmit}>댓글 {actionType === ActionType.EDIT ? "수정" : "등록"}</Button>
                </div>
            </div>
        </>
    );
};

export default RecordComments;
