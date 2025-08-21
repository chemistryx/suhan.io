"use client"
import styles from "@/styles/components/Footer.module.scss";
import Link from "next/link";
import { useState } from "react";
import SignInModal from "./modals/SignInModal";
import useUser from "@/hooks/useUser";
import { AUTHOR_NAME_EN } from "@/constants";
import { getYear } from "date-fns";

const Footer = () => {
    const [showSignInModal, setSignInModal] = useState(false);
    const { user, signOut } = useUser();
    const year = getYear(Date.now());

    const handleSignInOut = async () => {
        if (user) await signOut();
        else setSignInModal(true);
    };

    return (
        <>
            <SignInModal showModal={showSignInModal} setModal={setSignInModal} />
            <footer className={styles.base}>
                <ul className={styles.items}>
                    <li className={styles.item}>
                        <Link className={styles.link} href="https://github.com/chemistryx" aria-label="github" target="_blank">
                            <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github-icon lucide-github">
                                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                                <path d="M9 18c-4.51 2-5-2-7-2" />
                            </svg>
                        </Link>
                    </li>
                    <li className={styles.item}>
                        <Link className={styles.link} href="mailto:starpiung@naver.com" aria-label="email">
                            <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail-icon lucide-mail">
                                <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                                <rect x="2" y="4" width="20" height="16" rx="2" />
                            </svg>
                        </Link>
                    </li>
                </ul>
                <p className={styles.copy}>© {year} {AUTHOR_NAME_EN}. All rights reserved.</p>
                <span className={styles.auth} onClick={handleSignInOut}>{user ? "로그아웃" : "로그인"}</span>
            </footer>
        </>
    );
};

export default Footer;
