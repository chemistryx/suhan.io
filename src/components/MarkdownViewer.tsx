import MDEditor from "@uiw/react-md-editor";
import styles from "@/styles/components/MarkdownViewer.module.scss";

interface Props {
    content?: string;
}

const MarkdownViewer = ({ content }: Props) => {
    return (
        <MDEditor.Markdown className={styles.base} source={content} />
    );
};

export default MarkdownViewer;
