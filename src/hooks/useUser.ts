"use client"
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const useUser = () => {
    const supabase = createClient();
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            toast.error(error.message);
            return;
        }

        toast.success("성공적으로 로그아웃했습니다.");
        router.push("/");
    };

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };

        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => setUser(session?.user ?? null));

        return () => subscription.unsubscribe();
    }, []);

    return { user, signOut };
};

export default useUser;
