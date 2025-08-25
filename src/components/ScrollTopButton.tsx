import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "@/styles/components/ScrollTopButton.module.scss";

const ScrollTopButton = () => {
    const [isVisible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) setVisible(true);
            else setVisible(false);

        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    return (
        <button className={[styles.base, isVisible ? styles.visible : ""].join(" ")} onClick={scrollTop}>
            <ChevronUp />
        </button>
    )
}

export default ScrollTopButton;
