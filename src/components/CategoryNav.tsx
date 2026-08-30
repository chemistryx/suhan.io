"use client"
import { RECORD_CATEGORIES, RECORDS_TABLE_NAME } from "@/constants";
import styles from "@/styles/components/Navbar.module.scss";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// "전체" carries no slug, so a bare /records is what clears the filter.
type Item = { slug: string | null, name: string };

const items: Item[] = [{ slug: null, name: "전체" }, ...RECORD_CATEGORIES];

/**
 * Counts are loaded here rather than handed down from the layout: reading them
 * on the server needs the request's cookies, which would opt every route —
 * including the otherwise static / and /works — into dynamic rendering. The
 * names paint immediately and only the numbers arrive late.
 *
 * The select policy on records is "published = true OR author_id = auth.uid()",
 * so drafts are counted for their author and for nobody else.
 */
const useCategoryCounts = () => {
    const [counts, setCounts] = useState<Map<string | null, number> | null>(null);

    useEffect(() => {
        let active = true;

        const loadCounts = async () => {
            const supabase = createClient();
            const { data } = await supabase.from(RECORDS_TABLE_NAME).select("category");
            if (!active || !data) return;

            const next = new Map<string | null, number>([[null, data.length]]);
            for (const { category } of data) {
                if (category) next.set(category, (next.get(category) ?? 0) + 1);
            }

            setCounts(next);
        };

        loadCounts();

        return () => { active = false; };
    }, []);

    return counts;
};

const CategoryNav = () => {
    const selected = useSearchParams().get("category");
    const counts = useCategoryCounts();

    return (
        <ul className={styles.categories}>
            {items.map((item) => {
                const count = counts?.get(item.slug);

                return (
                    <li
                        key={item.slug ?? "all"}
                        className={[
                            styles.category,
                            selected === item.slug ? styles.active : "",
                            count === 0 ? styles.empty : ""
                        ].join(" ")}
                    >
                        <Link className={styles.link} href={item.slug ? `/records?category=${item.slug}` : "/records"}>
                            <span className={styles.name}>{item.name}</span>
                            <span className={styles.count}>{count ?? ""}</span>
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
};

export default CategoryNav;
