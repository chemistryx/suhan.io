import "server-only";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

// Stored as scrypt$<salt hex>$<hash hex>.

const derive = promisify(scrypt) as (password: string, salt: Buffer, keylen: number) => Promise<Buffer>;

export const hashPassword = async (password: string) => {
    const salt = randomBytes(16);
    return `scrypt$${salt.toString("hex")}$${(await derive(password, salt, 32)).toString("hex")}`;
};

export const verifyPassword = async (password: string, stored: string | null) => {
    const [scheme, salt, hash] = stored?.split("$") ?? [];
    if (scheme !== "scrypt" || !salt || !hash) return false;

    const expected = Buffer.from(hash, "hex");
    return timingSafeEqual(await derive(password, Buffer.from(salt, "hex"), expected.length), expected);
};
