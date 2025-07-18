"use client"
import styles from "@/styles/components/Footer.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import SignInModal from "./modals/SignInModal";
import useUser from "@/hooks/useUser";

const Footer = () => {
    const [showSignInModal, setSignInModal] = useState(false);
    const { user, signOut } = useUser();

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
                <span className={styles.auth} onClick={handleSignInOut}>{user ? "로그아웃" : "로그인"}</span>
            </footer>
        </>
    );
};

export default Footer;
