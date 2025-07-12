import type { Metadata } from "next";
import "@/styles/global.scss";

export const metadata: Metadata = {
    title: "하수한 Suhan Ha",
    description: "",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="ko">
            <body>
                {children}
            </body>
        </html>
    );
}
