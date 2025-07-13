"use client"
import styles from "@/styles/components/Footer.module.scss";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className={styles.base}>
            <ul className={styles.items}>
                <li className={styles.item}>
                    <Link className={styles.link} href="https://github.com/chemistryx" target="_blank">
                        <Image src="/icons/github.svg" width={20} height={20} alt="github" />
                    </Link>
                </li>
                <li className={styles.item}>
                    <Link className={styles.link} href="mailto:starpiung@naver.com">
                        <Image src="/icons/mail.svg" width={20} height={20} alt="mail" />
                    </Link>
                </li>
            </ul>
            <p className={styles.copy}>© 2025 Suhan Ha. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
