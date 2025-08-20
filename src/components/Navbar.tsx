"use client"
import { AUTHOR_NAME_EN, AUTHOR_NAME_KO } from "@/constants";
import styles from "@/styles/components/Navbar.module.scss";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
    const pathname = usePathname();

    return (
        <nav className={styles.base}>
            <div className={styles.logoWrapper}>
                <Link className={styles.logo} href="/">
                    <Image src="/profile.png" width={38} height={38} alt="profile" />
                    <div className={styles.textWrapper}>
                        <h2 className={styles.title}>{AUTHOR_NAME_KO}</h2>
                        <p className={styles.description}>{AUTHOR_NAME_EN}</p>
                    </div>
                </Link>
            </div>
            <ul className={styles.items}>
                <li className={[styles.item, pathname.startsWith("/records") ? styles.active : ""].join(" ")}>
                    <Link className={styles.link} href="/records">기록</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
