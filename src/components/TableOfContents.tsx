import { useEffect, useRef, useState } from "react";
import styles from "@/styles/components/TableOfContents.module.scss";
import { ArrowLeftFromLine } from "lucide-react";

export type TOCItem = { id: string; text: string; depth: number };

interface Props {
    contentClassName: string;
}

const TableOfContents = ({ contentClassName }: Props) => {
    const [toc, setToc] = useState<TOCItem[]>([]);
    const [isOpen, setOpen] = useState(false);
    const [activeId, setActiveId] = useState<string>("");
    const [isVisible, setVisible] = useState(false);
    const hideTimeout = useRef<NodeJS.Timeout | null>(null);
    const itemsRef = useRef<HTMLUListElement>(null);

    const startTimer = () => {
        if (hideTimeout.current) clearTimeout(hideTimeout.current);
        hideTimeout.current = setTimeout(() => setVisible(false), 1500);
    };

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

            if (!isOpen) {
                setVisible(true);
                startTimer();
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (hideTimeout.current) clearTimeout(hideTimeout.current);
        }
    }, [toc, isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isOpen && itemsRef.current && !itemsRef.current.contains(event.target as Node)) setOpen(false);
        };

        if (isOpen) {
            setVisible(true);
            if (hideTimeout.current) clearTimeout(hideTimeout.current);
        } else {
            startTimer();
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    if (!toc.length) return;

    return (
        <div className={[styles.base, isVisible ? styles.visible : ""].join(" ")}>
            <button className={[styles.button, isOpen ? styles.hidden : ""].join(" ")} onClick={() => setOpen((prev) => !prev)}>
                <ArrowLeftFromLine size={16} />
            </button>
            <ul ref={itemsRef} className={[styles.items, isOpen ? styles.visible : ""].join(" ")}>
                {toc.map((item) => (
                    <li key={item.id} className={[styles.item, item.id === activeId ? styles.active : ""].join(" ")} style={{ marginLeft: (item.depth - 1) * 12 }}>
                        <a href={`#${item.id}`}>{item.text}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TableOfContents;
