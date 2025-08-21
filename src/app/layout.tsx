import type { Metadata, Viewport } from "next";
import "@/styles/global.scss";
import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
    }
};

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#fffff0" },
        { media: "(prefers-color-scheme: dark)", color: "#1e1e1c" },
    ],
};

const font = localFont({
    src: [
        {
            path: "../../public/fonts/MaruBuri-ExtraLight.woff2",
            weight: "200",
        },
        {
            path: "../../public/fonts/MaruBuri-Light.woff2",
            weight: "300",
        },
        {
            path: "../../public/fonts/MaruBuri-Regular.woff2",
            weight: "400",
        },
        {
            path: "../../public/fonts/MaruBuri-SemiBold.woff2",
            weight: "600",
        },
        {
            path: "../../public/fonts/MaruBuri-Bold.woff2",
            weight: "700",
        },
    ],
    variable: "--font-family",
    fallback: ["-apple-system", "BlinkMacSystemFont", "system-ui", "Roboto", "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "sans-serif"]
});

export default function RootLayout({ children }: Props) {
    return (
        <html lang="ko" className={font.variable}>
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
            </body>
        </html>
    );
}
