"use client"
import { ImgHTMLAttributes, useEffect, useState } from "react";
import styles from "@/styles/components/LightboxImage.module.scss";
import { Portal } from "@radix-ui/react-portal";

const LightboxImage = ({ src, alt }: ImgHTMLAttributes<HTMLImageElement>) => {
    const [state, setState] = useState<"closed" | "open">("closed");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (mounted) {
            document.body.style.overflow = "hidden";
            document.body.style.marginRight = "15px";
        } else {
            document.body.style.overflow = "";
            document.body.style.marginRight = "";
        }

        return () => {
            document.body.style.overflow = "";
            document.body.style.marginRight = "";
        }
    }, [mounted]);

    return (
        <>
            {/* Markdown images have no known size, which next/image requires. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.base} src={src} alt={alt} onClick={() => { setMounted(true); setState("open"); }} />
            {mounted && (
                <Portal>
                    <div className={styles.overlay} data-state={state} onAnimationEnd={() => state === "closed" && setMounted(false)} onClick={() => setState("closed")}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt={alt} data-state={state} />
                    </div>
                </Portal>
            )}
        </>
    );
};

export default LightboxImage;
