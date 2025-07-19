import MDEditor, { MDEditorProps } from "@uiw/react-md-editor";
import React from "react";

const MarkdownEditor = ({ ...props }: MDEditorProps) => {
    return (
        <MDEditor {...props} />
    );
};

export default React.memo(MarkdownEditor);
