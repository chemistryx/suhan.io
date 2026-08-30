"use client"
import { CATEGORIES_TABLE_NAME, RECORDS_TABLE_NAME } from "@/constants";
import styles from "@/styles/components/Navbar.module.scss";
import { Category } from "@/types/category";
import useUser from "@/hooks/useUser";
import { createClient } from "@/utils/supabase/client";
import { toStoredSlug } from "@/utils/strings";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Item = Pick<Category, "slug" | "name"> & { count: number };

type Data = {
    items: Item[];
    // stored record slug -> the category slug it belongs to
    categoryOf: Map<string, string>;
};

/**
 * Loaded here rather than handed down from the layout: reading this on the
 * server needs the request's cookies, which would opt every route — including
 * the otherwise static / and /works — into dynamic rendering.
 *
 * The select policy on records is "published = true OR author_id = auth.uid()",
 * so drafts are counted for their author and for nobody else.
 *
 * Refetched whenever the path changes. This component lives in the root layout
 * and so survives every navigation inside /records, including the one back from
 * the editor — without this the counts would keep whatever they read on first
 * mount until a hard reload. Filtering is left out of the trigger on purpose:
 * ?category= changes what the list shows, never the counts.
 */
const useCategories = () => {
    const [data, setData] = useState<Data | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        let active = true;

        const loadCategories = async () => {
            const supabase = createClient();

            const [{ data: categories }, { data: records }] = await Promise.all([
                supabase.from(CATEGORIES_TABLE_NAME).select("id, name, slug").order("created_at"),
                supabase.from(RECORDS_TABLE_NAME).select("slug, category_id")
            ]);

            if (!active || !categories || !records) return;

            const slugOfId = new Map(categories.map((c) => [c.id as number, c.slug as string]));
            const counts = new Map<number, number>();
            const categoryOf = new Map<string, string>();

            for (const { slug, category_id } of records) {
                if (!category_id) continue;

                counts.set(category_id, (counts.get(category_id) ?? 0) + 1);

                const categorySlug = slugOfId.get(category_id);
                if (categorySlug) categoryOf.set(toStoredSlug(slug), categorySlug);
            }

            setData({
                items: [
                    // "전체" carries no slug, so a bare /records is what clears the filter.
                    { slug: "", name: "전체", count: records.length },
                    ...categories.map((c) => ({ slug: c.slug, name: c.name, count: counts.get(c.id) ?? 0 }))
                ],
                categoryOf
            });
        };

        loadCategories();

        return () => { active = false; };
    }, [pathname]);

    return data;
};

// "/records/<slug>" and "/records/<slug>/edit" — anything else (the list, /new)
// has no record to speak for.
const recordSlugOf = (pathname: string) => {
    const [, section, slug] = pathname.split("/");

    return section === "records" && slug && slug !== "new" ? toStoredSlug(slug) : undefined;
};

const CategoryNav = () => {
    const filter = useSearchParams().get("category");
    const pathname = usePathname();
    const data = useCategories();
    const { user } = useUser();

    if (!data) return null;

    const { items, categoryOf } = data;

    // On a record, fall back to the category that record belongs to. Reading one
    // from a filtered list would otherwise clear the rail, and this also lights
    // it up for a record reached from 전체 or from a link someone shared.
    const recordSlug = recordSlugOf(pathname);
    const selected = filter ?? (recordSlug ? categoryOf.get(recordSlug) ?? "" : "");

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
