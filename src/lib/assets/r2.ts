import "server-only";
import { AwsClient } from "aws4fetch";

// R2 through its S3 API; aws4fetch signs the requests.

const bucket = () => {
    const { CLOUDFLARE_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET } = process.env;
    if (!CLOUDFLARE_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET) throw new Error("R2_* env vars are not set");

    return {
        client: new AwsClient({ accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY, service: "s3", region: "auto" }),
        url: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET}`
    };
};

const send = async (path: string, init: RequestInit = {}) => {
    const { client, url } = bucket();
    const res = await client.fetch(`${url}${path}`, { ...init, cache: "no-store" });
    if (!res.ok) throw new Error(`R2 ${init.method ?? "GET"} ${path}: ${res.status} ${await res.text()}`);

    return res;
};

const UPLOAD_HEADERS = { "cache-control": "public, max-age=31536000, immutable" };

/** A URL the browser can PUT the file to directly, valid for 10 minutes. */
export const presignPut = async (key: string, contentType: string) => {
    const { client, url } = bucket();
    const headers = { ...UPLOAD_HEADERS, "content-type": contentType };
    const signed = await client.sign(`${url}/${key}?X-Amz-Expires=600`, { method: "PUT", headers, aws: { signQuery: true, allHeaders: true } });

    // The browser must send exactly these headers, since they are signed.
    return { url: signed.url, headers };
};

export const deleteObject = (key: string) => send(`/${key}`, { method: "DELETE" });

export type ObjectInfo = { key: string; lastModified: Date };

const tag = (xml: string, name: string) => xml.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`))?.[1];

export const listObjects = async (): Promise<ObjectInfo[]> => {
    const objects: ObjectInfo[] = [];
    let token: string | undefined;

    do {
        const query = new URLSearchParams({ "list-type": "2", ...(token && { "continuation-token": token }) });
        const xml = await (await send(`?${query}`)).text();

        for (const [, item] of xml.matchAll(/<Contents>([\s\S]*?)<\/Contents>/g)) {
            const key = tag(item, "Key");
            const modified = tag(item, "LastModified");
            if (key && modified) objects.push({ key, lastModified: new Date(modified) });
        }

        token = tag(xml, "IsTruncated") === "true" ? tag(xml, "NextContinuationToken") : undefined;
    } while (token);

    return objects;
};
