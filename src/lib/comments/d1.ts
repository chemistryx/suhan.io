import "server-only";

// Cloudflare D1 through its REST API.

type Value = string | number | null;

export const query = async <T>(sql: string, params: Value[] = []): Promise<T[]> => {
    const { CLOUDFLARE_ACCOUNT_ID: account, D1_DATABASE_ID: database, CLOUDFLARE_API_TOKEN: token } = process.env;
    if (!account || !database || !token) throw new Error("CLOUDFLARE_ACCOUNT_ID, D1_DATABASE_ID or CLOUDFLARE_API_TOKEN is not set");

    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}/d1/database/${database}/query`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ sql, params }),
        cache: "no-store"
    });

    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(`D1: ${JSON.stringify(json.errors ?? json)}`);

    return json.result[0].results as T[];
};
