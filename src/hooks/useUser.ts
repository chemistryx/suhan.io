"use client"
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { setTrackingDisabled } from "@/lib/analytics";

export type User = { login: string };

// Shared by every component on the page, so the session is fetched once.
let session: Promise<User | null> | null = null;

const loadSession = () => {
    session ??= fetch("/api/auth/session")
        .then((res) => res.json())
        .then((data) => data.user as User | null)
        .then((user) => {
            setTrackingDisabled(Boolean(user));
            return user;
        })
        .catch(() => null);

    return session;
};

const useUser = () => {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    // A full navigation: the login route answers with a redirect to GitHub.
    const signIn = () => {
        window.location.assign(new URL(`/api/auth/login?next=${encodeURIComponent(pathname)}`, window.location.origin));
    };

    const signOut = async () => {
        const res = await fetch("/api/auth/session", { method: "DELETE" });

        if (!res.ok) {
            toast.error("로그아웃 중 오류가 발생했습니다.");
            return;
        }

        session = Promise.resolve(null);
        setTrackingDisabled(false);
        setUser(null);
        toast.success("성공적으로 로그아웃했습니다.");
        router.push("/");
        router.refresh();
    };

    useEffect(() => {
        let active = true;
        loadSession().then((u) => { if (active) setUser(u); });

        return () => { active = false; };
    }, []);

    return { user, signIn, signOut };
};

export default useUser;
