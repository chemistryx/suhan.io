import type { Metadata, Viewport } from "next";
import "@/styles/global.scss";
import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { siteConfig, siteTitle } from "@/site.config";
import Toast from "@/components/Toast";
import localFont from "next/font/local";

interface Props {
    children: Readonly<React.ReactNode>;
}

export const metadata: Metadata = {
    title: {
        template: `%s | ${siteTitle}`,
        default: siteTitle
    },
    description: siteConfig.description,
    openGraph: {
        type: "website",
        title: {
            template: `%s | ${siteTitle}`,
            default: siteTitle
        },
        description: siteConfig.description,
        url: "/"
    },
    icons: {
        icon: [
            { url: siteConfig.profileImage, type: "image/png" },
        ],
    },
    verification: {
        google: process.env.GOOGLE_SITE_VERIFICATION,
        other: process.env.NAVER_SITE_VERIFICATION ? { "naver-site-verification": process.env.NAVER_SITE_VERIFICATION } : undefined
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
