import styles from "@/styles/components/Navbar.module.scss";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
    return (
        <nav className={styles.base}>
            <div className={styles.logoWrapper}>
                <Link className={styles.logo} href="/">
                    <Image src="/profile.png" width={38} height={38} alt="profile" />
                    <div className={styles.textWrapper}>
                        <h2 className={styles.title}>하수한</h2>
                        <p className={styles.description}>Suhan Ha</p>
                    </div>
                </Link>
            </div>
            <ul className={styles.items}>
                <li className={styles.item}>
                    <Link className={styles.link} href="/records">기록</Link>
                </li>
                <li className={styles.item}>
                    <Link className={styles.link} href="/records">기록</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
