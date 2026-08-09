import type { Metadata, Viewport } from "next";
import "@/styles/global.scss";
import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { META_TITLE } from "@/constants";
import Toast from "@/components/Toast";
import localFont from "next/font/local";

interface Props {
    children: Readonly<React.ReactNode>;
}

export const metadata: Metadata = {
    title: {
        template: `%s | ${META_TITLE}`,
        default: META_TITLE
    },
    description: "모두가 쉽게 사용할 수 있고, 실생활에서의 불편함을 해결할 수 있는 서비스를 만드는 데 관심이 많습니다.",
    openGraph: {
        type: "website",
        title: {
            template: `%s | ${META_TITLE}`,
            default: META_TITLE
        },
        description: "모두가 쉽게 사용할 수 있고, 실생활에서의 불편함을 해결할 수 있는 서비스를 만드는 데 관심이 많습니다.",
        url: "/"
    },
    icons: {
        icon: [
            { url: "/profile.png", type: "image/png" },
        ],
    },
    verification: {
        other: {
            "naver-site-verification": "8acd899e3ca013746e0a6f3590fc99709fa20b6d"
        }
    }
};

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#fcfcfc" },
        { media: "(prefers-color-scheme: dark)", color: "#0d0d0f" },
    ],
};

const font = localFont({
    src: [
        {
            path: "../../public/fonts/SUIT-Variable.woff2",
            weight: "100 900",
            style: "normal",
        }
    ],
    variable: "--font-family",
    display: "swap",
    fallback: ["-apple-system", "BlinkMacSystemFont", "system-ui", "Roboto", "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "sans-serif"]
});

export default function RootLayout({ children }: Props) {
    return (
        <html lang="ko" className={font.variable} data-scroll-behavior="smooth">
            <body>
                <Toast />
                <Container>
                    <main>
                        <Navbar />
                        <section className="content">
                            {children}
                        </section>
                    </main>
                    <Footer />
                </Container>
                <SpeedInsights />
                <Analytics />
            </body>
        </html>
    );
}
