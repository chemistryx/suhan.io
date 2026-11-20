"use client"
import Button from "@/components/Button";
import { Heading, HeadingDescription, HeadingTitle } from "@/components/Heading";
import { useRouter } from "next/navigation";
import styles from "@/styles/pages/NotFoundPage.module.scss";
import { useEffect } from "react";
import { track } from "@/lib/analytics";

export default function NotFoundPage() {
    const router = useRouter();

    // Old or mistyped URLs; the referrer shows where the broken link lives.
    useEffect(() => {
        track("404", { path: window.location.pathname, referrer: document.referrer || "direct" });
    }, []);

    return (
        <div className={styles.base}>
            <Heading>
                <HeadingTitle>Not Found</HeadingTitle>
                <HeadingDescription>요청하신 페이지를 찾을 수 없습니다.</HeadingDescription>
            </Heading>
            <Button onClick={() => router.back()}>돌아가기</Button>
        </div>
    );
}
