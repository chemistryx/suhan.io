import type { Metadata, Viewport } from "next";
import "@/styles/global.scss";
import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";

interface Props {
    children: Readonly<React.ReactNode>;
}

export const metadata: Metadata = {
    title: {
        template: "%s | 하수한 Suhan Ha",
        default: "하수한 Suhan Ha"
    },
    description: "",
    openGraph: {
        type: "website",
        title: {
            template: "%s | 하수한 Suhan Ha",
            default: "하수한 Suhan Ha"
        },
        description: "",
        url: "/"
    }
};

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#fffff0" },
        { media: "(prefers-color-scheme: dark)", color: "#1e1e1c" },
    ],
};

export default function RootLayout({ children }: Props) {
    return (
        <html lang="ko">
            <body>
                <Toaster position="top-center" />
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
