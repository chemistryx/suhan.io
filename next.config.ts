import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Stop next dev from generating AGENTS.md / CLAUDE.md on every run.
    agentRules: false
};

export default nextConfig;
