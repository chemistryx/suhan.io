import MDEditor from "@uiw/react-md-editor";

interface Props {
    content?: string;
}

const MarkdownViewer = ({ content }: Props) => {
    return (
        <MDEditor.Markdown source={content} />
    );
};

export default MarkdownViewer;
