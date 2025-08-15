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

interface Props {
    recordId: number;
}

const RecordComments = ({ recordId }: Props) => {
    const [comments, setComments] = useState<(Pick<Comment, "id" | "record_id" | "author_name" | "content" | "created_at">)[] | null>();
    const [author, setAuthor] = useState("");
    const [content, setContent] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);

        try {
            const { data, error } = await fetchComments(recordId);
            console.log(data, error);
            setComments(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const existingNames = comments?.map((c) => c.author_name);
        const nickname = generateNickname(existingNames);

        setAuthor(nickname);
        load();
    }, [recordId]);

    const handleSubmit = async () => {
        if (!content || !password) return;

        try {
            const supabase = createClient();

            const { error } = await supabase.rpc("create_comment", {
                p_record_id: recordId,
                p_author_name: author,
                p_content: content,
                p_password: password,
            });

            if (error) throw error;

            toast.success("성공적으로 댓글을 등록했습니다.");

            setContent("");
            setPassword("");
            load();
        } catch (e) {
            toast.error((e as PostgrestError).message || "댓글 등록 중 오류가 발생했습니다.");
        }
    };

    return (
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
                                <div className={styles.metaWrapper}>
                                    <span className={styles.author}>{comment.author_name}</span>
                                    <span className={styles.time}>{toDateDistanceString(comment.created_at)}</span>
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
                    <textarea className={styles.contentInput} value={content} onChange={(e) => setContent(e.target.value)} rows={3} />
                </div>
                <Input label="비밀번호" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button onClick={handleSubmit}>댓글 등록</Button>
            </div>
        </div>
    );
};

export default RecordComments;
