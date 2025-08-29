import { ImgHTMLAttributes, useEffect, useState } from "react";
import styles from "@/styles/components/LightboxImage.module.scss";
import { Portal } from "@radix-ui/react-portal";

const LightboxImage = ({ src, alt }: ImgHTMLAttributes<HTMLImageElement>) => {
    const [state, setState] = useState<"closed" | "open">("closed");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (state === "open") setMounted(true);
    }, [state]);

    return (
        <>
            <img className={styles.base} src={src} alt={alt} onClick={() => setState("open")} />
            {mounted && (
                <Portal>
                    <div className={styles.overlay} data-state={state} onAnimationEnd={() => state === "closed" && setMounted(false)} onClick={() => setState("closed")}>
                        <img src={src} alt={alt} data-state={state} />
                    </div>
                </Portal>
            )}
        </>
    );
};

export default LightboxImage;
