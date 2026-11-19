"use client"
import styles from "@/styles/components/Footer.module.scss";
import Link from "next/link";
import useUser from "@/hooks/useUser";
import { siteConfig } from "@/site.config";
import { getYear } from "date-fns";
import { Email, LogoGithub } from "@carbon/icons-react";
import { useEffect } from "react";
import { toast } from "sonner";

const Footer = () => {
    const { user, signIn, signOut } = useUser();
    const year = getYear(Date.now());
    const { github, email } = siteConfig.links;

    // The auth routes redirect back with ?auth=success|failed; show it once and drop the param.
    useEffect(() => {
        const url = new URL(window.location.href);
        const result = url.searchParams.get("auth");
        if (result === "success") toast.success("성공적으로 로그인했습니다.");
        else if (result === "failed") toast.error("로그인에 실패했습니다.");
        else return;

        url.searchParams.delete("auth");
        window.history.replaceState(null, "", url);
    }, []);

    const handleSignInOut = async () => {
        if (user) await signOut();
        else signIn();
    };

    return (
        <footer className={styles.base}>
            <ul className={styles.items}>
                {github &&
                    <li className={styles.item}>
                        <Link className={styles.link} href={github} aria-label="github" target="_blank">
                            <LogoGithub size={20} />
                        </Link>
                    </li>
                }
                {email &&
                    <li className={styles.item}>
                        <Link className={styles.link} href={`mailto:${email}`} aria-label="email">
                            <Email size={20} />
                        </Link>
                    </li>
                }
            </ul>
            <p className={styles.copy}>© {year} {siteConfig.author.alternateName}. All rights reserved.</p>
            <span className={styles.auth} onClick={handleSignInOut}>{user ? "로그아웃" : "로그인"}</span>
        </footer>
    );
};

export default Footer;
