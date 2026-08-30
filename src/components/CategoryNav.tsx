"use client"
import { CATEGORIES_TABLE_NAME, RECORDS_TABLE_NAME } from "@/constants";
import styles from "@/styles/components/Navbar.module.scss";
import { Category } from "@/types/category";
import useUser from "@/hooks/useUser";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Item = Pick<Category, "slug" | "name"> & { count: number };

/**
 * Loaded here rather than handed down from the layout: reading this on the
 * server needs the request's cookies, which would opt every route — including
 * the otherwise static / and /works — into dynamic rendering.
 *
 * The select policy on records is "published = true OR author_id = auth.uid()",
 * so drafts are counted for their author and for nobody else.
 */
const useCategories = () => {
    const [items, setItems] = useState<Item[] | null>(null);

    useEffect(() => {
        let active = true;

        const loadCategories = async () => {
            const supabase = createClient();

            const [{ data: categories }, { data: records }] = await Promise.all([
                supabase.from(CATEGORIES_TABLE_NAME).select("id, name, slug").order("created_at"),
                supabase.from(RECORDS_TABLE_NAME).select("category_id")
            ]);

            if (!active || !categories || !records) return;

            const counts = new Map<number, number>();
            for (const { category_id } of records) {
                if (category_id) counts.set(category_id, (counts.get(category_id) ?? 0) + 1);
            }

            setItems([
                // "전체" carries no slug, so a bare /records is what clears the filter.
                { slug: "", name: "전체", count: records.length },
                ...categories.map((c) => ({ slug: c.slug, name: c.name, count: counts.get(c.id) ?? 0 }))
            ]);
        };

        loadCategories();

        return () => { active = false; };
    }, []);

    return items;
};

const CategoryNav = () => {
    const selected = useSearchParams().get("category") ?? "";
    const items = useCategories();
    const { user } = useUser();

    if (!items) return null;

    // An empty category is a note to the author about what they have not
    // written yet; to a visitor it is a dead end. "전체" always stays.
    const visible = items.filter((item) => user || !item.slug || item.count > 0);

    return (
        <ul className={styles.categories}>
            {visible.map((item) => (
                <li
                    key={item.slug || "all"}
                    className={[
                        styles.category,
                        selected === item.slug ? styles.active : "",
                        item.count === 0 ? styles.empty : ""
                    ].join(" ")}
                >
                    <Link className={styles.link} href={item.slug ? `/records?category=${item.slug}` : "/records"}>
                        <span className={styles.name}>{item.name}</span>
                        <span className={styles.count}>{item.count}</span>
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default CategoryNav;
