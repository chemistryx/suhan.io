import styles from "@/styles/pages/HomePage.module.scss";
import Link from "next/link";

export default function HomePage() {
    return (
        <div className={styles.base}>
            <div className={styles.leading}>
                <p style={{ animationDelay: "0s" }}>모두가 쉽게 사용할 수 있고, 실생활에서의 불편함을 해결할 수 있는 서비스를 만드는 데 관심이 많습니다.</p>
                <p style={{ animationDelay: "0.2s" }}>새로운 기술을 접하는 것을 꺼리지 않으며, 한번 시작한 것은 끝까지 마무리하는 끈기를 지니고 있습니다.</p>
            </div>
            <div className={styles.works}>
                <h3 className={styles.heading}>최근 작업물</h3>
                <div className={styles.cards}>
                    <Link href="https://github.com/chemistryx/rokaf-letter" target="_blank" style={{ animationDelay: "0.7s" }}>
                        <div className={styles.card}>
                            <h4 className={styles.title}>rokaf-letter</h4>
                            <p className={styles.description}>공군 인터넷 편지 작성 절차를 간략하게 만들어주는 웹 서비스입니다.</p>
                        </div>
                    </Link>
                    <Link href="https://github.com/chemistryx/self-diagnosis-ios-shortcuts" target="_blank" style={{ animationDelay: "0.8s" }}>
                        <div className={styles.card}>
                            <h4 className={styles.title}>self-diagnosis-ios-shortcuts</h4>
                            <p className={styles.description}>건강상태 자가진단 단축어</p>
                        </div>
                    </Link>
                    <Link href="https://github.com/chemistryx/hyde" target="_blank" style={{ animationDelay: "0.9s" }}>
                        <div className={styles.card}>
                            <h4 className={styles.title}>hyde</h4>
                            <p className={styles.description}>개인 블로그 / 포트폴리오 템플릿입니다.</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div >
    );
}
