import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://kaipov24.github.io/arsenal-countdown";

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date("2026-06-30"),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}