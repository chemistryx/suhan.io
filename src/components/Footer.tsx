"use client"
import styles from "@/styles/components/Footer.module.scss";
import Link from "next/link";
import { useState } from "react";
import SignInModal from "./modals/SignInModal";
import useUser from "@/hooks/useUser";
import { AUTHOR_NAME_EN } from "@/constants";
import { getYear } from "date-fns";
import { Email, LogoGithub } from "@carbon/icons-react";

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
                            <LogoGithub size={20} />
                        </Link>
                    </li>
                    <li className={styles.item}>
                        <Link className={styles.link} href="mailto:starpiung@naver.com" aria-label="email">
                            <Email size={20} />
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
