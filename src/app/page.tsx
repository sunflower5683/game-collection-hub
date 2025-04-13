import { games } from "@/data/games";
import GameList from "@/components/game/GameList";
import { Metadata } from "next";
import { generateGameCollectionSchema, generateOrganizationSchema } from "@/app/api/schema";
import Script from "next/script";

export const metadata: Metadata = {
  title: "游戏集合站 - 畅玩免费在线游戏",
  description: "在游戏集合站体验各种免费在线游戏，包括益智、街机、动作等多种类型，让您在任何设备上都能享受游戏乐趣。",
  keywords: "在线游戏, 免费游戏, 网页游戏, 休闲游戏, 益智游戏",
};

export default function Home() {
  const featuredGames = games.filter(game => game.featured);
  const recentGames = [...games].sort(() => 0.5 - Math.random()).slice(0, 4);
  
  // 获取所有游戏分类
  const categories = [...new Set(games.map(game => game.category))];
  
  // 生成结构化数据
  const collectionSchema = generateGameCollectionSchema(featuredGames);
  const organizationSchema = generateOrganizationSchema();
  
  return (
    <div>
      {/* 结构化数据 */}
      <Script
        id="collection-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <Script
        id="organization-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      
      {/* 站点介绍 */}
      <section className="text-center py-10 mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg">
        <h1 className="text-4xl font-bold mb-4">欢迎来到游戏集合站</h1>
        <p className="max-w-2xl mx-auto text-lg">
          探索各种有趣的在线游戏，随时随地享受游戏乐趣
        </p>
      </section>
      
      {/* 精选游戏 */}
      <GameList games={featuredGames} title="精选游戏" />
      
      {/* 分类导航 */}
      <section className="py-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          游戏分类
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map(category => (
            <a 
              key={category}
              href={`/categories/${category}`}
              className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {category}游戏
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                查看所有{category}类游戏
              </p>
            </a>
          ))}
        </div>
      </section>
      
      {/* 最近添加 */}
      <GameList games={recentGames} title="最近添加" />
    </div>
  );
} 