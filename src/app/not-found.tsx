"use client"
import Heading from "@/components/Heading";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
    const router = useRouter();
    return (
        <>
            <Heading title="Not Found" description="요청하신 페이지를 찾을 수 없습니다." />
            <Link href="" onClick={() => router.back()}>돌아가기</Link>
        </>
    );
}
