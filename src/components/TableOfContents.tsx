import { useEffect, useState } from "react";
import styles from "@/styles/components/TableOfContents.module.scss";
import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react";

export type TOCItem = { id: string; text: string; depth: number };

interface Props {
    contentClassName: string;
}

const TableOfContents = ({ contentClassName }: Props) => {
    const [toc, setToc] = useState<TOCItem[]>([]);
    const [isOpen, setOpen] = useState(false);
    const [activeId, setActiveId] = useState<string>("");
    const [isVisible, /*setVisible*/] = useState(true);

    useEffect(() => {
        const content = document.getElementsByClassName(contentClassName)[0];
        if (!content) return;

        const headings = Array.from(content.querySelectorAll("h1, h2, h3, h4, h5, h6"))
            .filter((node) => node.parentElement === content).map((node) => ({
                id: node.id,
                text: node.textContent || "",
                depth: Number(node.tagName[1])
            }));;

        const minDepth = Math.min(...headings.map((h) => h.depth));

        const items = headings.map((h) => ({
            ...h,
            depth: h.depth - minDepth + 1
        }));

        setToc(items);
    }, [contentClassName]);

    useEffect(() => {
        const handleScroll = () => {
            const headings = toc.map((item) => document.getElementById(item.id));

            if (!headings.length) return;

            const scrollY = window.scrollY;
            let currentId = headings[0]?.id || "";

            for (let i = 0; i < headings.length; i++) {
                const el = headings[i];
                if (el && el.offsetTop <= scrollY) currentId = el.id;
                else break;
            }

            setActiveId(currentId);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => window.removeEventListener("scroll", handleScroll);
    }, [toc, isOpen]);

    if (!toc.length) return;

    return (
        <div className={[styles.base, isVisible ? styles.visible : ""].join(" ")}>
            <button className={styles.button} onClick={() => setOpen((prev) => !prev)}>
                {isOpen ? <ArrowRightFromLine /> : <ArrowLeftFromLine />}
            </button>
            {isOpen &&
                <ul className={styles.items}>
                    {toc.map((item) => (
                        <li key={item.id} className={[styles.item, item.id === activeId ? styles.active : ""].join(" ")} style={{ marginLeft: (item.depth - 1) * 12 }}>
                            <a href={`#${item.id}`}>{item.text}</a>
                        </li>
                    ))}
                </ul>
            }
        </div>
    );
};

export default TableOfContents;
