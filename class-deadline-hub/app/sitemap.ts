import type { MetadataRoute } from "next";
import { getDeadlines } from "@/lib/data";
import { siteUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const deadlines = await getDeadlines();
  const baseUrl = siteUrl;
  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/deadlines`, changeFrequency: "hourly", priority: 0.9 },
    ...deadlines.map((deadline) => ({
      url: `${baseUrl}/deadlines/${deadline.id}`,
      lastModified: new Date(deadline.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
