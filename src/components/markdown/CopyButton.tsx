"use client"
import { Checkmark, Copy } from "@carbon/icons-react";
import { useState } from "react";

// Positioned and coloured by the editor preview's stylesheet through .copied.
const CopyButton = ({ code }: { code: string }) => {
    const [copied, setCopied] = useState(false);

    const handleClick = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // clipboard can be blocked; nothing to undo
        }
    };

    return (
        <div className={["copied", copied ? "active" : ""].join(" ")} onClick={handleClick}>
            {copied ? <Checkmark size={12} aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
        </div>
    );
};

export default CopyButton;
