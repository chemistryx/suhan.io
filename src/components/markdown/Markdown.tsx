import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import rehypePrism from "rehype-prism-plus";
import type { ElementContent } from "hast";
import { Link } from "@carbon/icons-react";
import "@uiw/react-markdown-preview/markdown.css";
import LightboxImage from "../LightboxImage";
import CopyButton from "./CopyButton";
import styles from "@/styles/components/Markdown.module.scss";

const textOf = (node?: ElementContent): string =>
    !node ? "" : node.type === "text" ? node.value : "children" in node ? node.children.map(textOf).join("") : "";

interface Props {
    source: string;
    className?: string;
}

// Rendered on the server; only the copy buttons and images ship as client code.
const Markdown = ({ source, className }: Props) => (
    <div className={["wmde-markdown", "wmde-markdown-color", styles.base, className].filter(Boolean).join(" ")}>
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[
                rehypeRaw,
                rehypeSlug,
                [rehypeAutolinkHeadings, { properties: { className: ["anchor"], ariaHidden: "true", tabIndex: -1 } }],
                [rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer", "external"] }],
                [rehypePrism, { ignoreMissing: true }]
            ]}
            components={{
                // Heading anchors get the site's icon set instead of the plugin's default span.
                a: (props) => {
                    const { node, className, children, ...rest } = props;
                    void node;
                    const isAnchor = className?.split(" ").includes("anchor");
                    return (
                        <a className={className} {...rest}>
                            {isAnchor ? <Link className={styles.anchorIcon} size={16} aria-hidden="true" /> : children}
                        </a>
                    );
                },
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
