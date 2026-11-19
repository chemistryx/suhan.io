"use client"
import { siteConfig } from "@/site.config";
import styles from "@/styles/components/Navbar.module.scss";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import CategoryNav from "./CategoryNav";

const Navbar = () => {
    const pathname = usePathname();
    const isRecords = pathname.startsWith("/records");

    return (
        <nav className={styles.base}>
            <div className={styles.logoWrapper}>
                <Link className={styles.logo} href="/">
                    <Image src={siteConfig.profileImage} width={38} height={38} alt="profile" />
                    <div className={styles.textWrapper}>
                        <h2 className={styles.title}>{siteConfig.author.name}</h2>
                        <p className={styles.description}>{siteConfig.author.alternateName}</p>
                    </div>
                </Link>
            </div>
            <ul className={styles.items}>
                <li className={[styles.item, isRecords ? styles.active : ""].join(" ")}>
                    <Link className={styles.link} href="/records">기록</Link>
                </li>
                {/* Reading the filter needs the search params, which would opt every
                    route into client rendering if it happened above a boundary. */}
                {isRecords &&
                    <Suspense>
                        <CategoryNav />
                    </Suspense>
                }
                <li className={[styles.item, pathname.startsWith("/works") ? styles.active : ""].join(" ")}>
                    <Link className={styles.link} href="/works">작업물</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
