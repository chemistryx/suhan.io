import { SITEMAP_BASEURL } from "@/constants";
import { fetchRecords } from "@/lib/records";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const { data: records } = await fetchRecords();

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: SITEMAP_BASEURL,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1.0,
        },
        {
            url: `${SITEMAP_BASEURL}/records`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9
        }
    ];

    const recordRoutes: MetadataRoute.Sitemap = records?.map((record) => ({
        url: `${SITEMAP_BASEURL}/records/${record.slug}`,
        lastModified: record.updated_at ? new Date(record.updated_at) : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
    })) ?? [];

    return [...staticRoutes, ...recordRoutes];
}
