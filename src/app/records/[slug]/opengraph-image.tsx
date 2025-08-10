import { Tag } from "@/types/tag";
import { fetchRecord } from "@/utils/records";
import { toDateString } from "@/utils/strings";
import { readFile } from "fs/promises";
import { ImageResponse } from "next/og";
import { join } from "path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
    children: React.ReactNode;
}

export default async function Image({ params }: { params: { slug: string } }) {
    const { data, error } = await fetchRecord(encodeURIComponent(decodeURIComponent(params.slug)));
    if (!data || error) throw new Error(error?.message);

    const record = { ...data, tags: data.tags.flatMap((t: { tag: Tag }) => t.tag) };

    const maruBuriRegular = await readFile(join(process.cwd(), "public/fonts/MaruBuri-Regular.otf"));
    const maruBuriSemiBold = await readFile(join(process.cwd(), "public/fonts/MaruBuri-SemiBold.otf"));

    const profileData = await readFile(join(process.cwd(), "public/profile.png"));
    const profileSrc = Uint8Array.from(profileData).buffer;

    const Header = ({ children }: Props) => {
        return (
            <div id="header" style={{
                display: "flex",
                flexShrink: 0,
                alignItems: "center",
                gap: "1rem",
            }}>
                {children}
            </div>
        );
    };

    const Content = ({ children }: Props) => {
        return (
            <div id="content" style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                flex: 1,
                gap: "1rem"
            }}>
                {children}
            </div>
        );
    };

    const Badge = ({ children }: Props) => {
        return (
            <span style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                padding: ".5rem 1rem",
                backgroundColor: "#d5d5b2",
                borderRadius: 16,
            }}>
                {children}
            </span >
        );
    };

    const Footer = ({ children }: Props) => {
        return (
            <div id="footer" style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexShrink: 0,
                fontSize: "1.5rem",
            }}>
                {children}
            </div>
        );
    };

    return new ImageResponse(
        (
            <div id="main" style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "2.5rem",
                width: "100%",
                height: "100%",
                padding: "3rem",
                background: "linear-gradient(to bottom, #fffff0, #f0f0f0);",
                color: "#2e251a",
                fontFamily: "MaruBuri-Regular",
            }}>
                <Header>
                    {/* @ts-expect-error Satori supports arraybuffer as src, so it can be ignored */}
                    <img id="profile" src={profileSrc} alt="profile" style={{ width: 72, height: 72, borderRadius: "50%" }} />
                </Header>
                <Content>
                    <h1 id="title" style={{
                        display: "-webkit-box",
                        fontFamily: "MaruBuri-SemiBold",
                        fontSize: "3.5rem",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        lineHeight: 1.5
                    }}>
                        {record.title}
                    </h1>
                    <div id="tags" style={{
                        display: "flex",
                        gap: "1rem",
                        width: "100%",
                        flexWrap: "wrap",
                        maxHeight: "8.5em",
                        overflow: "hidden"
                    }}>
                        {record.tags.map((tag: Tag) => (
                            <Badge key={tag.name}>{tag.name}</Badge>
                        ))}
                    </div>
                </Content>
                <Footer>
                    <span>{toDateString(record.created_at)}</span>
                    <span style={{ color: "#6d6d6d" }}>suhan.io</span>
                </Footer>
            </div >
        ),
        {
            ...size,
            fonts: [
                {
                    name: "MaruBuri-Regular",
                    data: maruBuriRegular,
                    style: "normal",
                    weight: 400
                },
                {
                    name: "MaruBuri-SemiBold",
                    data: maruBuriSemiBold,
                    style: "normal",
                    weight: 600
                }

            ],
            // debug: true
        }
    );
};
