import { games } from "@/data/games";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  // 基础URL
  const baseUrl = "https://gamecollectionhub.example.com";
  
  // 获取所有游戏分类
  const categories = [...new Set(games.map(game => game.category))];
  
  // 静态页面
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/games`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ];
  
  // 游戏页面
  const gamePages = games.map(game => ({
    url: `${baseUrl}/games/${game.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
  
  // 分类页面
  const categoryPages = categories.map(category => ({
    url: `${baseUrl}/categories/${encodeURIComponent(category)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
  
  // 合并所有页面
  return [...staticPages, ...gamePages, ...categoryPages];
} 