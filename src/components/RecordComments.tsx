import styles from "@/styles/components/RecordComments.module.scss";
import Input from "./Input";
import Button from "./Button";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { PostgrestError } from "@supabase/supabase-js";
import { fetchComments } from "@/lib/comments";
import { Comment } from "@/types/comment";
import { generateNickname, toDateDistanceString } from "@/utils/strings";
import Skeleton from "./Skeleton";
import PasswordModal from "./modals/PasswordModal";
import useUser from "@/hooks/useUser";
import { Record } from "@/types/record";
import { AUTHOR_NAME_KO } from "@/constants";
import CommentDeleteModal from "./modals/CommentDeleteModal";

interface Props {
    record: Record;
}

enum ActionType { CREATE, EDIT, DELETE };

type CommentForm = {
    author: string;
    content: string;
    password: string;
};

const RecordComments = ({ record }: Props) => {
    const supabase = createClient();
    const { user } = useUser();
    const [comments, setComments] = useState<Comment[]>([]);
    const [form, setForm] = useState<CommentForm>({ author: "", content: "", password: "" });
    const [actionType, setActionType] = useState<ActionType>(ActionType.CREATE);
    const [actionPassword, setActionPassword] = useState("");
    const [selectedComment, setSelectedComment] = useState<typeof comments[0]>();
    const [showPasswordModal, setPasswordModal] = useState(false);
    const [showDeleteModal, setDeleteModal] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [isPasswordRequired, setPasswordRequired] = useState(true);

    const updateForm = (key: keyof CommentForm, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const canSubmit = (() => {
        if (!form.author || !form.content) return false;
        if (isPasswordRequired && !form.password) return false;
        return true;
    })();

    const loadComments = useCallback(async () => {
        setLoading(true);

        try {
            const { data, error } = await fetchComments(record.id);
            if (error) throw error;

            setComments(data);
        } catch (e) {
            toast.error((e as PostgrestError).message || `댓글을 불러오는 중 오류가 발생했습니다.`);
        } finally {
            setLoading(false);
        }

    }, [record.id]);

    useEffect(() => {
        loadComments();
    }, [loadComments]);

    useEffect(() => {
        if (user) {
            updateForm("author", AUTHOR_NAME_KO);
            setPasswordRequired(false); // do not require password by default if user available (create mode) 
        } else {
            const existingNames = comments.map((c) => c.author_name);
            updateForm("author", generateNickname(existingNames));
            setPasswordRequired(true);
        }
    }, [user, comments]);

    const invalidateForm = () => {
        setForm({ author: "", content: "", password: "" });
        setActionPassword("");
        setActionType(ActionType.CREATE);
    };

    const handleSubmit = async () => {
        try {
            const rpcName = actionType === ActionType.EDIT ? "update_comment" : "create_comment";
            const rpcArgs = actionType === ActionType.EDIT
                ? { p_comment_id: selectedComment?.id, p_content: form.content, p_password: isPasswordRequired ? form.password : null }
                : { p_record_id: record.id, p_author_name: form.author, p_content: form.content, p_password: isPasswordRequired ? form.password : null };

            const { data, error } = await supabase.rpc(rpcName, rpcArgs);

            if (!data && actionType === ActionType.EDIT) {
                toast.error("비밀번호가 일치하지 않습니다.");
                return;
            }

            if (error) throw error;

            toast.success(`성공적으로 댓글을 ${actionType === ActionType.EDIT ? "수정" : "등록"}했습니다.`);

            invalidateForm();
            loadComments();
        } catch (e) {
            toast.error((e as PostgrestError).message || `댓글 ${actionType === ActionType.EDIT ? "수정" : "등록"} 중 오류가 발생했습니다.`);
        }
    };

    const handleActionClick = (type: ActionType, comment: Comment) => {
        setActionPassword("");
        setActionType(type);
        setSelectedComment(comment);

        if (user && comment.author_id === user.id) {
            if (type === ActionType.EDIT) {
                updateForm("author", comment.author_name);
                updateForm("content", comment.content);
                setPasswordRequired(false);
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
            setPasswordRequired(true);
        } else {
            setDeleteModal(true);
        }
    };

    const handleDeleteSuccess = () => {
        invalidateForm();
        loadComments();
    };

    const isActionVisible = (comment: Comment) => {
        if (!comment.author_id) return true;
        if (user && comment.author_id === user.id) return true;

        return false;
    };

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
                                        <div className={styles.metaWrapper}>
                                            <span className={[styles.metaItem, styles.author].join(" ")}>
                                                {comment.author_name}
                                                {comment.author_id === record.author_id && <span className={styles.writer}>작성자</span>}
                                            </span>
                                            <span className={styles.metaItem}>{toDateDistanceString(comment.created_at)}</span>
                                            {comment.created_at != comment.updated_at ? <span className={styles.metaItem}>수정됨</span> : null}
                                        </div>
                                        <div className={styles.actions}>
                                            {isActionVisible(comment) && (
                                                <>
                                                    <span className={styles.action} onClick={() => handleActionClick(ActionType.EDIT, comment)}>수정</span>
                                                    <span className={styles.action} onClick={() => handleActionClick(ActionType.DELETE, comment)}>삭제</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <p className={styles.content}>{comment.content}</p>
                                </li>
                            ))}
                        </ul> : null
                    ) : <Skeleton style={{ width: "100%", height: "4.5rem" }} />}
                <div className={styles.inputWrapper}>
                    <Input label="이름" type="text" value={form.author} disabled />
                    <div className={styles.contentWrapper}>
                        <label className={styles.contentLabel}>내용</label>
                        <textarea className={styles.contentInput} value={form.content} onChange={(e) => updateForm("content", e.target.value)} rows={5} />
                    </div>
                    {isPasswordRequired && (
                        <Input label="비밀번호" type="password" value={form.password} onChange={(e) => updateForm("password", e.target.value)} />
                    )}
                    <Button onClick={handleSubmit} disabled={!canSubmit}>댓글 {actionType === ActionType.EDIT ? "수정" : "등록"}</Button>
                </div>
            </div>
        </>
    );
};

export default RecordComments;
