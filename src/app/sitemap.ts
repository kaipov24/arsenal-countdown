import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://kaipov24.github.io/arsenal-countdown/",
      lastModified: new Date("2026-07-02"),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}