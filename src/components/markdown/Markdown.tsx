import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import rehypePrism from "rehype-prism-plus";
import type { Element, ElementContent } from "hast";
import "@uiw/react-markdown-preview/markdown.css";
import LightboxImage from "../LightboxImage";
import CopyButton from "./CopyButton";

const anchorIcon: Element = {
    type: "element",
    tagName: "svg",
    properties: { className: ["octicon", "octicon-link"], viewBox: "0 0 16 16", width: 16, height: 16, ariaHidden: "true" },
    children: [{
        type: "element",
        tagName: "path",
        properties: { fillRule: "evenodd", d: "M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z" },
        children: []
    }]
};

const textOf = (node?: ElementContent): string =>
    !node ? "" : node.type === "text" ? node.value : "children" in node ? node.children.map(textOf).join("") : "";

interface Props {
    source: string;
    className?: string;
}

// Rendered on the server; only the copy buttons and images ship as client code.
const Markdown = ({ source, className }: Props) => (
    <div className={["wmde-markdown", "wmde-markdown-color", className].filter(Boolean).join(" ")}>
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[
                rehypeRaw,
                rehypeSlug,
                [rehypeAutolinkHeadings, { properties: { className: ["anchor"], ariaHidden: "true", tabIndex: -1 }, content: anchorIcon }],
                [rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer", "external"] }],
                [rehypePrism, { ignoreMissing: true }]
            ]}
            components={{
                img: (props) => {
                    const { node, ...rest } = props;
                    void node;
                    return <LightboxImage {...rest} />;
                },
                pre: (props) => {
                    const { node, children, ...rest } = props;
                    return (
                        <pre {...rest}>
                            {children}
                            <CopyButton code={textOf(node)} />
                        </pre>
                    );
                }
            }}
        >
            {source}
        </ReactMarkdown>
    </div>
);

export default Markdown;
