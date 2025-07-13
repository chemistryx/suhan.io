import type { Metadata } from "next";
import "@/styles/global.scss";
import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import Footer from "@/components/Footer";

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

export default function RootLayout({ children }: Props) {
    return (
        <html lang="ko">
            <body>
                <Container>
                    <main>
                        <Navbar />
                        <section className="content">
                            {children}
                        </section>
                    </main>
                    <Footer />
                </Container>
            </body>
        </html>
    );
}
