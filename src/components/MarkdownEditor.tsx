import MDEditor, { MDEditorProps } from "@uiw/react-md-editor";

const MarkdownEditor = ({ ...props }: MDEditorProps) => {
    return (
        <MDEditor {...props} />
    );
};

export default MarkdownEditor;
