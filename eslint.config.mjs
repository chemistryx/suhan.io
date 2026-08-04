import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const eslintConfig = [
    {
        ignores: [".next/**", "next-env.d.ts", "supabase/**"],
    },
    ...coreWebVitals,
    ...typescript,
];

export default eslintConfig;
