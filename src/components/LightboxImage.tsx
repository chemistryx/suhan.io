import { ImgHTMLAttributes, useState } from "react";
import styles from "@/styles/components/LightboxImage.module.scss";
import { Portal } from "@radix-ui/react-portal";

const LightboxImage = ({ src, alt }: ImgHTMLAttributes<HTMLImageElement>) => {
    const [isOpen, setOpen] = useState(false);

    return (
        <>
            <img className={styles.base} src={src} alt={alt} onClick={() => setOpen(true)} />
            {isOpen && (
                <Portal>
                    <div className={styles.overlay} onClick={() => setOpen(false)}>
                        <img src={src} alt={alt} />
                    </div>
                </Portal>
            )}
        </>
    );
};

export default LightboxImage;
