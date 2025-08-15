import styles from "@/styles/components/RecordComments.module.scss";
import Input from "./Input";
import Button from "./Button";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { PostgrestError } from "@supabase/supabase-js";
import { fetchComments } from "@/lib/comments";
import { Comment } from "@/types/comment";
import { generateNickname, toDateDistanceString } from "@/utils/strings";
import Skeleton from "./Skeleton";
import PasswordConfirmModal from "./modals/PasswordConfirmModal";

interface Props {
    recordId: number;
}

const RecordComments = ({ recordId }: Props) => {
    const [comments, setComments] = useState<(Pick<Comment, "id" | "record_id" | "author_name" | "content" | "created_at" | "updated_at">)[] | null>();
    const [author, setAuthor] = useState("");
    const [content, setContent] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setLoading] = useState(true);
    const [showPasswordConfirmModal, setPasswordConfirmModal] = useState(false);
    const [commentId, setCommentId] = useState<number>();
    const [isEditing, setEditing] = useState(false);

    const load = async () => {
        setLoading(true);

        try {
            const { data, error } = await fetchComments(recordId);
            console.log(data, error);
            setComments(data);

            const existingNames = comments?.map((c) => c.author_name);
            const nickname = generateNickname(existingNames);

            setAuthor(nickname);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleSubmit = async () => {
        if (!content || !password) return;

        try {
            const supabase = createClient();

            if (isEditing) {
                const { data, error } = await supabase.rpc("update_comment", {
                    p_comment_id: commentId,
                    p_content: content,
                    p_password: password,
                });

                if (!data) {
                    toast.error("비밀번호가 일치하지 않습니다.");
                    return;
                }

                if (error) throw error;

                toast.success("성공적으로 댓글을 수정했습니다.");
            } else {
                const { error } = await supabase.rpc("create_comment", {
                    p_record_id: recordId,
                    p_author_name: author,
                    p_content: content,
                    p_password: password,
                });

                if (error) throw error;

                toast.success("성공적으로 댓글을 등록했습니다.");
            }

            setContent("");
            setPassword("");
            setEditing(false);
            load();
        } catch (e) {
            toast.error((e as PostgrestError).message || `댓글 ${isEditing ? "수정" : "등록"} 중 오류가 발생했습니다.`);
        }
    };

    const handleEditClick = (id: number) => {
        setCommentId(id);
        setPasswordConfirmModal(true);
    };

    const handlePasswordSuccess = (id: number) => {
        const target = comments?.find((comment) => comment.id === id);

        if (target) {
            setAuthor(target.author_name);
            setContent(target.content);
            setCommentId(target.id);
            setEditing(true);
        }
    };

    return (
        <>
            <PasswordConfirmModal showModal={showPasswordConfirmModal} setModal={setPasswordConfirmModal} commentId={commentId} onSuccess={handlePasswordSuccess} />
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
                                            <span className={[styles.metaItem, styles.author].join(" ")}>{comment.author_name}</span>
                                            <span className={styles.metaItem}>{toDateDistanceString(comment.created_at)}</span>
                                            {comment.created_at != comment.updated_at ? <span className={styles.metaItem}>수정됨</span> : null}
                                        </div>
                                        <span className={styles.edit} onClick={() => handleEditClick(comment.id)}>수정</span>
                                    </div>
                                    <p className={styles.content}>{comment.content}</p>
                                </li>
                            ))}
                        </ul> : null
                    ) : <Skeleton style={{ width: "100%", height: "4.5rem" }} />}
                <div className={styles.inputWrapper}>
                    <Input label="이름" type="text" value={author} disabled />
                    <div className={styles.contentWrapper}>
                        <label className={styles.contentLabel}>내용</label>
                        <textarea className={styles.contentInput} value={content} onChange={(e) => setContent(e.target.value)} rows={5} />
                    </div>
                    <Input label="비밀번호" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Button onClick={handleSubmit} disabled={!author || !content || !password}>댓글 {isEditing ? "수정" : "등록"}</Button>
                </div>
            </div>
        </>
    );
};

export default RecordComments;
