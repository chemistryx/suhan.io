"use client"
import styles from "@/styles/components/Navbar.module.scss";
import { Category } from "@/types/category";
import useUser from "@/hooks/useUser";
import { toSlug } from "@/utils/strings";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Item = Category & { count: number };

type Data = {
    items: Item[];
    // record slug -> the category slug it belongs to
    categoryOf: Record<string, string>;
};

// Refetched on path change so counts update after an edit.
const useCategories = () => {
    const [data, setData] = useState<Data | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        let active = true;

        const loadCategories = async () => {
            const res = await fetch("/api/categories");
            if (!active || !res.ok) return;

            const { total, categories, categoryOf } = await res.json();
            if (!active) return;

            setData({
                items: [
                    // "전체" carries no slug, so a bare /records is what clears the filter.
                    { slug: "", name: "전체", count: total },
                    ...categories
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

    return section === "records" && slug && slug !== "new" ? toSlug(slug) : undefined;
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
    const selected = filter ?? (recordSlug ? categoryOf[recordSlug] ?? "" : "");

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
                    <Link className={styles.link} href={item.slug ? `/records?category=${item.slug}` : "/records"} data-umami-event="category-filter" data-umami-event-category={item.slug || "all"}>
                        <span className={styles.name}>{item.name}</span>
                        <span className={styles.count}>{item.count}</span>
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default CategoryNav;
